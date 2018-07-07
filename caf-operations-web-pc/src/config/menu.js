let menuList = [
  // {
  //   key: "test",
  //   value: "01",
  //   name: "前端页面标准",
  //   icon: "icon-chanpinguanli"
  // },
  {
    key: "index",
    value: "09",
    name: "首页",
    icon: "icon-shanghushouye"
  },
  {
    key: "agencyMgmt",
    name: "经销商管理",
    icon: "icon-shanghushouye",
    value: "01",
    children: [
      {
        key: "areaConfig",
        name: "区域设置",
        icon: "icon-wodechanpin",
        value: "011"
      },
      {
        key: "agencyList",
        name: "经销商管理",
        icon: "icon-wodechanpin",
        value: "012"
      },
      {
        key: "addAgency",
        name: "新增经销商",
        icon: "icon-wodechanpin",
        value: "013",
        hidden: true
      },
      {
        key: "agencyDetail",
        name: "经销商详情",
        icon: "icon-wodechanpin",
        value: "014",
        hidden: true
      }

    ]
  },
  {
    key: "customMgmt",
    name: "客户管理",
    icon: "icon-shanghushouye",
    value: "02",
    children: [
      {
        key: "customList",
        name: "客户管理",
        icon: "icon-wodechanpin",
        value: "021"
      },
      {
        key: "customDetail",
        name: "客户详情",
        icon: "icon-wodechanpin",
        value: "022",
        hidden: true
      }
    ]
  },
  {
    key: "modelsManage",
    name: "车型管理",
    icon: "icon-shanghushouye",
    value: "03",
    children: [
      {
        key: "brandMan",
        name: "品牌管理",
        icon: "icon-wodechanpin",
        value: "031"
      },
      {
        key: "categoryMan",
        name: "类目管理",
        icon: "icon-wodechanpin",
        value: "032"
      },
      {
        key: "attributeMan",
        name: "属性管理",
        icon: "icon-wodechanpin",
        value: "033"
      },
      {
        key: "modelsList",
        name: "车型管理",
        icon: "icon-wodechanpin",
        value: "034"
      },
      {
        key: "editModel",
        name: "新增车型",
        icon: "icon-wodechanpin",
        value: "0341",
        hidden: true
      },
      {
        key: "modelDetails",
        name: "车型详情",
        icon: "icon-wodechanpin",
        value: "0342",
        hidden: true
      },

      {
        key: "modelsOffer",
        name: "车型报价管理",
        icon: "icon-wodechanpin",
        value: "035"
      },
      {
        key: "modelOfferDetails",
        name: "车型报价详情",
        icon: "icon-wodechanpin",
        value: "0351",
        hidden: true
      },

      {
        key: "discountList",
        name: "特惠车管理",
        icon: "icon-wodechanpin",
        value: "036"
      },
      {
        key: "discountDetail",
        name: "特惠车详情",
        icon: "icon-wodechanpin",
        value: "0361",
        hidden: true
      }

    ]
  },
  {
    key: "orderMgmt",
    name: "订单管理",
    icon: "icon-shanghushouye",
    value: "04",
    children: [
      {
        key: "indexList",
        name: "线索管理",
        icon: "icon-wodechanpin",
        value: "041"
      },
      {
        key: "indexDetail",
        name: "线索详情",
        icon: "icon-wodechanpin",
        value: "0411",
        hidden: true
      },
      {
        key: "addIndex",
        name: "新增线索",
        icon: "icon-wodechanpin",
        value: "0412",
        hidden: true
      },
      {
        key: "appointList",
        name: "预约单管理",
        icon: "icon-wodechanpin",
        value: "042"
      },
      {
        key: "appointDetail",
        name: "预约单详情",
        icon: "icon-wodechanpin",
        value: "0421",
        hidden: true
      },

      {
        key: "orderList",
        name: "订单管理",
        icon: "icon-wodechanpin",
        value: "043"
      },
      {
        key: "checkList",
        name: "订单申诉审核",
        icon: "icon-wodechanpin",
        value: "0431",
        hidden: true
      },
      {
        key: "orderDetail",
        name: "订单详情",
        icon: "icon-wodechanpin",
        value: "0432",
        hidden: true
      },
      {
        key: "orderCouponDetail",
        name: "优惠券订单详情",
        icon: "icon-wodechanpin",
        value: "0433",
        hidden: true
      },
      {
        key: "orderComplainDetail",
        name: "订单申诉详情",
        icon: "icon-wodechanpin",
        value: "0434",
        hidden: true
      },

      {
        key: "repayList",
        name: "退款单管理",
        icon: "icon-wodechanpin",
        value: "044"
      },
      {
        key: "checkBillList",
        name: "对账结算",
        icon: "icon-wodechanpin",
        value: "045"
      },
    ]
  },
  {
    key: "marketingMgmt",
    name: "活动管理",
    icon: "icon-shanghushouye",
    value: "05",
    children: [
      {
        key: "couponList",
        name: "优惠券管理",
        icon: "icon-wodechanpin",
        value: "051"
      },
      {
        key: "couponEdit",
        name: "新增优惠券",
        icon: "icon-wodechanpin",
        value: "0511",
        hidden: true
      },
      {
        key: "couponDetail",
        name: "优惠券详情",
        icon: "icon-wodechanpin",
        value: "0512",
        hidden: true
      },

      {
        key: "activityList",
        name: "平台活动管理",
        icon: "icon-wodechanpin",
        value: "052"
      },
      {
        key: "activityMgmt",
        name: "新增活动",
        icon: "icon-wodechanpin",
        value: "0521",
        hidden: true
      },
      {
        key: "activityDetail",
        name: "活动详情",
        icon: "icon-wodechanpin",
        value: "0522",
        hidden: true
      },
      {
        key: "agencyActivityList",
        name: "经销商活动管理",
        icon: "icon-wodechanpin",
        value: "053"
      },
    ]
  },
  {
    key: "contentMgmt",
    name: "内容管理",
    icon: "icon-shanghushouye",
    value: "06",
    children: [
      {
        key: "materialLib",
        name: "素材库",
        icon: "icon-wodechanpin",
        value: "061"
      },
      {
        key: "mallConfig",
        name: "商城首页设置",
        icon: "icon-wodechanpin",
        value: "062"
      },
      {
        key: "advertiseConfig",
        name: "广告位设置",
        icon: "icon-wodechanpin",
        value: "063"
      },
    ]
  },
  {
    key: "systemMgmt",
    name: "系统管理",
    icon: "icon-shanghushouye",
    value: "07",
    children: [
      {
        key: "roleList",
        name: "角色管理",
        icon: "icon-wodechanpin",
        value: "071"
      },
      {
        key: "roleMgmt",
        name: "角色详情",
        icon: "icon-wodechanpin",
        value: "072",
        hidden: true
      },
      {
        key: "userList",
        name: "用户管理",
        icon: "icon-wodechanpin",
        value: "073"
      },
      {
        key: "userEdit",
        name: "新增用户",
        icon: "icon-wodechanpin",
        value: "076",
        hidden: true
      },
      {
        key: "userDetails",
        name: "用户详情",
        icon: "icon-wodechanpin",
        value: "077",
        hidden: true
      },
      {
        key: "secondaryProps",
        name: "系统辅助属性",
        icon: "icon-wodechanpin",
        value: "074"
      },
      {
        key: "sysParameter",
        name: "系统参数",
        icon: "icon-wodechanpin",
        value: "075"
      },
    ]
  },
  {
    key: "msgMgmt",
    name: "消息管理",
    icon: "icon-shanghushouye",
    value: "08",
    children: [
      {
        key: "smsTemplateMgmt",
        name: "短信模板列表",
        icon: "icon-wodechanpin",
        value: "081"
      },
      {
        key: "mailTemplateMgmt",
        name: "站内信模板列表",
        icon: "icon-wodechanpin",
        value: "082"
      },
    ]
  },
];

module.exports = menuList;
