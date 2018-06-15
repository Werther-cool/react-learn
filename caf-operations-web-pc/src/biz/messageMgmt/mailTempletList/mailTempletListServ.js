/**
 * @(#)mailTempletListServ.js 0.2.5 2018-05-16
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

// 用户解锁
export async function statusUpdate(params) {
  return request({
    url: '/sys/role/status/update',
    method: 'PUT',
    data: params
  },true);
};

