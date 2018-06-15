// 弹出消息框
import { message } from 'antd'
// 日期处理对象
import AppBus from '../../../utils/bus'

/* isEmpty 对象是否为空
 * isArray 对象是否数组
 * cloneDeep 对象深拷贝
 */
import { isEmpty, isArray, cloneDeep, merge } from 'lodash'
// 引入路由对象
import { hashHistory } from 'dva/router'
// 引入接口文件
import { dealerDetails, getQrCode } from './agencyDetailServ.js'

// 初始默认状态
const defaultState = {
  code: '', // 经销商编号
  dealerName: '', // 经销商名称
  aliasName: '', // 经销商简称
  brandIds: [], // 经营品牌
  status: '', // 经营状态(0,营业1,停业2,在线3,取消)
  provinceId: '', // 所属区域名称
  cityId: '', // 所属城市名称
  districtId: '', // 区域编号
  postCode: '', // 邮编
  salePhone: '', // 销售电话
  faxPhone: '', // 传真号码
  fileName: '',//门店图片名称
  fileUrl: '',//门店图片
  adminName: '', // 管理员账号
  adminPassword: '', // 管理员密码
  businessLicensePictureFrontUrl: '', // 营业执照照片正面
  businessLicensePictureBackUrl: '', // 营业执照照片反面
  identityCardPictureFrontUrl: '', // 身份证照片正面
  identityCardPictureBackUrl: '', // 身份证照片反面
  shops: [], // 门店信息

  brandList: [], // 品牌列表
  qrCode: '',
  id: '',//经销商id
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
          if (!!query.id) {
            dispatch({ type: 'getDealerDetails', payload: { id: query.id } })
            dispatch({ type: 'getQrCode', payload: { id: query.id } })
          }
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
          key: 'home/agencyMgmt/agencyDetail',
          cbf: () => {
            hashHistory.push("/home/agencyMgmt/agencyList");
          }
        })
      } catch (e) {
        console.error(e);
      }
    },
    // 获取经销商详情
    *getDealerDetails({ payload }, { put, call, select }) {
      try {
        let { data, resultCode, resultMsg } = yield call(dealerDetails, payload)
        if (resultCode != 0) {
          message.error(resultMsg, 5);
          return;
        }
        let shops = []
        if (!!data && isArray(data.shops)) {
          shops = data.shops.map((e, i) => {
            e.key = i + 1
            return e
          })
        }
        let brandIds = []
        data.brands.map((obj, idx) => {
          brandIds.push(obj.id)
        })
        yield put({
          type: 'editStore',
          payload: {
            ...data,
            id: payload.id,
            shops,
            brandIds
          }
        })
      } catch (e) {
        console.error(e);
      }
    },

    // 获取二维码
    *getQrCode({ payload }, { put, call, select }) {
      let { data, resultCode, resultMsg } = yield call(getQrCode, payload);
      if (resultCode == 0) {
        yield put({ type: 'editStore', payload: { qrCode: data } })
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
