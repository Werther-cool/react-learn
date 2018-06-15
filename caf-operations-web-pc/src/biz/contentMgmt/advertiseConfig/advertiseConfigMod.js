// 对象和JSON字符串互转
import { parse } from 'qs'
// 弹出消息框
import { message } from 'antd'
// 日期处理对象
import moment from 'moment'
import AppBus from '../../../utils/bus'

/* isEmpty 对象是否为空
 * isArray 对象是否数组
 * cloneDeep 对象深拷贝
 */
import { isEmpty, isArray, cloneDeep, merge } from 'lodash'
// 引入路由对象
import { hashHistory } from 'dva/router'
// 引入接口文件
import { advertiseList, saveConfig, deleteAd, carList } from './advertiseConfigServ.js'

const defaultCellState = {
  advertiseId: '', // 广告id
  carId: '', // 车型id
  redirect: '', // 跳转类型 1: 不跳转 2: 跳url 3: 跳车型
  redirectUrl: '', // 跳转url
  type: '', // 广告类型: 1: 特惠车, 2: 我的消息 3: 活动 4: 我的banner
  url: '', // 广告图片url
}

// 初始默认状态
const defaultState = {
  type: '1', // tab页签id
  advertiseList: [], // 素材列表
  // pagination: {
  //   total: 0, // 总数
  //   pageNum: 1,
  //   pageSize: 10,
  // },
  carList: [],//车型列表
}

// 声明module
const tmpModule = {
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        // 页面路由匹配时执行
        if ('' + tmpModule.pathname === '' + pathname) {
          dispatch({
            type: 'getAdList',
            payload: {}
          })
          dispatch({ type: 'carList', payload: {} })
        } // end if
      }) // end listen
    },
  },

  // 方法列表
  effects: {
    // 清空状态
    *clearState({ }, { call, put, select }) {
      yield put({
        type: 'editStore',
        payload: cloneDeep(defaultState),
      });
    },
    //更改状态
    *updateModel({ payload: obj }, { put, call, select }) {
      try {
        yield put({
          type: 'editStore',
          payload: {
            ...obj
          },
        });
      } catch (e) {
        console.log(e)
      }
    },
    //关闭标签页并返回上级目录
    *closeTab({ payload }, { put, call, select }) {
      try {
        AppBus.emit('closeTab', {
          key: 'home/agencyMgmt/advertiseConfig',
          cbf: () => {
            hashHistory.push("/home/agencyMgmt/agencyList");
          }
        })
      } catch (e) {
        console.error(e);
      }
    },

    // 车型列表
    *carList({ payload }, { put, call, select }) {
      let { data, resultCode, resultMsg } = yield call(carList, {});
      if (resultCode == 0) {
        yield put({ type: 'editStore', payload: { carList: data.list } })
      }
    },

    // 获取广告列表
    *getAdList({ payload }, { put, call, select }) {
      try {
        let type;
        if (!!payload.type) {
          type = payload.type
        } else {
          type = yield select(d => d[tmpModule.namespace].type)
        }
        let { data, resultCode, resultMsg } = yield call(advertiseList, { type })
        if (resultCode != 0) {
          message.error(resultMsg, 5);
          return;
        }
        if (!!data && data.length === 0) {
          let newAd = cloneDeep(defaultCellState)
          newAd.type = type
          data.push(newAd)
        }
        yield put({
          type: 'editStore',
          payload: {
            type,
            advertiseList: data,
          }
        })
      } catch (e) {
        console.error(e);
      }
    },
    //
    // 保存商城设置
    *saveConfig({ payload }, { put, call, select }) {
      try {
        let { advertiseList } = yield select(d => d[tmpModule.namespace])
        let lastIndex = advertiseList.length - 1
        if (advertiseList[lastIndex].url === '') {
          advertiseList.pop()
        }
        let { data, resultCode, resultMsg } = yield call(saveConfig, advertiseList)
        if (resultCode != 0) {
          message.error(resultMsg, 5);
          return;
        }
        message.success('保存成功')
      } catch (e) {
        console.error(e);
      }
    },
    // 新增广告
    *addAd({ payload }, { put, call, select }) {
      try {
        let { type, advertiseList } = yield select(d => d[tmpModule.namespace])
        let newAd = cloneDeep(defaultCellState)
        newAd.type = type
        advertiseList.push(newAd)
        yield put({
          type: 'editStore',
          payload: {
            advertiseList
          }
        })
      } catch (e) {
        console.error(e);
      }
    },
    // 删除广告
    *deleteAd({ payload: { advertiseId } }, { put, call, select }) {
      try {
        let { type } = yield select(d => d[tmpModule.namespace])
        let { data, resultCode, resultMsg } = yield call(deleteAd, { advertiseId })
        if (resultCode == 0) {
          message.success('操作成功')
          yield put({
            type: 'getAdList',
            payload: {
              type
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
    editStore(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

export default tmpModule
