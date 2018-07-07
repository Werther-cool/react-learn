/**
 * @(#)agencyDetailServ.js 0.1.0 2018-03-21
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 调用接口配置文件
import { request } from '../../../config/request'

// 获取经销商详情
export async function dealerDetails(params) {
  return request({
    url: 'caf/mgmt/dealer/detail',
    method: 'GET',
    data: params
  });
};

// 获取二维码
export async function getQrCode(params) {
  return request({
    url: 'caf/mgmt/dealer/qrcode',
    method: 'GET',
    data: params
  });
};