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
import { updateUser } from './userListServ';

// 初始默认状态
const defaultState = {
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
        if('/home/systemMgmt/userList' === '' + location.pathname){
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
    // 用户解锁
    *userUnlock({ payload }, { put, call, select }) {
      // try{
      //   let {biz} = yield select(e => e[tmpModule.namespace])
      //   const {data, resultCode, resultMsg} = yield call(userLock, parse(payload))
      //   if (resultCode != 0) {
      //     message.error(resultMsg, 5);
      //     return;
      //   }
      //   yield delayFunc(1500)
      //   message.success('操作成功')
      //   biz.refreshListDatas()
      // }catch(e){
      //   console.error(e)
      // }
    },

    //用户起禁、用
    *updateUser({ payload }, { put, call, select }) {
      try{
        let { biz } = yield select(d => d[tmpModule.namespace]);
        //发送请求
        const {data, resultCode, resultMsg} = yield call(updateUser, parse(payload));
        if('0' === '' + resultCode){
          message.success('修改成功');
          biz.refreshListDatas();
        }
      }catch(e){
        console.log('起禁用出错: ', e);
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
