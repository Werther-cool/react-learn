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
import {isEmpty, isArray, cloneDeep, merge, omit} from 'lodash'

// 引入路由对象
import { hashHistory } from 'dva/router'
import { areaTree } from './agencyListServ';

const treeNodeInit = tree => {
  tree.map(e => {
    e.label = e.name
    e.value = e.id
    if (!!e.children && e.children.length > 0) {
      treeNodeInit(e.children)
    }
  })
}

const defaultModalState = {
  visible: false,
  id: '',
  code: '',
  name: '',
  describe: '',
  value: '',
}
// 初始默认状态
const defaultState = {
  // 区域树
  areaTree: [],
  // 被编辑的属性
  modalState: cloneDeep(defaultModalState),
  //弹窗
  biz: {
    queryForm: {}
  }
}

const tmpModule = {
  // // 命名空间
  // namespace: 'agencyListModel',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        // 页面编辑路由
        if(tmpModule.pathname === '' + location.pathname){
          // 执行业务操作
          dispatch({
            type: 'getAreaTree',
            payload: {}
          })
        }
      })
    },
  },
  // 方法列表
  effects: {
    // 设置表单的值到状态机
    *setFormVal({ payload }, { put, call, select }) {
      let { biz } = yield select(d => d[tmpModule.namespace])
      try{
        yield put({
          type: 'listStore',
          payload: {
            biz: payload
          }
        })
      }catch(e){
        console.error(e)
      }
    },
    //提交
    *updateModel({ payload: obj}, {put,call,select}) {
      let state = yield select(e => e[tmpModule.namespace]);
      yield put({
        type: 'listStore',
        payload: {
          ...obj
        },
      });
    },
    // 用户解锁
    *getAreaTree({ payload }, { put, call, select }) {
      try{
        const {data, resultCode, resultMsg} = yield call(areaTree)
        if (resultCode != 0) {
          // message.error(resultMsg, 5);
          return;
        }
				// treeNodeInit(data)
        yield put({
          type: 'listStore',
          payload: {
            areaTree: data
          },
        })
      }catch(e){
        console.error(e)
      }
    },
  },
  // 存入状态机
  reducers: {
    listStore(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

export default tmpModule
