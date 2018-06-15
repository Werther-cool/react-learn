/**
 * @(#)attributeManMod.js 0.1.0 2018-03-20
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
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
import { deleteFun,editFun ,addFun,getDetails} from './attributeManServ';
import {calculate_object_name} from '../../../utils/upload'
// 初始默认状态
const defaultState = {
  // 上传对象
  uploadObj: {
    host: '',
    params: {
      OSSAccessKeyId: '',
      policy: '',
      signature: '',
      file: '',
      key: '',
      success_action_status: ''
    }
  },
  popVisible:false,//气泡状态
  dataSource:[],
  editId:'',//品牌编辑id
  visible:false,//弹窗
  obj:{
    id:'',
    name:'',
    statement:'',
    showType:'',
    // fillType:'',
    values:[],//显示类型数据
  },
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
          dispatch({
            type: 'getStoreList',
            payload: {}
          })
        }
      })
    },
  },
  // 方法列表
  effects: {
    // 更新签名串
    *updateSign({ payload }, { put, call, select }) {
      try{
        let {signObj, file} = payload;
        let uploadObj = {};
        // 上传对象
        uploadObj = {
          host: signObj.host,
          params: {
            OSSAccessKeyId: signObj.accessid,
            policy: signObj.policy,
            signature: signObj.signature,
            key: calculate_object_name(signObj.dir, 'floor', file.name),
            name: file.name,
            success_action_status: '200'
          }
        }
        // 存入store
        yield put({type: 'store', payload: {uploadObj}});
      }catch(e){
        console.error(e);
      }
    },
    //新增
    *addOk({ payload }, { put, call, select }) {
      let {obj, visible, biz}=yield select(d => d[tmpModule.namespace])
      let isImgNull=false
      obj.values&&obj.values.map((x,i)=>{
        if(obj.showType=='6'&&x.imgUrl==''){
          isImgNull=true
        }
      })
      if(isImgNull){
        message.error('图片不能为空!')
        return false
      }
      let result = yield call(addFun, parse({
        ...obj
      }))
      if(result.resultCode+''=='0'){
        message.success('新增成功!')
        biz.refreshListDatas()
      }else {
        message.error(result.resultMsg||'后台报错！')
        return false
      }
      yield put({
        type: 'store',
        payload: {
          visible:false
        }
      })
    },
    //编辑保存
    *editOk({ payload }, { put, call, select }) {
      let {obj,visible, biz}=yield select(d => d[tmpModule.namespace])
      let isImgNull=false
      obj.values&&obj.values.map((x,i)=>{
        if(obj.showType=='6'&&x.imgUrl==''){
          isImgNull=true
        }
      })
      if(isImgNull){
        message.error('图片不能为空!')
        return false
      }
      let result=yield call(editFun,parse({
        ...obj
      }))
      if(result.resultCode+''=='0'){
        message.success('保存成功!')
        biz.refreshListDatas()
      }
      yield put({
        type: 'setFormVal',
        payload: {
        }
      })
      yield put({
        type: 'store',
        payload: {
          visible:false
        }
      })
    },
    // 弹窗、气泡状态
    *updatePop({ payload }, { put, call, select }) {
      let{popVisible,visible}=yield select(d => d[tmpModule.namespace])
      let {value, name}=payload
      if(name=='Modal'){
        popVisible=true
      }else {
        popVisible=value
      }
      yield put({
        type: 'store',
        payload: {
          popVisible,
          visible
        }
      })
      if(name=='popVisible'){
        yield put({
          type: 'editOk',
          payload: {
            popVisible,
          }
        })
      }
    },
    // 删除、添加属性
    *updateValue({ payload }, { put, call, select }) {
      let {obj} = yield select(d => d[tmpModule.namespace])
      let {item,i,name}=payload
      if(name=='del'){
        obj.values.splice(i,1)
      }
      if(name=='add'){
        let prop = {value: '',imgUrl:''};
        obj.values.push(prop)
      }
      yield put({
        type: 'store',
        payload: {
          obj,
        }
      })
    },
    // 设置表单的值到状态机
    *setFormVal({ payload }, { put, call, select }) {
      let { biz } = yield select(d => d[tmpModule.namespace])
      try{
        yield put({
          type: 'store',
          payload: {
            biz: payload
          }
        })
      }catch(e){
        console.error(e)
      }
    },
    // 打开弹窗传值
    *setVisible({ payload }, { put, call, select }) {
      let { editId,obj,dataSource} = yield select(d => d[tmpModule.namespace])
      let {visible,name,item}=payload
      if(name=='edit'){
        let result=yield call(getDetails,parse({
          id:item.id
        }))
        if(result.resultCode==0){
          obj=result.data
        }
        editId=item.id
      }
      if(name=='add') {
        editId=''
        obj.id=''
        obj.name=''
        obj.statement=''
        obj.showType='4'
        // obj.fillType='0'
        obj.values=[{
          value:'',
          imgUrl:'',
        }]
      }
      yield put({
        type: 'store',
        payload: {
          visible,
          editId,
          obj,
        }
      })
    },
    //更新输入值
    *updateModel({ payload}, {put,call,select}) {
      let {obj,dataSource} = yield select(e => e[tmpModule.namespace]);
      if(payload.i!==''){
        if(payload.name=='imgUrl'){
          obj.values[payload.i].imgUrl=payload.value       //上传图片
        }else {
          obj.values[payload.i].value=payload.value
        }
      }else {
        obj[payload.name]=payload.value
      }
      yield put({
        type: 'store',
        payload: {
          obj
        },
      });
    },
  },
  // 存入状态机
  reducers: {
    store(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

export default tmpModule
