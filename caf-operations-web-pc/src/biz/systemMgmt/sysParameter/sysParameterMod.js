/**
 * @(#)sysParameterMod.js 0.1.0 2018-03-19
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 对象和JSON字符串互转
import { parse } from 'qs'
// 弹出消息框
import {message} from 'antd'
import {isEmpty, isArray, cloneDeep, get} from 'lodash'
// 引入路由对象
import { hashHistory } from 'dva/router'
import AppBus from '../../../utils/bus'
import {updateData} from './sysParameterServ';

// 初始默认状态
const defaultState = {
  visible:false,//弹窗
  param:{
    id:'',
    value:'',
  },//弹窗参数值
  biz: {
    queryForm: {}
  }
}
const tmpModule = {
  // // 命名空间
  // namespace: 'sysParameterModel',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        // 页面编辑路由
        if('/home/agencyMgmt/sysParameter' === '' + location.pathname){
          // dispatch({ type: 'getList', payload: {} })
        } else {
          dispatch({ type: 'clearState', payload: {} })
        }
      })
    },
  },
  // 方法列表
  effects: {
    // 提交参数
    *submitVal ({payload}, {call, put, select}) {
      let{param,biz}=yield select(d => d[tmpModule.namespace])
      let result=yield call(updateData,parse({
        ...param
      }))
      if(result.resultCode=='0'){
        message.success('设置成功！')
        biz.refreshListDatas()
      }
      yield put({
        type: 'listStore',
        payload: {
          visible:false
        },
      });
    },
    // 更新参数设置
    *setModalVal ({payload}, {call, put, select}) {
      let{param}=yield select(d => d[tmpModule.namespace])
      param.id=payload.id||param.id
      param.value=payload.value
      yield put({
        type: 'listStore',
        payload: {
          param
        },
      });
    },
    //更改状态
    *changeStatus({ payload}, {put,call,select}) {
      let {visible,param} = yield select(d => d[tmpModule.namespace]);
      visible=payload.value
      if(visible===false){
        param.id=''
        param.value=''
      }
      yield put({
        type: 'listStore',
        payload: {
          visible,
          param
        },
      });
    },
    //关闭标签页并返回上级目录
    *closeTab({ payload: obj}, {put,call,select}) {
      let { accountId } = yield select(d => d[tmpModule.namespace])
      AppBus.emit('closeTab', {
        key: 'home/contentMgmt/sysParameter',
        // cbf: () => {
        //   hashHistory.push(`/home/userMgmt/userList`);
        // }
      })
    },
    // 清空状态
    *clearState ({}, {call, put, select}) {
      yield put({
        type: 'listStore',
        payload: cloneDeep(defaultState),
      });
    },
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
  },
  // 存入状态机
  reducers: {
    listStore(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}
export default tmpModule

