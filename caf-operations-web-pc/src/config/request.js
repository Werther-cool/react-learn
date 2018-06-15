/**
 * @(#)request.js 0.5.1 2017-09-13
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
import { request as commonRequest } from '../utils'
import config from './config'

/*
 * 请求
 *
 * @author 苏离
 * @since 0.5.1
 */
//项目统一处理，例如对不同service使用不同host
export function request(option, needHandComErr = true) {
  //旧系统兼容，如果没有传入version就使用v1
  option.version || (option.version = 'v1');
  let url = option.url;
  let apiAppName = '/caf-mgmt-application'
  // if (url.indexOf("smartsales/mgmt") >= 0) {
  //   apiAppName= '/nuskin-dataservice'
  // }
   //if (url.indexOf("smartsales/trade") >= 0) {
   // apiAppName = "/smartsales-trade-application";
   //} else if (url.indexOf("smartsales/mgmt") >= 0) {
   // apiAppName = "/smartsales-mgmt-application";
   //} else if (url.indexOf("/sys/") >= 0) {
   // apiAppName = "/smartsales-sys-application";
   //} else if (url.indexOf("yundt/mgmt") >= 0 || url.indexOf("/item/") >= 0) {
   // apiAppName = "/yundt-application-mgmt";
   //} else if (url.indexOf("trade/cart") >= 0 || url.indexOf("trade/item") >= 0 || url.indexOf("trade/member") >= 0 || url.indexOf("trade/promotion") >= 0 || url.indexOf("trade/shop") >= 0) {
   // apiAppName = "/yundt-application-trade-core";
   //} else if (url.indexOf("trade/logistics") >= 0 || url.indexOf("trade/comment") >= 0 || url.indexOf("trade/content") >= 0) {
   // apiAppName = "/yundt-application-trade-supporting";
   //} else if (url.indexOf("smartsales/search") >= 0) {
   // apiAppName = "/smartsales-search-application";
   //}
  if (url.indexOf("http") >= 0) {
    option.url = url;
  } else {
    if (config.mockEnable) {
      // mock
      option.url = config.baseURL + '/api/' + option.version + "/" + url;
    } else {
      // 真实接口
      option.url = config.baseURL + apiAppName + '/api/' + option.version + "/" + url;
    }
  }

  // console.log('Request config->', config);

  return commonRequest(option, needHandComErr)
}
