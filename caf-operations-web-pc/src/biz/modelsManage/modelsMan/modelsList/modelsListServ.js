/**
 * @(#)departManage.js 0.3.0 2018-03-17
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../../config/request'


// 获取标签列表
export async function labelList(params) {
  return request({
    url: 'caf/mgmt/items/car/label/get',
    method: 'GET',
    data: params
  });
}

// 发布/停售
export async function toggleStatus(params) {
  return request({
    url: 'caf/mgmt/items/car/update/status',
    method: 'PUT',
    data: params
  });
}

// 获取车型类目
export async function catalogTree(params) {
  return request({
    url: 'caf/mgmt/items/catalog/tree/list',
    method: 'GET',
    data: params
  });
};

// 获取品牌列表
export async function brandList(params) {
  return request({
    url: 'caf/mgmt/items/brand/list-by-page',
    method: 'GET',
    data: params
  });
};
