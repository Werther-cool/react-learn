/**
 * @(#)editModelServ.js 0.1.0 2018-03-20
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 调用接口配置文件
import { request } from '../../../../config/request'

// 获取品牌列表
export async function getBrandList(params) {
  return request({
    url: 'caf/mgmt/items/brand/list-by-page',
    method: 'GET',
    data: params
  });
};

// 获取车型详情
export async function modelDetails(params) {
  return request({
    url: 'caf/mgmt/items/car/detail/get',
    method: 'GET',
    data: params
  });
};

// 获取车型类目
export async function catalogTree(params) {
  return request({
    url: 'caf/mgmt/items/catalog/tree/list',
    method: 'GET',
    data: params
  });
};

// 获取属性详情
// export async function propDetails(params) {
//   return request({
//     url: 'caf/mgmt/items/car/prop/detail/get',
//     method: 'GET',
//     data: params
//   });
// };

// 新增车型
export async function addCar(params) {
  return request({
    url: 'caf/mgmt/items/car/add',
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    data: params
  });
};

// 编辑车型
export async function updateCar(params) {
  return request({
    url: 'caf/mgmt/items/car/update',
    method: 'PUT',
    headers: {
      "Content-type": "application/json"
    },
    data: params
  });
};

// 根据车型类目获取属性组
export async function getPropGroup(params) {
  return request({
    url: 'caf/mgmt/items/car/prop/get-by-id',
    method: 'GET',
    data: params
  });
};

// 根据车型类目获取销售属性
export async function getSalesProp(params) {
  return request({
    url: 'caf/mgmt/items/car/sales/prop/get-by-id',
    method: 'GET',
    data: params
  });
};

// 获取标签列表
export async function labelList(params) {
  return request({
    url: 'caf/mgmt/items/car/label/get',
    method: 'GET',
    data: params
  });
}

// 导入属性
export async function importProp(params) {
  return request({
    url: 'caf/mgmt/items/car/prop/import',
    method: 'POST',
    data: params
  });
}

// 导出属性
export async function exportProp(params) {
  return request({
    url: 'caf/mgmt/items/car/prop/export/url/get',
    method: 'GET',
    data: params
  });
}
