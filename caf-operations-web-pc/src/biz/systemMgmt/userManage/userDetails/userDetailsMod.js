/**
 * @(#)userDetailsMod.js 0.1.0 2018-03-20
 * Copyright (c) 2018, YUNXI. All rights reserved.
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
import { detailUser } from './userDetailsServ';

// 初始默认状态
const defaultState = {
  editId: '',//判断是新增还是编辑
  userName: '',//用户账号
  password: '',//用户密码
  realName: '',//姓名
  phone: '',//手机号码
  imgUrl: '',//头像url
  roleIds: '',//角色ID（多个用“,”分隔）
  number: '',//工号
  department: '',//部门
  post: '',//岗位
  telephone: '',//工作电话
  selRole: [],//已经选中的角色
  submitLoading: false,//保存按钮状态

  //角色弹窗参数
  rolePra: {
    loading: false,
    visible: false,
    list: [],
    nameOrCode: '',
    pageNum: 1,
    pageSize: 10,
    total: 0,
    columns:[
      {title: '序号',dataIndex: 'keyNum', key: 'keyNum', width: 85},
      {title: '角色编号',dataIndex: 'code', key: 'code'},
      {title: '角色名称',dataIndex: 'name', key: 'name'},
    ],
    selectedRows: [],
  },
};

export default {
  // // 命名空间
  namespace: 'userDetailsMod',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        // 页面编辑路由
        if('/home/systemMgmt/userDetails' === '' + location.pathname){
          dispatch({ type: 'info', payload: {id: location.query.id}})
        } else {
          // dispatch({ type: 'clearState', payload: {} })
        }
      })
    },
  },
  // 方法列表
  effects: {
    //页面初始化
    *info({payload}, {call, put, select}) {
      let userDetailsMod = yield select(e => e.userDetailsMod);
      try{
        //确保id存在，若不存在直接返回列表页面
        if(payload.id){
          //发送请求、获取详情
          let {resultCode, data, resultMsg} = yield call(detailUser, parse({id: payload.id}));
          if('0' === '' + resultCode){
            // 赋值
            userDetailsMod.editId = payload.id;//判断是新增还是编辑
            userDetailsMod.userName = data.userName;//用户账号
            userDetailsMod.password = data.password;//用户密码
            userDetailsMod.realName = data.realName;//姓名
            userDetailsMod.phone = data.phone;//手机号码
            userDetailsMod.imgUrl = data.imgUrl;//头像url
            // userDetailsMod.roleIds = data.imgUrl;//角色ID（多个用“,”分隔）
            userDetailsMod.number = data.employeeId;//工号
            // userDetailsMod.department = data.department;//部门
            // userDetailsMod.post = data.post;//岗位
            userDetailsMod.telephone = data.tel;//工作电话
            userDetailsMod.selRole = data.roleList;//已经选中的角色

            //更新状态
            yield put({
              type: 'userDetailsStore',
              payload: {...userDetailsMod},
            });
          }

        }else{
          //详情id异常，返回列表页面
          message.error('用户ID异常，请确认后在查询用户详情！');

          setTimeout(()=>{
            hashHistory.push('/home/systemMgmt/userList');
          },1000);
        }

      }catch(e){
        console.log('页面初始化报错: ', e);
      }
    },
  },
  // 存入状态机
  reducers: {
    userDetailsStore(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

