/**
 * @(#)agencyActivityListMod.js 0.1.0 2018-03-23
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// 对象和JSON字符串互转
import { parse } from 'qs'
// 弹出消息框
import { message } from 'antd'
// 日期处理对象
import moment from 'moment'
/* isEmpty 对象是否为空
 * isArray 对象是否数组
 * cloneDeep 对象深拷贝
 */
import { isEmpty, isArray, cloneDeep, merge } from 'lodash'

// 引入路由对象
import { hashHistory } from 'dva/router'
import { auditUpdate } from './agencyActivityListServ';

// 初始默认状态
const defaultState = {
	//弹窗
	biz: {
		queryForm: {}
	},
	downVisible: false,
	//审核
	audit: {
		id: '',
		remark: '',
		status: ''
	}
}

const tmpModule = {
	// // 命名空间
	// namespace: 'secondaryPropsModel',
	// 默认状态
	state: cloneDeep(defaultState),
	// 入口函数(先执行)
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				// 页面编辑路由
				if (tmpModule.pathname === '' + location.pathname) {
					// 执行业务操作
					// dispatch({
					//   type: 'getUserList',
					//   payload: {}
					// })
				}
			})
		},
	},
	// 方法列表
	effects: {
		// 设置表单的值到状态机
		*setFormVal({ payload }, { put, call, select }) {
			let { biz } = yield select(d => d[tmpModule.namespace])
			try {
				yield put({
					type: 'store',
					payload: {
						biz: payload
					}
				})
			} catch (e) {
				console.error(e)
			}
		},
		//提交
		*updateModel({ payload: obj }, { put, call, select }) {
			let state = yield select(e => e[tmpModule.namespace]);
			yield put({
				type: 'store',
				payload: {
					...obj
				},
			});
		},

		*auditUpdate({ payload = {} }, { put, call, select }) {
			yield put({ type: 'store', payload: { downVisible: false } })
			let state = yield select(e => e[tmpModule.namespace]);
			let { data, resultCode, resultMsg } = yield call(auditUpdate, state.audit);
			if (resultCode === 0) {
				state.biz.refreshListDatas();
				message.success('操作成功');
			}
		},

	},
	// 存入状态机
	reducers: {
		store(preState, action) {
			return Object.assign({}, preState, action.payload)
		},
	}
}

export default tmpModule
