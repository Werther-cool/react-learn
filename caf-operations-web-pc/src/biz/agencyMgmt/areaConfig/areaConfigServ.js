/**
 * @(#)areaConfigServ.js 0.1.0 2018-03-26
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

// 数据权限树
export async function areaTree(params) {
  return request({
    url: 'caf/mgmt/area/catalog/tree',
    method: 'GET',
    data: params
  },true);
};

// 省市区树
export async function cityTree(params) {
  return request({
    url: 'caf/mgmt/area/cityList',
    method: 'GET',
    data: params
  },true);
};

// 新增节点
export async function addNode(params) {
  return request({
    url: 'caf/mgmt/area/manage/add',
    method: 'POST',
    data: params
  },true);
};

// 保存节点
export async function saveNode(params) {
  return request({
    url: 'caf/mgmt/area/save',
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    data: params
  },true);
};

// 删除节点
export async function deleteNode(params) {
  return request({
    url: 'caf/mgmt/area',
    method: 'DELETE',
    data: params
  },true);
};

// 节点详情
export async function nodeDetail(params) {
  return request({
    url: 'caf/mgmt/area/manage/list',
    method: 'GET',
    data: params
  },true);
};