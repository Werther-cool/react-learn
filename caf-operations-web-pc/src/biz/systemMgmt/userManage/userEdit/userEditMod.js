/**
 * @(#)userEditMod.js 0.1.0 2018-03-20
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
import { rolePage, addUser, updateUser, detailUser } from './userEditServ';

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
    allData: [],
    nameOrCode: '',
    pageNum: 1,
    pageSize: 10,
    total: 0,
    columns:[
      {title: '序号',dataIndex: 'keyNum', key: 'keyNum', width: 85},
      {title: '角色编号',dataIndex: 'code', key: 'code'},
      {title: '角色名称',dataIndex: 'name', key: 'name'},
    ],
    selectedRowKeys: [],
  },
};

//页签修改
const getTabTitle = (id) => {
  var title = '新增用户'
  if(!isNaN(Number(id))){
    title = '编辑用户'
  }
  return title
}

export default {
  // // 命名空间
  namespace: 'userEditMod',
  // 默认状态
  state: cloneDeep(defaultState),
  // 入口函数(先执行)
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        // 页面编辑路由
        if('/home/systemMgmt/userEdit' === '' + location.pathname){
          dispatch({ type: 'info', payload: {id: location.query.id}})

          // 修改叶签名称
          dispatch({
            type: 'app/setTabTitle',
            payload: {
              title: getTabTitle(location.query.id),
              location
            }
          });
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
      let userEditMod = yield select(e => e.userEditMod);
      try{
        //编辑用户
        if(payload.id){
          //发送请求、获取详情
          let {resultCode, data, resultMsg} = yield call(detailUser, parse({id: payload.id}));
          if('0' === '' + resultCode){
            // 赋值
            userEditMod.editId = payload.id;//判断是新增还是编辑
            userEditMod.userName = data.userName;//用户账号
            userEditMod.password = data.password;//用户密码
            userEditMod.realName = data.realName;//姓名
            userEditMod.phone = data.phone;//手机号码
            userEditMod.imgUrl = data.imgUrl;//头像url
            // userEditMod.roleIds = data.imgUrl;//角色ID（多个用“,”分隔）
            userEditMod.number = data.employeeId;//工号
            userEditMod.department = data.department;//部门
            userEditMod.post = data.post;//岗位
            userEditMod.telephone = data.tel;//工作电话
            userEditMod.selRole = data.roleList;//已经选中的角色
            userEditMod.rolePra.allData = data.roleList;//已经选中的角色

            //更新状态
            yield put({
              type: 'userEditStore',
              payload: {...userEditMod},
            });
          }

        //新增用户
        }else{
          //清空之前的数据
          yield put({
            type: 'clearState',
            payload: {},
          });
        }

      }catch(e){
        console.log('页面初始化报错: ', e);
      }
    },
    // 清空状态
    *clearState ({}, {call, put, select}) {
      yield put({
        type: 'userEditStore',
        payload: cloneDeep(defaultState),
      });
    },
    //更改状态
    *updateModel({ payload: obj}, {put,call,select}) {
      let state = yield select(e => e.userEditMod);
      yield put({
        type: 'userEditStore',
        payload: {
          ...obj
        },
      });
    },
    //修改其他参数
    *changeOther({ payload }, {put,call,select}) {
      let userEditMod = yield select(e => e.userEditMod);
      let {value, name, pName} = payload

      //赋值
      userEditMod[pName][name] = value;

      yield put({
        type: 'userEditStore',
        payload: {
          ...userEditMod,
        },
      });
    },
    //关闭标签页并返回上级目录
    *closeTab({ payload: obj}, {put,call,select}) {
      let { accountId } = yield select(e => e.userEditMod)
      AppBus.emit('closeTab', {
        key: '/home/systemMgmt/userEdit',
        cbf: () => {
          hashHistory.push(`/home/systemMgmt/userList`);
        }
      })
    },

    //点击添加角色按钮
    *onRole({ payload }, {put,call,select}) {
      try{
        //获取状态
        let userEditMod = yield select(e => e.userEditMod);
        let {rolePra} = userEditMod;

        //收集选中的角色
        let newKye = [];
        userEditMod.selRole && userEditMod.selRole.map((obj)=>{
          newKye.push(obj.key);
        });

        //赋值
        rolePra.visible = true;
        rolePra.loading = true;
        rolePra.selectedRowKeys = newKye;

        //跟新状态
        yield put({
          type: 'userEditStore',
          payload: {
            ...userEditMod,
          },
        });

        //查询列表
        yield put({
          type: 'queryRole',
          payload: {
            pageNum: 1,
            pageSize: 10,
            nameOrCode: '',
          },
        });

      }catch(e){
        console.log('代码出错：', e);
      }
    },

    //查询角色列表
    *queryRole({ payload }, {put,call,select}) {
      //获取状态
      let userEditMod = yield select(e => e.userEditMod);
      let {rolePra} = userEditMod;

      try{
        let {pageNum, pageSize, nameOrCode} = payload;

        //发送请求
        let result = yield call(rolePage, parse({
          pageNum: pageNum || 1,
          pageSize,
          nameOrCode,
        }));
        let resultList = result.data.list || [];

        if('0' !== '' + result.resultCode){
          return false;
        }else{
          //给列表页添加key属性
          resultList.map((obj, i)=>{
            obj.keyNum = ++i;
            obj.key = obj.id + '';
          });

          //收集角色列表的值
          if(rolePra.allData.length <= 0){
            rolePra.allData = result.data.list || [];

          }else{
            //收集两个数组中不同的数据
            let newList = [], isAdd = true;
            resultList.map((item)=>{
              isAdd = true;
              rolePra.allData.map((obj)=>{
                if(obj.key === item.key){
                  isAdd = false;
                }
              })
              if(isAdd){
                newList.push(item);
              }
            });

            //合并数组
            rolePra.allData = rolePra.allData.concat(newList);
          }

          //赋值
          rolePra.pageNum = pageNum;
          rolePra.pageSize = pageSize;
          rolePra.list = result.data.list;
          rolePra.loading = false;
          rolePra.total = result.data.total;

          //跟新状态
          yield put({
            type: 'userEditStore',
            payload: {
              ...userEditMod,
            },
          });
        }

      }catch(e){
        console.log('代码出错：', e);

      }
    },

    //确认角色弹窗
    *onOkRole({ payload }, {put,call,select}) {
      //获取状态
      let userEditMod = yield select(e => e.userEditMod);
      let {rolePra} = userEditMod;

      try{
        //整理选中的角色list
        let selRoleList = [];
        rolePra.selectedRowKeys && rolePra.selectedRowKeys.map((keys)=>{
          rolePra.allData && rolePra.allData.map((obj)=>{
            if(keys === obj.key){
              selRoleList.push(obj);
            }
          });
        });


        //赋值
        userEditMod.selRole = selRoleList;
        rolePra.selectedRowKeys = [];
        rolePra.nameOrCode = '';
        rolePra.visible = false;
        rolePra.loading = false;

        //跟新状态
        yield put({
          type: 'userEditStore',
          payload: {
            ...userEditMod,
          },
        });

      }catch(e){
        console.log('代码出错：', e);

      }
    },

    //关闭角色弹窗
    *onCancelRole({ payload }, {put,call,select}) {
      //获取状态
      let userEditMod = yield select(e => e.userEditMod);
      let {rolePra} = userEditMod;

      try{
        //赋值
        rolePra.selectedRowKeys = [];
        rolePra.nameOrCode = '';
        rolePra.visible = false;
        rolePra.loading = false;

        //跟新状态
        yield put({
          type: 'userEditStore',
          payload: {
            ...userEditMod,
          },
        });

      }catch(e){
        console.log('代码出错：', e);

      }
    },

    //删除选中的角色
    *deleteRole({ payload }, {put,call,select}){
      try{
        //获取状态
        let userEditMod = yield select(e => e.userEditMod);

        //删除数据
        let newArr = [];
        userEditMod.selRole && userEditMod.selRole.map((item)=>{
          if('' + payload.id !== '' + item.id){
            newArr.push(item);
          }
        });
        userEditMod.selRole = newArr;

        yield put({
          type: 'userEditStore',
          payload: {
            ...userEditMod,
          },
        });
      }catch(e){
        console.log('删除选中的角色报错: ', e);
      }

    },

    //保存用户
    *onSubmit({ payload }, {put,call,select}) {
      try{
        //获取状态
        let userEditMod = yield select(e => e.userEditMod);

        //保存数据整理
        let obj = {
          userName: userEditMod.userName,//用户账号
          password: userEditMod.password,//用户密码
          realName: userEditMod.realName,//姓名
          phone: userEditMod.phone,//手机号码
          imgUrl: userEditMod.imgUrl,//头像url
          // roleIds: userEditMod.roleIds,//角色ID（多个用“,”分隔）
          number: userEditMod.number,//工号
          // department: userEditMod.department,//部门
          // post: userEditMod.post,//岗位
          telephone: userEditMod.telephone,//工作电话
        };

        //角色id收集
        let ids = [];
        userEditMod.selRole && userEditMod.selRole.map((item)=>{
          ids.push(item.id);
        });
        obj.roleIds = ids.toString();

        //新增用户
        let text = '成功新增';
        if('' === userEditMod.editId){
          //发送请求
          let {resultCode, data, resultMsg} = yield call(addUser, parse(obj));
          if('0' === '' + resultCode){
            message.success('成功新增');
            //关闭页签
            yield put({
              type: 'closeTab',
              payload: {},
            });
          }

        //编辑用户
        }else{
          obj.id = userEditMod.editId;
          //去除用户密码字段
          delete obj.password;

          //发送请求
          let {resultCode, data, resultMsg} = yield call(updateUser, parse(obj));
          if('0' === '' + resultCode){
            message.success('成功修改');
            //关闭页签
            yield put({
              type: 'closeTab',
              payload: {},
            });
          }

        }

        yield put({
          type: 'userEditStore',
          payload: {
            submitLoading: false,
          },
        });

      }catch(e){
        console.log('保存数据时出错: ', e);
      }
    },
  },
  // 存入状态机
  reducers: {
    userEditStore(preState, action) {
      return Object.assign({}, preState, action.payload)
    },
  }
}

