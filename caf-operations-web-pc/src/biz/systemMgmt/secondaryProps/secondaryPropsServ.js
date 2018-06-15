/**
 * @(#)userListServ.js 0.1.0 2018-01-08
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

// 编辑属性
export async function updateProp(params) {
  return request({
    url: 'sys/prop/update',
    method: 'PUT',
    headers:{
      'Content-type':'application/json'
    },
    data: params
  },true);
};

