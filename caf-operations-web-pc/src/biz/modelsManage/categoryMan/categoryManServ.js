/**
 * @(#)categoryManServ.js 0.1.0 2018-03-26
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

import { request } from '../../../config/request'

// 类目树
export async function catalogTree(params) {
  return request({
    url: 'caf/mgmt/items/catalog/tree/list',
    method: 'GET',
    data: params
  },true);
};

// 新增节点
export async function addNode(params) {
  return request({
    url: 'caf/mgmt/items/catalog/add',
    method: 'POST',
    data: params
  },true);
};

// 节点详情
export async function nodeDetail(params) {
  return request({
    url: 'caf/mgmt/items/catalog/detail/get',
    method: 'GET',
    data: params
  },true);
};

// 节点编辑
export async function updateNode(params) {
  return request({
    url: 'caf/mgmt/items/catalog/update',
    method: 'PUT',
    data: params
  },true);
};

// 节点禁用启用
export async function updateNodeStatus(params) {
  return request({
    url: 'caf/mgmt/items/catalog/update/status',
    method: 'PUT',
    data: params
  },true);
};

// 节点排序
export async function sortNode(params) {
  return request({
    url: 'caf/mgmt/items/catalog/sort',
    method: 'PUT',
    data: params
  },true);
};

// 删除节点
export async function deleteNode(params) {
  return request({
    url: 'caf/mgmt/items/catalog/delete',
    method: 'DELETE',
    data: params
  },true);
};


// 新增属性组
export async function addPropGroup(params) {
  return request({
    url: 'caf/mgmt/items/catalog/props/add',
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    data: params
  },true);
};

// 编辑属性组
export async function updatePropGroup(params) {
  return request({
    url: 'caf/mgmt/items/catalog/props/update',
    method: 'PUT',
    headers: {
      "Content-type": "application/json"
    },
    data: params
  },true);
};

// 删除属性组
export async function deletePropGroup(params) {
  return request({
    url: 'caf/mgmt/items/catalog/props/delete',
    method: 'DELETE',
    data: params
  },true);
};

// 属性组列表
export async function propGroupList(params) {
  return request({
    url: 'caf/mgmt/items/catalog/props/list-by-page',
    method: 'GET',
    data: params
  },true);
};

// 复制粘贴属性组
export async function copyPropGroup(params) {
  return request({
    url: 'caf/mgmt/items/catalog/prop/update',
    method: 'PUT',
    data: params
  },true);
};