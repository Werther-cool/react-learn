/**
 * @(#)userDetailsServ.js 0.1.0 2018-03-22
 * Copyright (c) 2018, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../../config/request'

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
