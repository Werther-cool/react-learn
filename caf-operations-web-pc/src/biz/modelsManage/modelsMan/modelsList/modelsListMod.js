/**
 * @(#)modelsListMod.js 0.1.0 2018-03-17
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
import AppBus from '../../../../utils/bus'
import { labelList, toggleStatus, catalogTree, brandList } from './modelsListServ';
// import { getList, addPartner, updateFooter, deleteFooter, sortFooter } from './departManageServ';

// 初始默认状态
const defaultState = {
  labelList: [],
  brandList: [],
  catalogTree: [],
  biz: {
    queryForm: {}
  }
}

function treeDataInit(treeData, labelName, valueName) {
  // 将树结构数据初始化, labelName为想要设为label的字段名, valueName为想要设为value的字段名
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i];
    item.label = item[labelName] + ''
    item.value = item[valueName] + ''
    item.key = item.id + ''
    delete item.title
    if (!!item.children && isArray(item.children)) {
      treeDataInit(item.children, labelName, valueName)
    }
  }
}

const tmpModule = {
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(({pathname, query}) => {
        if('' + tmpModule.pathname === '' + pathname) {
          dispatch({ type: 'getCatalogTree', payload: {} })
          dispatch({ type: 'getLabelList', payload: {} })
          dispatch({ type: 'getBrandList', payload: {} })
        } else {
          dispatch({ type: 'clearState', payload: {} })
        }
      })
    },
  },
  // 方法列表
  effects: {
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
    *getLabelList ({}, {call, put, select}) {
      let { data, resultCode, resultMsg } = yield call(labelList, {type: 1})
      if (resultCode == 0) {
        yield put({
          type: 'listStore',
          payload: {
            labelList: data
          }
        });
      }
    },
    // 停售/发布
    *toggleStatus ({ payload: obj }, {call, put, select}) {
      let { biz } = yield select(d => d[tmpModule.namespace])
      let { data, resultCode, resultMsg } = yield call(toggleStatus, obj)
      if (resultCode == 0) {
        message.success('操作成功!')
        biz.refreshListDatas(true)
      }
    },
    // 获取车型类目
    *getCatalogTree({ payload }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(catalogTree)
        if (resultCode == 0) {
          treeDataInit(data, 'name', 'id')
          yield put({
            type: 'listStore',
            payload: {
              catalogTree: data
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取品牌列表
    *getBrandList({ payload }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(brandList, {pageSize: 999, pageNum: 1})
        if (resultCode == 0) {
          let brandList = isArray(data.list) ? data.list.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          }) : []
          yield put({
            type: 'listStore',
            payload: {
              brandList
            }
          })
        }
      } catch (e) {
        console.error(e);
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

export default tmpModule;
