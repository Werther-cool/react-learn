/**
 * @(#)brandManMod.js 0.1.0 2018-03-20
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
import {addFun, editFun, deleteFun} from './brandManServ';
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
  editId:'',//品牌编辑id
  visible:false,//弹窗
  obj:{
    id:'',
    code:'',
    name:'',
    keyword:'',
    logoUrl:'',
  },
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
    //删除
    *ondelete({ payload }, { call, put, select }) {
      let {biz} = yield select(d => d[tmpModule.namespace]);
      let {item}=payload
      let result=yield call(deleteFun,parse({
        id:item.id
      }))
      biz.refreshListDatas()
    },

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
    //输入图片
    *changeInput({ payload }, { call, put, select }) {
      let {obj} = yield select(d => d[tmpModule.namespace]);
      let {inputType,inputValue,index}=payload
      obj.logoUrl=inputValue
      yield put({
        type: 'store', payload: {
          obj,
        }
      });
    },
    // 设置表单的值到状态机
    *setVisible({ payload }, { put, call, select }) {
      let { editId,obj} = yield select(d => d[tmpModule.namespace])
      let {visible,name,item}=payload
      item=cloneDeep(item)
      if(name=='edit'){
        editId=obj.id
        obj=item
      }
      if(name=='add') {
        editId=''
        obj.id=''
        obj.name=''
        obj.code=''
        obj.keyword=''
        obj.logoUrl=''
      }
      yield put({
        type: 'store',
        payload: {
          visible,
          editId,
          obj
        }
      })
    },

    *okFun({ payload }, { put, call, select }) {
      let {obj,biz}=yield select(d => d[tmpModule.namespace])
      if(obj.logoUrl==''){
        message.error('请上传图片!')
        return false
      }
      if(obj.id==''){
        let result=yield call(addFun,parse({
          ...obj
        }))
        if(result.resultCode+''=='0'){
          message.success('新增成功')
          biz.refreshListDatas()
        }
      }else {
        let result=yield call(editFun,parse({
          ...obj
        }))
        if(result.resultCode+''=='0'){
          message.success('编辑成功')
          biz.refreshListDatas()
        }
      }
      yield put({
        type: 'store',
        payload: {
          visible: false
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
    //提交
    *updateModel({ payload}, {put,call,select}) {
      let {obj} = yield select(e => e[tmpModule.namespace]);
      let {value,name}=payload
      obj[name]=value
      console.log('pppp',obj)
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
