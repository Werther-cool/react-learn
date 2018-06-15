/**
 * @(#)sysMessageMod.js 0.1.0 2018-03-13
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
import { listMsg, deleteMsg, markRead} from './sysMessageServ';

const search = {
  pageNum:1,
  pageSize:20,
  status:1
};

// 初始默认状态
const defaultState = {
    msgList : [],
    selectedIds : [],
    search: cloneDeep(search),
    total : 0
}


export default {
  // namespace:'sysMessageModel',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        // 页面编辑路由
        if('/home/systemMgmt/sysMessage' === '' + location.pathname){
          dispatch({ type: 'getList', payload: cloneDeep(search) })
        } else {
          dispatch({ type: 'clearState', payload: {} })
        }
      })
    },
  },
  // 方法列表
  effects: {
    *markMsg({payload:obj}, {put, call, select}) {
      try {
        const {data, resultCode, resultMsg} = yield call(markRead, parse(obj));
          if(resultCode == 0 && resultMsg == 'success') {
            message.success('操作成功')
            yield put({
              type: 'getList', payload: cloneDeep(search)
            });
          }
      }
      catch(e) {
        console.error('Err->', e);
      }
    },
    *deleteMsg({payload:obj}, {put, call, select}) {
      try {
        const {data, resultCode, resultMsg} = yield call(deleteMsg, parse(obj));
          if(resultCode == 0 && resultMsg == 'success') {
            message.success('操作成功')
            yield put({
              type: 'getList', payload: cloneDeep(search)
            });
          }
      }
      catch(e) {
        console.error('Err->', e);
      }
    },
    // 取数据列表
    *getList({payload: obj}, {put, call, select}) {
        try {
          const {data, resultCode, resultMsg} = yield call(listMsg, parse(obj));
          if(resultCode == 0 && resultMsg == 'success') {
            data.list.map((item, i)=> {
              item.key = i + 1;
            });
            yield put({
              type:'listStore',
              payload: {
                total: parseInt(data.total),
                msgList: data.list
              }
            })
          }
        } catch(e) {
          console.error(e)
        }
    },
    // 清空状态
    *clearState ({}, {call, put, select}) {
      yield put({
        type: 'listStore',
        payload: cloneDeep(defaultState),
      });
    },
    //更改状态
    *updateModel({ payload: obj}, {put,call,select}) {
      let state = yield select(e => e.sysMessageModel);
      yield put({
        type: 'listStore',
        payload: {
          ...obj
        },
      });
    },
    //关闭标签页并返回上级目录
    *closeTab({ payload: obj}, {put,call,select}) {
      let { accountId } = yield select(e => e.sysMessageModel)
      AppBus.emit('closeTab', {
        key: 'home/contentMgmt/sysMessage',
        // cbf: () => {
        //   hashHistory.push(`/home/userMgmt/userList`);
        // }
      })
    },
  },
  // 存入状态机
  reducers: {
    listStore(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

