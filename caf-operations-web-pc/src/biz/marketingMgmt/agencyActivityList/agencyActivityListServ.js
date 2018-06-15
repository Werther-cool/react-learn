/**
 * @(#)agencyActivityListServ.js 0.1.0 2018-03-23
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

// 用户解锁
export async function auditUpdate(params) {
  return request({
    url: 'caf/mgmt/promotion/activity/audit/update',
    method: 'PUT',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  },true);
};

