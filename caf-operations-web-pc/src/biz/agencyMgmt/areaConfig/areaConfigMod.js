/**
 * @(#)areaConfigMod.js 0.1.0 2018-03-23
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 对象和JSON字符串互转
import { parse } from 'qs'
// 弹出消息框
import {message} from 'antd'
// 日期处理对象
import moment from 'moment'
/* isEmpty 对象是否为空
 * isArray 对象是否数组
 * cloneDeep 对象深拷贝
 */
import {isEmpty, isArray, cloneDeep, merge} from 'lodash'

// 引入路由对象
import { hashHistory } from 'dva/router'
import { areaTree, cityTree, addNode, saveNode, deleteNode, nodeDetail} from './areaConfigServ';

// 初始默认状态
const defaultState = {
  areaTree:[],
  areaTreeList:[],
  cityTree:[],//省市区树
  treeVisible:false,
  nodeName:'',
  city:[],
  //详情使用字段
  orgName:'',
  orgCode:'',
  cityList:[],
  //树数据
  expandedKeys: [],
  searchValue: '',
  autoExpandParent: true,
  selectedKeys:'',//当前选中的节点
  isLeaf:false,

  addLoading:false,
  saveLoading:false,
}

const tmpModule = {
  // // 命名空间
  // namespace: 'secondaryPropsModel',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        // 页面编辑路由
        if(tmpModule.pathname === '' + location.pathname){
          // 执行业务操作
          dispatch({type: 'getAreaTree', payload: {}})
          dispatch({type: 'getCityTree', payload: {}})
        }
      })
    },
  },
  // 方法列表
  effects: {

    //获取区域树
    *getAreaTree({ payload }, {put,call,select}) {
      let { data, resultCode, resultMsg } = yield call(areaTree, {orgId:0});
      let areaTreeList = tree2list(data)
      if (resultCode == 0) {
        yield put({
          type: 'store',
          payload: {
            areaTree:data,
            areaTreeList
          }
        });
      }
    },

    //获取省市区树
    *getCityTree({ payload }, {put,call,select}) {
      let { data, resultCode, resultMsg } = yield call(cityTree, {});
      if (resultCode == 0) {
        yield put({
          type: 'store',
          payload: {
            cityTree:data
          }
        });
      }
    },

    *addNode({ payload }, { put, call, select }) {
      let {nodeName,selectedKeys} = yield select(e => e[tmpModule.namespace]);
      if(nodeName === ''){
        return message.error('节点名称不能为空')
      }
      yield put({ type: 'store', payload: {addLoading:true} });
      let { data, resultCode, resultMsg } = yield call(addNode, {
        name:nodeName,parentId:selectedKeys
      });
      yield put({ type: 'store', payload: {addLoading:false} });
      if (resultCode == 0) {
        message.success('新增成功')
        yield put({ type: 'store', payload: {treeVisible:false} });
        yield put({ type: 'getAreaTree'});
      }
    },

    *saveNode({ payload }, { put, call, select }) {
      let {orgName,orgCode,selectedKeys,parentId,cityList} = yield select(e => e[tmpModule.namespace]);
      if(!orgCode){
        return message.error('区域编号不能为空')
      }
      if(!orgName){
        return message.error('区域名称不能为空')
      }
      yield put({ type: 'store', payload: {saveLoading:true} });
      let { data, resultCode, resultMsg } = yield call(saveNode, {
        id:selectedKeys,parentId,orgName,orgCode,cityList
      });
      yield put({ type: 'store', payload: {saveLoading:false} });
      if (resultCode == 0) {
        message.success('保存成功')
        yield put({ type: 'getAreaTree'});
      }
    },

    *deleteNode({ payload }, { put, call, select }) {
      let {selectedKeys} = yield select(e => e[tmpModule.namespace]);
      let { data, resultCode, resultMsg } = yield call(deleteNode, {
        id:selectedKeys
      });
      if (resultCode == 0) {
        message.success('删除成功')
        yield put({ type: 'getAreaTree'});
        yield put({type: 'store', payload: {selectedKeys:''}});
      }
    },

    *getSelectDetail({ payload }, { put, call, select }) {
      let {areaTreeList} = yield select(e => e[tmpModule.namespace]);
      if (payload.selectedKeys){//是否选中节点
        let { data, resultCode, resultMsg } = yield call(nodeDetail, {
          orgId:payload.selectedKeys
        });
        if (resultCode == 0) {
          yield put({ type: 'store', payload: {
            orgName:data.orgName,
            orgCode:data.orgCode,
            cityList:data.cityList
          } });
        }
      }else{
        
      }
      let isLeaf = false
      areaTreeList.map((obj,idx) => {
        if((obj.id === payload.selectedKeys) && (obj.children.length === 0)){
          isLeaf = true
        }
      })
      yield put({ type: 'store', payload: {selectedKeys:payload.selectedKeys,parentId:payload.parentId,isLeaf} });
    },

    *addCity({ payload }, { put, call, select }) {
      let {city,cityList} = yield select(e => e[tmpModule.namespace]);
      if(city.length === 0){
        return message.error('请先选择城市')
      }
      let obj = {}
      let flag = false
      cityList.map((obj,idx) => {
        if(obj.cityId === city[1].value){
          flag = true
        }
      })
      if(flag){
        return message.error('不能添加重复的城市')
      }else{
        obj.cityId = city[1].value
        obj.cityCode = city[1].code
        obj.cityName = city[0].label + city[1].label
        cityList.push(obj)
      }
      yield put({ type: 'store', payload: {
        cityList
      } });
    },

    *deleteCity({ payload }, { put, call, select }) {
      let {cityList} = yield select(e => e[tmpModule.namespace]); 
      cityList.splice(payload.index,1)
      yield put({ type: 'store', payload: {
        cityList
      } });
    },

    *changeModal({ payload }, { put, call, select }) {
      let obj = {}
      obj[payload.type] = payload.visible
      yield put({ type: 'store', payload: {...obj} });
    },

    *getSearchKey({ payload }, { call, put, select }){
      yield put({
        type: 'store',
        payload: {
          expandedKeys:payload.expandedKeys,
          searchValue:payload.searchValue,
          autoExpandParent:payload.autoExpandParent
        }
      });
    },

    *onExpand({ payload }, { call, put, select }){
      yield put({
        type: 'store',
        payload: {
          expandedKeys:payload.expandedKeys,
          autoExpandParent:payload.autoExpandParent
        }
      });
    },

    //提交
    *updateModel({ payload: obj}, {put,call,select}) {
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

//树形结构转列表
function tree2list(tree) {
  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node);
      if (node.children && node.children.length > 0) {
        generateList(node.children);
      }
    }
  };
  generateList(tree);
  return dataList.slice(0);
}

export default tmpModule
