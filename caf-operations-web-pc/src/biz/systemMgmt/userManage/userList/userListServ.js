/**
 * @(#)userListServ.js 0.1.0 2018-03-20
 * Copyright (c) 2018, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../../config/request'

// 用户禁启用
export async function updateUser(params) {
  return request({
    url: 'sys/user/status/update',
    method: 'PUT',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  },true);
};

