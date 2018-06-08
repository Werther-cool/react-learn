// const APIV1 ="http://192.168.202.02:8057";
const APIV1 = "http://smart.dtyunxi.com:8057";
module.exports ={
  api: {
    /* 获取已经根据活动注册用户匹配拍摄头像的数据 */
    mached: `${APIV1}/api/v1/yueyun/customer/get`,
    /* 保存根据活动注册用户匹配拍摄头像的数据 */
    save:`${APIV1}/api/v1/yueyun/customer/save`,
    /* 获取已注册活动的用户在注册时间前几分钟被人脸识别的用户 */
    // registerEvent:`${APIV1}/api/v1/yueyun/registerEvent/get`,
    registerEvent:`${APIV1}/api/v1/yueyun/activity/get`,

    /* 首页数据 */
    homeGet:`${APIV1}/api/v1/yueyun/event/get`,
    /* 取消关联 */
    delete:`${APIV1}/api/v1/yueyun/customer/delete`,
    /* 推送 */
    pushId:`${APIV1}/api/v1/yueyun/customer/push`,
     /* 推送全部 */
     pushAllId:`${APIV1}/api/v1/yueyun/customers/push`,
     /* 会员mached 搜索名字 */
     searchMached:`${APIV1}/api/v1/yueyun/customer/blur`,
     /* 潜客 搜索名字 */
     searchPot:`${APIV1}/api/v1/yueyun/activity/blur`
  }
}