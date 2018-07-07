import { request } from '../../../../config/request'

// 车型报价列表
export async function listCarPrice(params) {
  return request({
    url: 'caf/mgmt/items/car/offer/list-by-page',
    method: 'GET',
    data: params
  });
}

// 车型强制下架
export async function forceOffShelf(params) {
  return request({
    url: 'caf/mgmt/items/car/offer/update',
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

// 省市区树
export async function cityTree(params) {
  return request({
    url: 'caf/mgmt/area/cityList',
    method: 'GET',
    data: params
  },true);
};
