/**
 * @(#)sysMessage.js 0.3.0 2018-03-13
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
import { request } from '../../../config/request'
// 删除消息
export async function deleteMsg(params) {
  return request({
    url: 'sys/message/delete',
    method: 'DELETE',
    data: params
  });
};

// 消息列表
export async function listMsg(params) {
  return request({
    url: 'sys/message/list-by-page',
    method: 'GET',
    data: params
  });
};

export async function markRead(params) {
  return request({
    url: 'sys/message/status/update',
    method: 'PUT',
    data: params
  });
};

export async function getMsg(params) {
  return request({
    url: 'sys/message/detail/get',
    method: 'GET',
    data: params
  });
};

