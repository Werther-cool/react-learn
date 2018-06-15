import { request } from '../../../config/request'

  // 属性列表删除
  export async function deleteFun(params) {
    return request({
      url: 'caf/mgmt/items/prop/delete',
      method: 'PUT',
      // headers:{
      //   'Content-type':'application/json'
      // },
      data: params
    },true);
  };
  // 属性编辑
  export async function editFun(params) {
    return request({
      url: 'caf/mgmt/items/prop/update',
      method: 'PUT',
      headers:{
        'Content-type':'application/json'
      },
      data: params
    },true);
  };
  // 属性新增
  export async function addFun(params) {
    return request({
      url: 'caf/mgmt/items/prop/add',
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      data: params
    },true);
  };
//详情
export async function getDetails(params) {
  return request({
    url: 'caf/mgmt/items/prop/detail/get',
    method: 'GET',
    data: params
  },true);
};
//删除属性值
export async function deVulues(params) {
  return request({
    url: 'caf/mgmt/items/prop/value/delete',
    method: 'DELETE',
    data: params
  },true);
};
/*/api/v1/caf/mgmt/items/prop/value/delete
  参数：propId属性id，propValueId属性值id*/
