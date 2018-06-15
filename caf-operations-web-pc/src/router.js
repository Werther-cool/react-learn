import React, { PropTypes } from 'react'
import { Router, hashHistory } from 'dva/router'
import AppView from './components/Layout/App/appView'
import { request } from './utils'
import Cookie from 'js-cookie'
import config from './config/config'

// 全局注入路由路径键值对映射
window.MODULE_TO_ROUTES = {}
window.ROUTES_TO_MODEL = {}
window.CURR_TAB_KEY = '/'

// DVA注册model方法
const cached = {}
const registerModel = (app, model, routeObj) => {
  let { namespace, path } = getPickRouteObj(model, routeObj)
  model.pathname = path
  if (!cached[namespace]) {
    if (!!routeObj) {
      model.namespace = namespace
    }
    app.model(model)
    cached[namespace] = 1
  }
}

// 修改路由路径
const getRoutePath = function (routeObj) {
  let path = ''
  if (-1 === routeObj.path.indexOf('/home')) {
    path = `/home/${routeObj.path}`
  } else {
    path = routeObj.path
  }
  return path
}

// 获得新的路由对象
const getPickRouteObj = function (model, routeObj) {
  let obj = {}
  if (!routeObj) {
    obj.namespace = model.namespace
    obj.path = ''
  } else {
    obj.namespace = routeObj.namespace
    obj.path = getRoutePath(routeObj)
  }
  return obj
}

// 设置路径键值对到全局models2Routes
const setModel2Routes = function (app, route) {
  if (!!route.routeObj) {
    let routeObj = route.routeObj
    let copyRouteObj = JSON.parse(JSON.stringify(routeObj))
    copyRouteObj.path = getRoutePath(copyRouteObj)
    // app._models[0].state.model2Routes[route.pathKey] = route.path
    window.MODULE_TO_ROUTES[routeObj.namespace] = routeObj
    window.ROUTES_TO_MODEL[copyRouteObj.path] = copyRouteObj
  }
}

// 路由路径键值对映射
const getPathKeyRoutes = function (app, routes) {
  if (0 !== routes.length) {
    let rootRoute = routes[2]
    let { childRoutes } = rootRoute

    if (!childRoutes || 0 === childRoutes.length) {
      setModel2Routes(app, rootRoute)
    } else {
      childRoutes.push(rootRoute)
      childRoutes.forEach((route, i) => {
        setModel2Routes(app, route)
      })
    }
  }
}

// 进入路由之前的处理，检查是否已登录
const beforeEnter = (nextState, replace, next) => {
  let path = nextState.location.pathname
  let buttonsObj = JSON.parse(localStorage.getItem('buttons'))
  if (!!buttonsObj) {
    let buttons = buttonsObj[path]
    if (!!buttons) {
      window.ROUTES_TO_MODEL[path].buttons = buttons
    }
  }
  //进入路由先解绑所有的排序事件
  // document.onkeydown = "";
  next()

}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: () => {
        return <div> {hashHistory.push('/home/index')} </div>
      }
    },
    {
      path: '/login',
      name: '登录',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./components/Layout/Login/loginView'))
        }, 'loginView')
      },
    },
    {
      path: '/home',
      name: '默认首页',
      component: AppView,
      getIndexRoute(nextState, cb) {
        require.ensure([], require => {
          if (!config.mockEnable) {
            let tmpAuth = Cookie.get(config.cookie.auth);
            if (tmpAuth == 'undefined' || tmpAuth == 'null' || !tmpAuth) {
              hashHistory.push('/login');
            }
          }
          registerModel(app, require('./test/testMod'))
          cb(null, require('./test/testView'))
        }, 'test')
      },
      childRoutes: [
        //样式测试
        {
          path: 'test',
          name: 'test',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./test/testMod'))
              cb(null, require('./test/testView'))
            }, 'test')
          },
          onEnter: beforeEnter
        },
        // 首页
        {
          path: 'index',
          name: '首页',
          routeObj: {
            namespace: 'indexModel',
            path: 'index',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/index/indexMod'), self.routeObj)
              cb(null, require('./pubBiz/index/indexView'))
            }, 'indexModel')
          },
          onEnter: beforeEnter
        },
        /*-----------------------------------经销商管理_模块-----------------------------------------*/
        // 经销商管理 - 区域设置
        {
          path: 'agencyMgmt/areaConfig',
          name: '区域设置',
          routeObj: {
            namespace: 'areaConfigModel',
            path: 'agencyMgmt/areaConfig',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/agencyMgmt/areaConfig/areaConfigMod'), self.routeObj)
              cb(null, require('./biz/agencyMgmt/areaConfig/areaConfigView'))
            }, 'areaConfigModel')
          },
          onEnter: beforeEnter
        },
        // 客户管理 - 客户列表
        {
          path: 'customMgmt/customList',
          name: '客户列表',
          routeObj: {
            namespace: 'customListModel',
            path: 'customMgmt/customList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/customMgmt/customList/customListMod'), this.routeObj)
              cb(null, require('./pubBiz/customMgmt/customList/customListView'))
            }, 'customListMod')
          },
          onEnter: beforeEnter
        },
        // 客户管理 - 客户详情
        {
          path: 'customMgmt/customDetail',
          name: '客户详情',
          routeObj: {
            namespace: 'customDetailModel',
            path: 'customMgmt/customDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/customMgmt/customDetail/customDetailMod'), this.routeObj)
              cb(null, require('./pubBiz/customMgmt/customDetail/customDetailView'))
            }, 'customDetail')
          },
          // onEnter: beforeEnter
        },
        // 经销商管理 - 经销商列表
        {
          path: 'agencyMgmt/agencyList',
          name: '经销商列表',
          routeObj: {
            namespace: 'agencyListModel',
            path: 'agencyMgmt/agencyList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/agencyMgmt/agencyList/agencyListMod'), self.routeObj)
              cb(null, require('./biz/agencyMgmt/agencyList/agencyListView'))
            }, 'agencyListModel')
          },
          onEnter: beforeEnter
        },
        // 经销商管理 - 新增经销商
        {
          path: 'agencyMgmt/addAgency',
          name: '新增经销商',
          routeObj: {
            namespace: 'addAgencyModel',
            path: 'agencyMgmt/addAgency',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/agencyMgmt/addAgency/addAgencyMod'), self.routeObj)
              cb(null, require('./pubBiz/agencyMgmt/addAgency/addAgencyView'))
            }, 'addAgencyMod')
          },
          // onEnter: beforeEnter
        },
        // 经销商管理 - 经销商详情
        {
          path: 'agencyMgmt/agencyDetail',
          name: '经销商详情',
          routeObj: {
            namespace: 'agencyDetailModel',
            path: 'agencyMgmt/agencyDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/agencyMgmt/agencyDetail/agencyDetailMod'), self.routeObj)
              cb(null, require('./biz/agencyMgmt/agencyDetail/agencyDetailView'))
            }, 'agencyDetailMod')
          },
          // onEnter: beforeEnter
        },
        /*-----------------------------------系统管理_模块-----------------------------------------*/
        // 系统管理 - 系统参数
        {
          path: 'systemMgmt/sysParameter',
          name: '系统参数',
          routeObj: {
            namespace: 'sysParameterModel',
            path: 'systemMgmt/sysParameter',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this;
            require.ensure([], require => {
              registerModel(app, require('./biz/systemMgmt/sysParameter/sysParameterMod'), self.routeObj)
              cb(null, require('./biz/systemMgmt/sysParameter/sysParameterView'))
            }, 'sysParameterModel')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 角色列表
        {
          path: 'systemMgmt/roleList',
          name: '角色列表',
          routeObj: {
            namespace: 'roleListModel',
            path: 'systemMgmt/roleList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/systemMgmt/roleList/roleListMod'), self.routeObj)
              cb(null, require('./pubBiz/systemMgmt/roleList/roleListView'))
            }, 'roleListModel')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 角色新增/编辑/详情
        {
          path: 'systemMgmt/roleMgmt',
          name: '角色管理',
          routeObj: {
            namespace: 'roleMgmtModel',
            path: 'systemMgmt/roleMgmt',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/systemMgmt/roleMgmt/roleMgmtMod'), self.routeObj)
              cb(null, require('./pubBiz/systemMgmt/roleMgmt/roleMgmtView'))
            }, 'roleMgmtModel')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 辅助属性
        {
          path: 'systemMgmt/secondaryProps',
          name: '辅助属性',
          routeObj: {
            namespace: 'secondaryPropsModel',
            path: 'systemMgmt/secondaryProps',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/systemMgmt/secondaryProps/secondaryPropsMod'), self.routeObj)
              cb(null, require('./biz/systemMgmt/secondaryProps/secondaryPropsView'))
            }, 'secondaryPropsModel')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 用户管理_列表
        {
          path: 'systemMgmt/userList',
          name: '用户管理',
          routeObj: {
            namespace: 'userListMod',
            path: 'systemMgmt/userList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/systemMgmt/userManage/userList/userListMod'), self.routeObj)
              cb(null, require('./pubBiz/systemMgmt/userManage/userList/userListView'))
            }, 'userListView')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 用户管理_新增、编辑
        {
          path: 'systemMgmt/userEdit',
          name: '新增用户',
          routeObj: {
            namespace: 'userEditMod',
            path: 'systemMgmt/userEdit',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/systemMgmt/userManage/userEdit/userEditMod'), self.routeObj)
              cb(null, require('./pubBiz/systemMgmt/userManage/userEdit/userEditView'))
            }, 'userEditView')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 用户管理_详情
        {
          path: 'systemMgmt/userDetails',
          name: '用户详情',
          routeObj: {
            namespace: 'userDetailsMod',
            path: 'systemMgmt/userDetails',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/systemMgmt/userManage/userDetails/userDetailsMod'), self.routeObj)
              cb(null, require('./pubBiz/systemMgmt/userManage/userDetails/userDetailsView'))
            }, 'userDetailsView')
          },
          onEnter: beforeEnter
        },
        // 系统管理 - 系统参数
        {
          path: 'systemMgmt/sysParameter',
          name: '系统参数',
          routeObj: {
            namespace: 'sysParameterModel',
            path: 'systemMgmt/sysParameter',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/systemMgmt/sysParameter/sysParameterMod'), self.routeObj)
              cb(null, require('./biz/systemMgmt/sysParameter/sysParameterView'))
            }, 'sysParameterModel')
          },
          onEnter: beforeEnter
        },
        /*------------------------------订单管理_模块--------------------------------------*/
        // 订单管理 - 线索列表
        {
          path: 'orderMgmt/indexList',
          name: '线索列表',
          routeObj: {
            namespace: 'indexListModel',
            path: 'orderMgmt/indexList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/indexList/indexListMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/indexList/indexListView'))
            }, 'indexListModel')
          },
          onEnter: beforeEnter
        },

        // 订单管理 - 线索详情
        {
          path: 'orderMgmt/indexDetail',
          name: '线索详情',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/indexDetail/indexDetailMod'))
              cb(null, require('./pubBiz/orderMgmt/indexDetail/indexDetailView'))
            }, 'indexDetail')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 新增线索
        {
          path: 'orderMgmt/addIndex',
          name: '新增线索',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/addIndex/addIndexMod'))
              cb(null, require('./pubBiz/orderMgmt/addIndex/addIndexView'))
            }, 'addIndex')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 预约单
        {
          path: 'orderMgmt/appointList',
          name: '预约单列表',
          routeObj: {
            namespace: 'appointListModel',
            path: 'orderMgmt/appointList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/appointList/appointListMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/appointList/appointListView'))
            }, 'appointListModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 预约单详情
        {
          path: 'orderMgmt/appointDetail',
          name: '预约单详情',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/appointDetail/appointDetailMod'))
              cb(null, require('./pubBiz/orderMgmt/appointDetail/appointDetailView'))
            }, 'appointDetail')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 销售单管理
        {
          path: 'orderMgmt/orderList',
          name: '订单管理',
          routeObj: {
            namespace: 'orderListModel',
            path: 'orderMgmt/orderList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/orderList/orderListMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/orderList/orderListView'))
            }, 'orderListModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 销售单管理-订单申诉审核
        {
          path: 'orderMgmt/checkList',
          name: '订单申诉审核',
          routeObj: {
            namespace: 'checkListModel',
            path: 'orderMgmt/checkList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/checkList/checkListMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/checkList/checkListView'))
            }, 'checkListModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 退款单管理
        {
          path: 'orderMgmt/repayList',
          name: '退款单管理',
          routeObj: {
            namespace: 'repayListModel',
            path: 'orderMgmt/repayList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/repayList/repayListMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/repayList/repayListView'))
            }, 'repayListModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 对账单列表
        {
          path: 'orderMgmt/checkBillList',
          name: '对账结算',
          routeObj: {
            namespace: 'checkBillListModel',
            path: 'orderMgmt/checkBillList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/checkBillList/checkBillListMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/checkBillList/checkBillListView'))
            }, 'checkBillListModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 订单详情
        {
          path: 'orderMgmt/orderDetail',
          name: '订单详情',
          routeObj: {
            namespace: 'orderDetailModel',
            path: 'orderMgmt/orderDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/orderDetail/orderDetailMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/orderDetail/orderDetailView'))
            }, 'orderDetailModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 优惠券订单详情
        {
          path: 'orderMgmt/orderCouponDetail',
          name: '优惠券订单详情',
          routeObj: {
            namespace: 'orderCouponDetailModel',
            path: 'orderMgmt/orderCouponDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/orderCouponDetail/orderCouponDetailMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/orderCouponDetail/orderCouponDetailView'))
            }, 'orderDetailModel')
          },
          onEnter: beforeEnter
        },
        // 订单管理 - 订单申诉详情
        {
          path: 'orderMgmt/orderComplainDetail',
          name: '订单申诉详情',
          routeObj: {
            namespace: 'orderComplainDetailModel',
            path: 'orderMgmt/orderComplainDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/orderMgmt/orderComplainDetail/orderComplainDetailMod'), self.routeObj)
              cb(null, require('./pubBiz/orderMgmt/orderComplainDetail/orderComplainDetailView'))
            }, 'orderComplainDetailModel')
          },
          onEnter: beforeEnter
        },

        /* -----------------------  车型管理 ( 模块 )  ------------------------------------*/

        // 车型管理列表
        {
          path: 'modelsManage/modelsList',
          name: '车型管理',
          routeObj: {
            namespace: 'modelsListMod',
            path: 'modelsManage/modelsList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./biz/modelsManage/modelsMan/modelsList/modelsListMod'), this.routeObj)
              cb(null, require('./biz/modelsManage/modelsMan/modelsList/modelsListView'))
            }, 'modelsList')
          },
          onEnter: beforeEnter
        },
        // 车型管理 - 新增/编辑车型
        {
          path: 'modelsManage/editModel',
          name: '新增车型',
          routeObj: {
            namespace: 'editModelMod',
            path: 'modelsManage/editModel',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/modelsManage/modelsMan/editModel/editModelMod'), self.routeObj)
              cb(null, require('./biz/modelsManage/modelsMan/editModel/editModelView'))
            }, 'editModelMod')
          },
          // onEnter: beforeEnter
        },
        // 车型管理 - 车型详情
        {
          path: 'modelsManage/modelDetails',
          name: '车型详情',
          routeObj: {
            namespace: 'modelDetailsMod',
            path: 'modelsManage/modelDetails',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/modelsManage/modelsMan/modelDetails/modelDetailsMod'), self.routeObj)
              cb(null, require('./pubBiz/modelsManage/modelsMan/modelDetails/modelDetailsView'))
            }, 'modelDetailsMod')
          },
          // onEnter: beforeEnter
        },
        {
          path: 'modelsManage/modelsOffer',
          name: '车型报价',
          routeObj: {
            namespace: 'modelsOfferMod',
            path: 'modelsManage/modelsOffer',
            urlArray: []
          },
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./biz/modelsManage/modelsOffer/modelsOfferList/modelsOfferMod'), this.routeObj)
              cb(null, require('./biz/modelsManage/modelsOffer/modelsOfferList/modelsOfferView'))
            }, 'modelsOffer')
          }
          // onEnter: beforeEnter
        },
        // 车型管理 - 车型报价详情
        {
          path: 'modelsManage/modelOfferDetails',
          name: '车型报价详情',
          routeObj: {
            namespace: 'modelOfferDetailsMod',
            path: 'modelsManage/modelOfferDetails',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/modelsManage/modelsMan/modelDetails/modelDetailsMod'), self.routeObj)
              cb(null, require('./pubBiz/modelsManage/modelsMan/modelDetails/modelDetailsView'))
            }, 'modelOfferDetailsMod')
          },
          // onEnter: beforeEnter
        },
        // 车型管理 - 品牌管理
        {
          path: 'modelsManage/brandMan',
          name: '品牌管理',
          routeObj: {
            namespace: 'brandManModel',
            path: 'modelsManage/brandMan',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/modelsManage/brandMan/brandManMod'), self.routeObj)
              cb(null, require('./biz/modelsManage/brandMan/brandManView'))
            }, 'brandManModel')
          },
          onEnter: beforeEnter
        },
        // 车型管理 - 类目管理
        {
          path: 'modelsManage/categoryMan',
          name: '类目管理',
          routeObj: {
            namespace: 'categoryManModel',
            path: 'modelsManage/categoryMan',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/modelsManage/categoryMan/categoryManMod'), self.routeObj)
              cb(null, require('./biz/modelsManage/categoryMan/categoryManView'))
            }, 'categoryManModel')
          },
          onEnter: beforeEnter
        },
        // 车型管理 - 属性管理
        {
          path: 'modelsManage/attributeMan',
          name: '属性管理',
          routeObj: {
            namespace: 'attributeManModel',
            path: 'modelsManage/attributeMan',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/modelsManage/attributeMan/attributeManMod'), self.routeObj)
              cb(null, require('./biz/modelsManage/attributeMan/attributeManView'))
            }, 'attributeManModel')
          },
          onEnter: beforeEnter
        },
        // 特惠车列表
        {
          path: 'modelsManage/discountList',
          name: '特惠车管理',
          routeObj: {
            namespace: 'discountList',
            path: 'modelsManage/discountList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/modelsManage/discountMgmt/discountList/discountListMod'), this.routeObj)
              cb(null, require('./pubBiz/modelsManage/discountMgmt/discountList/discountListView'))
            }, 'discountList')
          },
          onEnter: beforeEnter
        },
        // 特惠车管理 - 特惠车详情
        {
          path: 'modelsManage/discountDetail',
          name: '特惠车详情',
          routeObj: {
            namespace: 'discountDetailMod',
            path: 'modelsManage/discountDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/modelsManage/discountMgmt/discountDetail/discountDetailMod'), self.routeObj)
              cb(null, require('./pubBiz/modelsManage/discountMgmt/discountDetail/discountDetailView'))
            }, 'discountDetailMod')
          },
          // onEnter: beforeEnter
        },
        /* -----------------------  营销管理 ( 模块 )  ------------------------------------*/
        // 营销管理 - 活动列表
        {
          path: 'marketingMgmt/activityList',
          name: '活动列表',
          routeObj: {
            namespace: 'activityListModel',
            path: 'marketingMgmt/activityList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/marketingMgmt/activityList/activityListMod'), self.routeObj)
              cb(null, require('./pubBiz/marketingMgmt/activityList/activityListView'))
            }, 'activityListModel')
          },
          onEnter: beforeEnter
        },
        // 营销管理 - 活动列表
        {
          path: 'marketingMgmt/activityMgmt',
          name: '新增活动',
          routeObj: {
            namespace: 'activityMgmtModel',
            path: 'marketingMgmt/activityMgmt',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/marketingMgmt/activityMgmt/activityMgmtMod'), self.routeObj)
              cb(null, require('./pubBiz/marketingMgmt/activityMgmt/activityMgmtView'))
            }, 'activityMgmtModel')
          },
          onEnter: beforeEnter
        },
        // 营销管理 - 活动详情
        {
          path: 'marketingMgmt/activityDetail',
          name: '活动详情',
          routeObj: {
            namespace: 'activityDetailModel',
            path: 'marketingMgmt/activityDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/marketingMgmt/activityDetail/activityDetailMod'), self.routeObj)
              cb(null, require('./pubBiz/marketingMgmt/activityDetail/activityDetailView'))
            }, 'activityDetailModel')
          },
          onEnter: beforeEnter
        },
        // 营销管理 - 优惠券列表
        {
          path: 'marketingMgmt/couponList',
          name: '优惠券列表',
          routeObj: {
            namespace: 'couponListModel',
            path: 'marketingMgmt/couponList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/marketingMgmt/couponList/couponListMod'), self.routeObj)
              cb(null, require('./pubBiz/marketingMgmt/couponList/couponListView'))
            }, 'couponListModel')
          },
          onEnter: beforeEnter
        },
        // 营销管理 - 优惠券新增
        {
          path: 'marketingMgmt/couponEdit',
          name: '优惠券新增',
          routeObj: {
            namespace: 'couponEditModel',
            path: 'marketingMgmt/couponEdit',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/marketingMgmt/couponEdit/couponEditMod'), self.routeObj)
              cb(null, require('./pubBiz/marketingMgmt/couponEdit/couponEditView'))
            }, 'couponEditModel')
          },
          onEnter: beforeEnter
        },
        // 营销管理 - 优惠券详情
        {
          path: 'marketingMgmt/couponDetail',
          name: '优惠券详情',
          routeObj: {
            namespace: 'couponDetailModel',
            path: 'marketingMgmt/couponDetail',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/marketingMgmt/couponDetail/couponDetailMod'), self.routeObj)
              cb(null, require('./pubBiz/marketingMgmt/couponDetail/couponDetailView'))
            }, 'couponDetailModel')
          },
          onEnter: beforeEnter
        },
        // 营销管理 - 经销商活动列表
        {
          path: 'marketingMgmt/agencyActivityList',
          name: '经销商活动列表',
          routeObj: {
            namespace: 'agencyActivityListModel',
            path: 'marketingMgmt/agencyActivityList',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/marketingMgmt/agencyActivityList/agencyActivityListMod'), self.routeObj)
              cb(null, require('./biz/marketingMgmt/agencyActivityList/agencyActivityListView'))
            }, 'agencyActivityListModel')
          },
          onEnter: beforeEnter
        },
        /* -----------------------  内容管理 ( 模块 )  ------------------------------------*/
        // 内容管理 - 素材库
        {
          path: 'contentMgmt/materialLib',
          name: '素材库',
          routeObj: {
            namespace: 'materialLibModel',
            path: 'contentMgmt/materialLib',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/contentMgmt/materialLib/materialLibMod'), self.routeObj)
              cb(null, require('./pubBiz/contentMgmt/materialLib/materialLibView'))
            }, 'materialLibModel')
          },
          onEnter: beforeEnter
        },
        // 内容管理 - 商城设置
        {
          path: 'contentMgmt/mallConfig',
          name: '商城设置',
          routeObj: {
            namespace: 'mallConfigModel',
            path: 'contentMgmt/mallConfig',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./pubBiz/contentMgmt/mallConfig/mallConfigMod'), self.routeObj)
              cb(null, require('./pubBiz/contentMgmt/mallConfig/mallConfigView'))
            }, 'mallConfigModel')
          },
          onEnter: beforeEnter
        },
        // 内容管理 - 广告位设置
        {
          path: 'contentMgmt/advertiseConfig',
          name: '广告位设置',
          routeObj: {
            namespace: 'advertiseConfigModel',
            path: 'contentMgmt/advertiseConfig',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/contentMgmt/advertiseConfig/advertiseConfigMod'), self.routeObj)
              cb(null, require('./biz/contentMgmt/advertiseConfig/advertiseConfigView'))
            }, 'advertiseConfigModel')
          },
          onEnter: beforeEnter
        },
        /*------------------------------消息管理_模块--------------------------------------*/
        // 消息管理 - 短信模板列表
        {
          path: 'msgMgmt/smsTemplateMgmt',
          name: '短信模板列表',
          routeObj: {
            namespace: 'smsTempletListModel',
            path: 'msgMgmt/smsTemplateMgmt',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/messageMgmt/smsTempletList/smsTempletListMod'), self.routeObj)
              cb(null, require('./biz/messageMgmt/smsTempletList/smsTempletListView'))
            }, 'smsTempletListModel')
          },
          onEnter: beforeEnter
        },
        // 消息管理 - 短信模板列表
        {
          path: 'msgMgmt/mailTemplateMgmt',
          name: '站内信模板列表',
          routeObj: {
            namespace: 'mailTempletListModel',
            path: 'msgMgmt/mailTemplateMgmt',
            urlArray: []
          },
          getComponent(nextState, cb) {
            let self = this
            require.ensure([], require => {
              registerModel(app, require('./biz/messageMgmt/mailTempletList/mailTempletListMod'), self.routeObj)
              cb(null, require('./biz/messageMgmt/mailTempletList/mailTempletListView'))
            }, 'mailTempletListModel')
          },
          onEnter: beforeEnter
        },
         // 消息管理 - 短信模板列表
        //  {
        //   path: 'messageMgmt/templetDetail',
        //   name: '模板详情',
        //   routeObj: {
        //     namespace: 'templetDetailModel',
        //     path: 'messageMgmt/templetDetail',
        //     urlArray: []
        //   },
        //   getComponent(nextState, cb) {
        //     let self = this
        //     require.ensure([], require => {
        //       registerModel(app, require('./biz/messageMgmt/templetDetail/templetDetailMod'), self.routeObj)
        //       cb(null, require('./biz/messageMgmt/templetDetail/templetDetailView'))
        //     }, 'templetDetailModel')
        //   },
        //   onEnter: beforeEnter
        // },
      ],
    },
  ]

  getPathKeyRoutes(app, routes)
  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
