/**
 * @(#)advertiseConfigServ.js 0.1.0 2018-03-23
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 调用接口配置文件
import { request } from '../../../config/request'

// 获取广告列表
export async function advertiseList(params) {
  return request({
    url: 'mgmt/advertise',
    method: 'GET',
    data: params
  });
};

// 广告设置保存
export async function saveConfig(params) {
  return request({
    url: 'mgmt/advertise/save',
    method: 'POST',
    headers:{
      'Content-type':'application/json'
    },
    data: params
  });
};

// 广告设置删除
export async function deleteAd(params) {
  return request({
    url: `mgmt/advertise`,
    method: 'DELETE',
    // headers:{
    //   'Content-type':'application/json'
    // },
    data: params
  });
};

// 车型列表
export async function carList(params) {
  return request({
    url: 'caf/mgmt/items/car/list-by-page',
    method: 'GET',
    data: params
  });
};