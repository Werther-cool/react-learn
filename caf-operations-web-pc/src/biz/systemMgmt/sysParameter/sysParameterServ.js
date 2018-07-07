/**
 * @(#)sysParameter.js 0.3.0 2018-03-13
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
import { request } from '../../../config/request'
// 导入全局配置
import config from '../../../config/config'
// 修改
export async function updateData(params) {
  return request({
    url: `sys/parameter/update`,
    method: 'PUT',
    data: params
  },false);
};
