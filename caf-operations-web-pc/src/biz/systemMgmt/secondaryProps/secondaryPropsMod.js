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
import { updateProp } from './secondaryPropsServ';

const defaultModalState = {
  visible: false,
  id: '',
  code: '',
  name: '',
  describe: '',
  values: '',
}
// 初始默认状态
const defaultState = {
  // 弹窗loading
  loading: false,
  // 被编辑的属性
  modalState: cloneDeep(defaultModalState),
  //弹窗
  biz: {
    queryForm: {}
  }
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
          // dispatch({
          //   type: 'getUserList',
          //   payload: {}
          // })
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
    // 更新modalState
    *updateModalState({ payload: { value, name, objName, index }}, {put,call,select}) {
      let { modalState } = yield select(e => e[tmpModule.namespace]);
      if (!!objName) {
        if (index !== undefined) {
          modalState[objName][index][name] = value
        } else {
          modalState[objName][name] = value
        }
      } else {
        modalState[name] = value
      }
      yield put({
        type: 'listStore',
        payload: {
          modalState
        },
      });
    },
    // 编辑属性
    *updateProp({ payload }, { put, call, select }) {
      try{
        let {biz, modalState} = yield select(e => e[tmpModule.namespace])
        let copyState = cloneDeep(modalState)
        copyState.value = JSON.stringify(modalState.value)
        const {data, resultCode, resultMsg} = yield call(updateProp, parse(omit(copyState, ['visible', 'key'])))
        yield put({
          type: 'listStore',
          payload: {
            loading: false
          },
        })
        if (resultCode == 0) {
          message.success('操作成功')
          yield put({
            type: 'listStore',
            payload: {
              modalState: cloneDeep(defaultModalState),
              loading: false
            },
          })
        }
        biz.refreshListDatas()
      }catch(e){
        console.error(e)
      }
    },
    // 添加属性值
    *addProp({ payload }, { put, call, select }) {
      try{
        let { modalState } = yield select(e => e[tmpModule.namespace])
        let copyState = cloneDeep(modalState)
        copyState.values = !!copyState.values ? copyState.values : []
        copyState.values.push({
          id: '',
          value: ''
        })
        yield put({
          type: 'listStore',
          payload: {
            modalState: copyState
          },
        });
      }catch(e){
        console.error(e)
      }
    },
    // 删除属性值
    *deleteProp({ payload: { index } }, { put, call, select }) {
      try{
        let { modalState } = yield select(e => e[tmpModule.namespace])
        let copyState = cloneDeep(modalState)
        copyState.values.splice(index, 1)
        yield put({
          type: 'listStore',
          payload: {
            modalState: copyState
          },
        });
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
