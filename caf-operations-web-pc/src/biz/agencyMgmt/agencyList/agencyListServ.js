/**
 * @(#)agencyListServ.js 0.1.0 2018-03-20
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

// 省市树
export async function areaTree(params) {
  return request({
    url: 'caf/mgmt/area/cityList',
    method: 'GET',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  },true);
};

