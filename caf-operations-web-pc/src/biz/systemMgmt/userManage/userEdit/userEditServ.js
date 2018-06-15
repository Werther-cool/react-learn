/**
 * @(#)userEditServ.js 0.1.0 2018-03-12
 * Copyright (c) 2018, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../../config/request'

// 获取角色列表
export async function rolePage(params) {
  return request({
    url: 'sys/role/list-by-page',
    method: 'GET',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  });
};

// 新增用户
export async function addUser(params) {
  return request({
    url: 'sys/user/add',
    method: 'POST',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  });
};

// 修改用户
export async function updateUser(params) {
  return request({
    url: 'sys/user/update',
    method: 'PUT',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  });
};

// 用户详情
export async function detailUser(params) {
  return request({
    url: 'sys/user/detail/get',
    method: 'GET',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  });
};
