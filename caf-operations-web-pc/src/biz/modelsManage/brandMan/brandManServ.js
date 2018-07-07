/**
 * @(#)brandManServ.js 0.1.0 2018-03-20
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

  // 新增
  export async function addFun(params) {
    return request({
     url: 'caf/mgmt/items/brand/add',
     method: 'POST',
      // headers:{
      //   'Content-type':'application/json'
     // },
      data: params
    },true);
  };
  //编辑
  export async function editFun(params) {
    return request({
      url: 'caf/mgmt/items/brand/update',
      method: 'PUT',
      // headers:{
      //   'Content-type':'application/json'
      // },
      data: params
    },true);
  };
  //删除
  export async function deleteFun(params) {
    return request({
      url: 'caf/mgmt/items/brand/delete',
      method: 'DELETE',
      // headers:{
      //   'Content-type':'application/json'
      // },
      data: params
    },true);
  };

