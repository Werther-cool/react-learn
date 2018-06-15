import { message } from 'antd'
// 日期处理对象
import moment from 'moment'
import AppBus from '../../../../utils/bus'

/* isEmpty 对象是否为空
 * isArray 对象是否数组
 * cloneDeep 对象深拷贝
 */
import {isEmpty, isArray, cloneDeep, merge, pick} from 'lodash'
// 引入路由对象
import { hashHistory } from 'dva/router'
// 引入接口文件
import {
  getBrandList,
  dealerDetails,
  modelDetails,
  catalogTree,
  brandList,
  addCar,
  updateCar,
  getPropGroup,
  getSalesProp,
  labelList,
  exportProp,
  importProp
} from './editModelServ.js'

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

// 初始默认状态
const defaultState = {
  id: '',
  catalogId: '', // 品类id
  brandId: '', // 品牌
  carCode: '', // 车型编号
  carName: '', // 车型名称
  labelIds: [], // 标签
  remark: '', // 富文本
  skus: [], // 规格
  propGroups: {}, // 属性详情
  imgs: [], // 图片配置
  imgUrl: '', //车型主图
  thumbnailUrl: '', // 车型缩略图

  //
  catalogTree: [], // 车型类目树
  brandList: [], // 车型品牌
  currentViewName: 'basicInfo',
  saveLoading: false, //保存按钮loading
  labelList: [], // 标签列表
  detailLoading: true, // 新增时直接置为false, 编辑时获取到详情后置为false
  activateFlag: false, // 通过状态变化激活规格表格
  curTabKey: '0', // 当前tab的key
}

// 声明module
const tmpModule = {
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(({ pathname, query }) => {
        // 页面路由匹配时执行
        if('' + tmpModule.pathname === '' + pathname){
          dispatch({ type: 'getBrandList', payload: {} })
          dispatch({ type: 'getLabelList', payload: {} })
          dispatch({ type: 'getCatalogTree', payload: {} })
          if (!!query.id) {
            dispatch({ type: 'getModelDetails', payload: {id: query.id} })
            // dispatch({ type: 'getDealerDetails', payload: { dealerId: query.dealerId } })
          } else {
            console.log('add')
            dispatch({ type: 'editStore', payload: {detailLoading: false} })
          }
        } else {
          dispatch({ type: 'clearState', payload: {id: query.id} })
        }
      })
    },
  },

  // 方法列表
  effects: {
    // 清空状态
    *clearState ({}, {call, put, select}) {
      yield put({
        type: 'editStore',
        payload: cloneDeep(defaultState),
      });
    },
    //更改状态
    *updateModel({ payload: obj}, {put,call,select}) {
      try {
        // console.log('update', obj)
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
    *closeTab({ payload }, {put,call,select}) {
      try {
        AppBus.emit('closeTab', {
          key: 'home/modelsManage/editModel',
          cbf: () => {
            hashHistory.push("/home/modelsManage/modelsList");
          }
        })
      } catch (e) {
        console.error(e);
      }
    },
    // 获取品牌列表
    *getBrandList({ payload }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(getBrandList, {
          pageSize: 100,
          pageNum: 1
        })
        if (resultCode == 0) {
          yield put({
            type: 'editStore',
            payload: {
              brandList: data.list
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取标签列表
    *getLabelList({ payload }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(labelList, { type: 1 })
        if (resultCode == 0) {
          let labels = data.map(e => {
            return { label: e.name, value: e.id + '' }
          })
          yield put({
            type: 'editStore',
            payload: {
              labelList: labels
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取车型详情
    *getModelDetails({ payload }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(modelDetails, payload)
        if (resultCode == 0) {
          console.log('suc', data)
          if (!!data.skus && isArray(data.skus)) {
            data.skus.map(e => e.key = e.skuId)
            // if (data.skus.length === 0) {
            //   data.skus.push({
            //     code: '001',
            //     specifications: [],
            //     key: '001',
            //     guidePrice: '',
            //     skuId: '-1'
            //   })
            // }
          }
          yield put({
            type: 'getPropGroup',
            payload: {
              id: data.catalogId
            }
          })
          data.imgUrl = !!data.imgUrl ? data.imgUrl : ''
          yield put({
            type: 'editStore',
            payload: {
              ...data,
              detailLoading: false
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取车型类目
    *getCatalogTree({ payload }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(catalogTree, {disable: true})
        if (resultCode == 0) {
          treeDataInit(data, 'name', 'id')
          yield put({
            type: 'editStore',
            payload: {
              catalogTree: data
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 保存车型
    *saveCar({ payload: {opsType} }, {put, call, select}) {
      try {
        let state = yield select(d => d[tmpModule.namespace])
        let saveCar = !!state.id ? updateCar : addCar
        let saveData = pick(cloneDeep(state), [
          'catalogId', 'brandId', 'carCode',
          'carName', 'labelIds', 'imgUrl', 'thumbnailUrl',
          'remark', 'skus', 'propGroup', 'imgs', 'id'
        ])
        if (!!state.propGroups) {
          saveData.propGroup = Object.keys(state.propGroups).map(groupId => {
            let group = state.propGroups[groupId]
            let props = Object.keys(group.propArray).map(propId => {
              let prop = group.propArray[propId]
              if (prop.valueId === -1) {
                return {
                  "propId": prop.propId,
                  "propName": prop.propName,
                  "values": prop.values
                }
              } else {
                return {
                  "propId": prop.propId,
                  "propName": prop.propName,
                  "valueId": prop.valueId,
                  "values": prop.values
                }
              }
            })
            return {
              "groupId": group.groupId,
              "groupName": group.groupName,
              props
            }
          })
        } else {
          saveData.propGroup = []
        }
        saveData.opsType = opsType
        saveData.skus = saveData.skus.filter(item => item.skuId !== '-1')
        saveData.imgs.map(item => {
          item.videoUrls = item.videoUrls.filter(url => url != '')
        })
        console.log('save', saveData)
        let { data, resultCode, resultMsg } = yield call(saveCar, saveData)
        yield put({
          type: 'editStore',
          payload: {
            saveLoading: false
          }
        })
        if (resultCode == 0) {
          message.success('保存成功!')
          yield put({
            type: 'closeTab',
            payload: {
              catalogTree: data
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 根据类目获取属性组
    *getPropGroup({ payload: obj }, {put, call, select}) {
      try {
        let { data, resultCode, resultMsg } = yield call(getPropGroup, obj)
        if (resultCode == 0) {
          yield put({
            type: 'editStore',
            payload: {
              propGroupList: data
            }
          })
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 根据类目获取属性组
    *generateData({ payload }, {put, call, select}) {
      try {
        let {skus, imgs, propGroups, propGroupList} = yield select(d => d[tmpModule.namespace])
        // 图片
        let codeList = skus.map(e => e.code)
        let newImgs = codeList.map(item => {
          // 是否已有
          let [existImg] = imgs.filter(e => e.code == item)
          if (!!existImg) {
            return existImg
          } else {
            return {
              "code": item,
              "exteriorImgs": [],
              "centerControlImgs": [],
              "seatImgs": [],
              "detailImgs": [],
              "videoUrls": []
            }
          }
        })

        newImgs.map(item => {
          if (item.videoUrls.length === 0) {
            item.videoUrls.push('')
          }
        })

        yield put({
          type: 'editStore',
          payload: {
            imgs: newImgs,
          }
        })
      } catch (e) {
        console.error(e);
      }
    },
    // 上传图片保存
    *updateImg({ payload: { url, listName, index, sort } }, {put, call, select}) {
      try {
        let { imgs } = yield select(d => d[tmpModule.namespace])
        if (sort !== undefined) {
          // url为null时为删除链接
          if (url !== null) {
            imgs[index][listName].splice(sort, 1, url)
          } else {
            imgs[index][listName].splice(sort, 1)
          }
        } else {
          if (isArray(imgs[index][listName])) {
            imgs[index][listName].push(url)
          } else {
            imgs[index][listName] = [url]
          }
        }
        yield put({
          type: 'editStore',
          payload: {
            imgs
          }
        })
      } catch (error) {
        console.log('error in updateImg @ editModelMod', error)
      }
    },
    // 导出属性
    *exportProp({ payload }, {put, call, select}) {
      let { catalogId } = yield select(d => d[tmpModule.namespace])
      let { data, resultCode, resultMsg } = yield call(exportProp, {id: catalogId})
      if (resultCode == 0) {
        window.open(data)
        message.success('属性组模板导出成功!')
      }
    },

    // 导入属性
    *importProp({ payload: { fileUrl } }, {put, call, select}) {
      let { catalogId } = yield select(d => d[tmpModule.namespace])
      let { data, resultCode, resultMsg } = yield call(importProp, {
        id: catalogId,
        fileUrl
      })
      if (resultCode == 0) {
        if (!!data.fileUrl) {
          message.error('属性组模板信息有误, 详情见错误报告!')
          window.open(data.fileUrl)
          return false;
        }
        yield put({
          type: 'editStore',
          payload: {
            propGroups: data.propGroups
          }
        })
        message.success('属性组模板导入成功!')
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
