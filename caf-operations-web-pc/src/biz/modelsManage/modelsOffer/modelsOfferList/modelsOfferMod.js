import {parse } from 'qs'

import {isEmpyt, isArray, cloneDeep, get, find} from 'lodash'

import { message } from "antd";
import {hashHistory} from 'dva/router'

import AppBus from '../../../../utils/bus'

import { listCarPrice, forceOffShelf, catalogTree, cityTree } from './modelsOfferServ';

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

const defaultModalState = {
  id: '',
  remark: '', // 备注
}

const defaultState = {
  visible: false,
  modalLoading: false,

  catalogTree: [],
  cityTree: [],
  modalState: cloneDeep(defaultModalState),
  expandedRow: [],
  biz: {
    queryForm: {}
  }
}

const tmpModule = {
  state : cloneDeep(defaultState),

  subscriptions: {
      setup({dispatch, history}) {
        history.listen(({pathname, query}) => {
          if( '' + tmpModule.pathname == pathname) {
            dispatch({ type: 'getCityTree', payload: {} })
            dispatch({ type: 'getCatalogTree', payload: {} })
          } else {
            dispatch({ type: 'clearState', payload: {} })
          }
        })
      }
  },

  effects : {
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
    //更改状态
    *updateModel({ payload: obj}, {put,call,select}) {
      try {
        yield put({
          type: 'listStore',
          payload: {
            ...obj
          },
        });
      } catch (e) {
        console.log(e)
      }
    },
    // 强制下架
    *forceOffShelf({ payload: { id } }, {put,call,select}) {
      try {
        let { modalState, biz } = yield select(d => d[tmpModule.namespace])
        let { data, resultCode, resultMsg } = yield call(forceOffShelf, modalState)
        yield put({
          type: 'listStore',
          payload: {
            modalLoading: false
          },
        });
        if (resultCode == 0) {
          message.success('操作成功!')
          yield put({
            type: 'hideModal',
            payload: {},
          });
          biz.refreshListDatas()
        }
      } catch (e) {
        console.log(e)
      }
    },
    *hideModal({ payload }, {put,call,select}) {
      yield put({
        type: 'listStore',
        payload: {
          visible: false,
          modalState: cloneDeep(defaultModalState)
        },
      });
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

    // 清空搜索条件
    *queryReset ({payload}, {call, put, select}) {
      yield put({ type: 'listStore', payload: { queryList: cloneDeep(queryList) } });
    },

    // 刷新 列表
    *getList({payload}, {call, put, select}) {
      let { search } = yield select (d => d[tmpModule.namespace])
      const { data , resultCode , resultMsg } = yield call(listCarPrice, parse(search))
      if (resultCode == 0) {
        console.log('data:', data)

      }

      yield put({
        type: 'listStore', // 方法名，也可以调用effects中的方法
        payload:{
          priceList: data.list,
          total: data.total
        }
      })

    },
    //获取省市区树
    *getCityTree({ payload }, {put,call,select}) {
      let { data, resultCode, resultMsg } = yield call(cityTree, {});
      if (resultCode == 0) {
        yield put({
          type: 'listStore',
          payload: {
            cityTree: data
          }
        });
      }
    },

    *clearState ({}, {call, put, select}) {
      yield put({
        type: 'listStore',
        payload: cloneDeep(defaultState),
      });
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
