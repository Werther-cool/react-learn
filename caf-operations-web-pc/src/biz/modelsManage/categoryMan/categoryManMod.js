/**
 * @(#)categoryManMod.js 0.1.0 2018-03-23
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 对象和JSON字符串互转
import { parse } from 'qs'
// 弹出消息框
import { message } from 'antd'
// 日期处理对象
import moment from 'moment'
/* isEmpty 对象是否为空
 * isArray 对象是否数组
 * cloneDeep 对象深拷贝
 */
import { isEmpty, isArray, cloneDeep, merge } from 'lodash'

// 引入路由对象
import { hashHistory } from 'dva/router'
import { catalogTree, addNode, nodeDetail, updateNode, updateNodeStatus, deleteNode, sortNode, addPropGroup, updatePropGroup, deletePropGroup, propGroupList, copyPropGroup } from './categoryManServ';
//延迟
const delayFunc = function (delayed) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, delayed)
  })
}
// 初始默认状态
const defaultState = {
  //弹窗
  biz: {
    queryForm: {}
  },
  catalogTree: [],//树
  nodeName: '',//添加节点的名称
  treeVisible: false,//添加节点的弹出框
  parentId: '1',
  //详情使用字段
  title: '',
  statement: '',
  imgUrl: '',
  earnest:'',
  status: 1,
  //树数据
  expandedKeys: [],
  searchValue: '',
  autoExpandParent: true,
  selectedKeys: '',//当前选中的节点
  //属性相关字段
  propGroupVisible: false,
  propVisible: false,
  propGroupList: [],//属性组列表
  propGroupName: '',//属性组名字
  propGroup: [],//属性组(弹出框里的)
  propGroupId: '',//属性组id

  sourceId: '',
  targetId: '',

  addNodeLoading:false,
  saveNodeLoading:false,
  addPropLoading:false,
}

const tmpModule = {
  // // 命名空间
  // namespace: 'secondaryPropsModel',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        // 页面编辑路由
        if (tmpModule.pathname === '' + location.pathname) {
          // 执行业务操作
          dispatch({ type: 'getCatalogTree', payload: {} })
        }
      })
    },
  },
  // 方法列表
  effects: {

    *getCatalogTree({ payload }, { put, call, select }) {
      let { data, resultCode, resultMsg } = yield call(catalogTree, {});
      if (resultCode == 0) {
        yield put({
          type: 'store',
          payload: {
            catalogTree: data
          }
        });
      }
    },

    *addNode({ payload }, { put, call, select }) {
      let { nodeName, parentId, status, selectedKeys } = yield select(e => e[tmpModule.namespace]);
      if (nodeName === '') {
        return message.error('类目名称不能为空')
      }
      yield put({ type: 'store', payload: { addNodeLoading: true } });
      let { data, resultCode, resultMsg } = yield call(addNode, {
        title: nodeName,
        parentId,
        status,
        type: 1
      });
      yield put({ type: 'store', payload: { addNodeLoading: false } });
      if (resultCode == 0) {
        message.success('新增成功')
        yield put({ type: 'store', payload: { treeVisible: false } });
        yield put({ type: 'getCatalogTree' });
      }
    },

    *updateNode({ payload }, { put, call, select }) {
      let { title, statement, imgUrl, earnest, status, selectedKeys } = yield select(e => e[tmpModule.namespace]);
      if(!title){
        return message.error('类目名称不能为空')
      }
      if(!earnest){
        return message.error('特惠车订金额度不能为空')
      }
      yield put({ type: 'store', payload: { saveNodeLoading: true } });
      let { data, resultCode, resultMsg } = yield call(updateNode, {
        title, statement, imgUrl,earnest, id: selectedKeys
      });
      yield call(updateNodeStatus, { id: selectedKeys, status });
      yield put({ type: 'store', payload: { saveNodeLoading: false } });
      if (resultCode == 0) {
        message.success('保存成功')
        yield put({ type: 'getCatalogTree' });
        // yield put({ type: 'store',payload: {selectedKeys: ''} });
      }
    },

    *sortNode({ payload }, { put, call, select }) {
      let { selectedKeys } = yield select(e => e[tmpModule.namespace]);
      let { data, resultCode, resultMsg } = yield call(sortNode, { id: selectedKeys, sortType: payload.type });
      if (resultCode == 0) {
        message.success('操作成功')
        yield put({ type: 'getCatalogTree', payload: {} });
      }
    },

    *deleteNode({ payload }, { put, call, select }) {
      let { data, resultCode, resultMsg } = yield call(deleteNode, { id: payload.id })
      if (resultCode == 0) {
        message.success('操作成功!')
        yield put({ type: 'getCatalogTree' });
      }
    },

    *getSelectDetail({ payload }, { put, call, select }) {
      if (payload.selectedKeys) {//是否选中节点
        let { data, resultCode, resultMsg } = yield call(nodeDetail, {
          id: payload.selectedKeys
        });
        if (resultCode == 0) {
          yield put({
            type: 'store', payload: {
              selectedKeys: payload.selectedKeys,
              title: data.title,
              statement: data.statement,
              imgUrl: data.imgUrl,
              earnest:data.earnest,
              status: data.status
            }
          });
        }
        yield put({ type: 'propGroupList', payload: { selectedKeys: payload.selectedKeys } });
      } else {
        yield put({ type: 'store', payload: { selectedKeys: payload.selectedKeys } });
      }
    },

    *propGroupList({ payload }, { put, call, select }) {
      let { selectedKeys } = yield select(e => e[tmpModule.namespace]);
      let { data, resultCode, resultMsg } = yield call(propGroupList, { catalogId: selectedKeys || payload.selectedKeys, pageNum: 1, pageSize: 10 });
      data.list.map((obj, idx) => {
        obj.key = idx
      })
      if (resultCode == 0) {
        yield put({
          type: 'store', payload: {
            propGroupList: data.list
          }
        });
      }
    },

    *savePropGroup({ payload }, { put, call, select }) {
      let { propGroupName, propGroup, selectedKeys, propGroupId } = yield select(e => e[tmpModule.namespace]);
      if(!propGroupName){
        return message.error('属性组名称不能为空')
      }
      if(propGroup.length === 0){
        return message.error('属性不能为空')
      }
      let props = []
      propGroup.map((obj, idx) => {
        let object = {}
        object.id = obj.id
        object.screenPriority = parseInt(obj.screenPriority)
        if (obj.salesType) {
          object.salesType = 1
        } else {
          object.salesType = 0
        }
        if (obj.screenType) {
          object.screenType = 1
        } else {
          object.screenType = 0
        }
        props.push(object)
      })
      yield put({ type: 'store', payload: { addPropLoading: true } });
      let { data, resultCode, resultMsg } = yield call(propGroupId === '' ? addPropGroup : updatePropGroup, { catalogId: selectedKeys, name: propGroupName, props, id: propGroupId });
      // yield delayFunc(3000);
      yield put({ type: 'store', payload: { addPropLoading: false } });
      if (resultCode == 0) {
        message.success('保存成功')
        yield put({ type: 'propGroupList' });
        yield put({
          type: 'store', payload: {
            propGroupVisible: false
          }
        });
      }
    },

    *deletePropGrop({ payload }, { put, call, select }) {
      let { data, resultCode, resultMsg } = yield call(deletePropGroup, { id: payload.id });
      if (resultCode == 0) {
        message.success('删除成功')
        yield put({ type: 'propGroupList' });
      }
    },

    *onCopy({ payload }, { put, call, select }) {
      let { sourceId, targetId } = yield select(e => e[tmpModule.namespace]);
      if (payload.type === 'copy') {
        yield put({ type: 'store', payload: { sourceId: payload.id } });
        message.success('复制成功')
      }
      if (payload.type === 'paste') {
        yield put({ type: 'store', payload: { targetId: payload.id } });
        let { data, resultCode, resultMsg } = yield call(copyPropGroup, { sourceId, targetId: payload.id });
        if (resultCode == 0) {
          message.success('粘贴成功')
          yield put({ type: 'propGroupList' });
        }
      }
    },

    *addProp({ payload }, { put, call, select }) {
      let { propGroup } = yield select(e => e[tmpModule.namespace]);
      let clonePropGroup = cloneDeep( propGroup )
      let obj = cloneDeep(payload.item)
      obj.salesType = false
      obj.screenType = false
      obj.screenPriority = 0
      clonePropGroup.push(obj)
      clonePropGroup.map((obj, idx) => {
        obj.key = idx
      })
      yield put({
        type: 'store',
        payload: {
          propGroup: clonePropGroup
        }
      });
    },

    *updateProp({ payload }, { put, call, select }) {
      let { propGroup } = yield select(e => e[tmpModule.namespace]);
      propGroup[payload.index][payload.type] = payload.value
      if(payload.type === 'salesType' && payload.value && propGroup[payload.index].screenType){
        propGroup[payload.index].screenType = false
      }
      if(payload.type === 'screenType' && payload.value && propGroup[payload.index].salesType){
        propGroup[payload.index].salesType = false
      }
      yield put({
        type: 'store',
        payload: {
          propGroup
        }
      });
    },

    *deleteProp({ payload }, { put, call, select }) {
      let { propGroup } = yield select(e => e[tmpModule.namespace]);
      propGroup.splice(payload.index, 1)
      yield put({
        type: 'store',
        payload: {
          propGroup
        }
      });
    },

    *changeModal({ payload }, { put, call, select }) {
      let { selectedKeys, propGroupList } = yield select(e => e[tmpModule.namespace]);
      let obj = {}
      obj[payload.type] = payload.visible
      if (payload.type === 'treeVisible') {
        obj.nodeName = ''
        if (payload.root) {
          obj.parentId = '1'
        } else {
          obj.parentId = selectedKeys
        }
      }
      if (payload.propGroupId) {
        let propGroup = []
        let index = 0
        propGroupList.map((obj, idx) => {
          if (payload.propGroupId === obj.id) {
            propGroup = cloneDeep(obj.prop)
            index = idx
          }
        })
        propGroup.map((obj, idx) => {
          obj.key = idx
          if (obj.salesType) {
            obj.salesType = true
          } else {
            obj.salesType = false
          }
          if (obj.screenType) {
            obj.screenType = true
          } else {
            obj.screenType = false
          }
        })
        yield put({ type: 'store', payload: { propGroup, propGroupName: propGroupList[index].name, propGroupId: payload.propGroupId } });
      }
      if (payload.addPropGroup) {
        obj.propGroupName = ''
        obj.propGroup = []
        obj.propGroupId = ''
      }
      yield put({ type: 'store', payload: { ...obj } });
    },

    *getSearchKey({ payload }, { call, put, select }) {
      yield put({
        type: 'store',
        payload: {
          expandedKeys: payload.expandedKeys,
          searchValue: payload.searchValue,
          autoExpandParent: payload.autoExpandParent
        }
      });
    },

    *onExpand({ payload }, { call, put, select }) {
      yield put({
        type: 'store',
        payload: {
          expandedKeys: payload.expandedKeys,
          autoExpandParent: payload.autoExpandParent
        }
      });
    },

    // 设置表单的值到状态机
    *setFormVal({ payload }, { put, call, select }) {
      let { biz } = yield select(d => d[tmpModule.namespace])
      try {
        yield put({
          type: 'store',
          payload: {
            biz: payload
          }
        })
      } catch (e) {
        console.error(e)
      }
    },

    //提交
    *updateModel({ payload: obj }, { put, call, select }) {
      let state = yield select(e => e[tmpModule.namespace]);
      yield put({
        type: 'store',
        payload: {
          ...obj
        },
      });
    },
  },
  // 存入状态机
  reducers: {
    store(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

export default tmpModule
