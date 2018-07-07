/**
 * @(#)agencyActivityListView.jsx 0.1.0 2018-03-23
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm, message } from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
import moment from 'moment';
// const { RangePicker } = DatePicker;
import { get, cloneDeep } from 'lodash'
import { Link } from "dva/router";
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
import config from '../../../config/config'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './agencyActivityListStyle.less';
import { browserHistory, hashHistory } from 'dva/router'
/**
* 营销管理 - 经销商活动列表 组件
*
* @author 贾诩
* @since 0.1.0
*/
const routeView = function ({ dispatch, model, form }) {
	const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form;
	// 取出model对象，命名空间
	const { modelObj, namespace,buttons } = model
	const { modalStatus } = modelObj;

	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 18 }
	};

	// 经销商活动状态判断
	function agencyStatus(auditStatus, actStatus) {
		let statusMapper = {
			'1': { str: '未提交', status: 1 },
			'2': { str: '待审核', status: 2 },
			'6': { str: '未通过', status: 7 },
			'4': {
				'2': { str: '未开始', status: 3 },
				'3': { str: '进行中', status: 4 },
				'4': { str: '已结束', status: 5 },
				'5': { str: '已终止', status: 6 },
			},
		}
		if (!auditStatus) {
			// 如果后台数据不对 返回为null
			return { str: '', status: 0 }
		} else if (auditStatus + '' === '4') {
			if (!actStatus) {
				return { str: '', status: 0 }
			} else {
				return statusMapper[auditStatus][actStatus]
			}
		} else if (auditStatus + '' === '5') {
			return { str: '', status: 0 }
		}
		else {
			return statusMapper[auditStatus]
		}
	}

	let pageProps = {
		// ---------- 界面部分 ----------
		"ui": {
			// 页面接口地址
			"api_url": "caf/mgmt/promotion/activity/list-by-page",
			// 接口方式
			"method": "GET",
			// 接口参数
			"params": "pageNum=1&pageSize=10&sourceType=3",
			// 模拟数据 - 用于开发需要，若填充了上面的api_url之后，请将此项设置为null
			// "mockData": mockData,
			// 查询栏
			"search_bar": {
				"fields": [
					{
						"en_name": "name",
						"zh_name": "活动名称",
						"elem_type": "Input",
						"elem_valid_type": "string"
					},
					// {
					// 	"en_name": "createTime",
					// 	"zh_name": "创建时间",
					// 	"elem_type": "Date",
					// 	"split_keys": ['createTimeStart', 'createTimeEnd'],
					// 	"format": 'YYYY-MM-DD',
					// 	"elem_valid_type": "string"
          // },
          {
						"en_name": ['createTimeStart', 'createTimeEnd'],
						"zh_name": ["开始时间", "结束时间"],
            "elem_type": "SplitDate",
            "showTime": true,
						"format": 'YYYY-MM-DD HH:mm:ss',
						"elem_valid_type": "string"
					},
					{
						"en_name": "dealerName",
						"zh_name": "经销商名称",
						"elem_type": "Input",
						"elem_valid_type": "string"
					},
					{
						"en_name": "activityType",
						"zh_name": "活动类型",
						"elem_type": "Select",
						"elem_valid_type": "string",
						"cmpt_items": [
							{ "label": "领券活动", "value": "1" },
							{ "label": "留资活动", "value": "2" },
							{ "label": "新闻资讯", "value": "3" }
						],
					},
				],
			},
			// 数据表格
			"table": [
				{
					"status_params": "tag=",
					"status_text": "全部",
					"badge_field_name": 'allNum',
					// "badge_num": modelObj.statusNum.status0,
					// 表头字段列表
					"fields": [
						{
							"en_name": "name",
							"zh_name": "活动名称"
						},
						{
							"en_name": "remark",
							"zh_name": "活动说明",
						},
						{
							"en_name": "activityTypeName",
							"zh_name": "活动类型",
							"width":100,
							render: (text, record) => {
								let str = '';
								if (record.activityType === 1) { str = '领券活动' }
								if (record.activityType === 2) { str = '留资活动' }
								if (record.activityType === 3) { str = '新闻资讯' }
								return <div>{str}</div>
							}
						},
						{
							"en_name": "createTime",
							"zh_name": "活动时间",
							"width":270,
							render: (text, record) => {
								return <span>{record.beginDate}~{record.endDate}</span>
							}
						},
						{
							"en_name": "dealerName",
							"zh_name": "经销商名称",
						},
						{
							"en_name": "actStatusName",
							"zh_name": "状态",
							"width"  : 100,
							render: (text, record,index) => {
				let r = agencyStatus(record.auditStatus, record.actStatus)
								let { str, status } = r
								return <div>{str}</div>
							}
						},
					],
					// 操作栏设置
					"action_props": {
						"width": 170,
					},
					// 表格操作
					"actions": [
						{
							"func_name": "onOperat",
							"label": "操作",
							render: (item) => {
								return <span>
									<Link to={`/home/marketingMgmt/activityDetail?id=${item.id}&from=3`}>查看</Link>
									{
										buttons && buttons.includes("audit") && item.auditStatus === 2 &&
										<span>
											<span className='ant-divider' />
											<Link onClick={() => { dispatch({ type: `${namespace}/store`, payload: { downVisible: true, audit: { id: item.id, remark: '', status: 1 } } }) }}>通过</Link>
											<span className='ant-divider' />
											<Link onClick={() => { dispatch({ type: `${namespace}/store`, payload: { downVisible: true, audit: { id: item.id, remark: '', status: 0 } } }) }}>未通过</Link>
										</span>
									}
									{
										// item.actStatus === 1 &&
										// <Link onClick={() => updateModel(true, 'downVisible')}>强制下架</Link>
									}
								</span>
							}
						},
					]
				},
				{
					"status_params": "auditStatus=2",
					"status_text": "待审核",
					"badge_field_name": 'unAuditNum',
					// "badge_num": 10,
					// "badge_num": modelObj.statusNum.status4,
				},
				{
					"status_params": "auditStatus=6",
					"status_text": "未通过",
					"badge_field_name": 'unPassNum',
					// "badge_num": 1,
					// "badge_num": modelObj.statusNum.status2,
				},
				{
					"status_params": "tag=2",
					"status_text": "未开始",
					"badge_field_name": 'unBeginNum',
					// "badge_num": modelObj.statusNum.status3,
				},
				{
					"status_params": "tag=3",
					"status_text": "进行中",
					"badge_field_name": 'progressingNum',
					// "badge_num": modelObj.statusNum.status5,
				},
				{
					"status_params": "tag=4",
					"status_text": "已结束",
					"badge_field_name": 'finishNum',
					// "badge_num": modelObj.statusNum.status5,
				},
				{
					"status_params": "tag=5",
					"status_text": "已终止",
					"badge_field_name": 'soldOutNum',
					// "badge_num": modelObj.statusNum.status5,
				}
			]
		},
	}

	if (!!modelObj.biz) {
		pageProps.biz = modelObj.biz
		pageProps.biz.syncBackCbf = (biz) => {
			dispatch({
				type: `${namespace}/setFormVal`,
				payload: biz
			})
		}
	}

	//状态值变化
	function updateModel(value, name, modHierarchy) {
		let obj = cloneDeep(modelObj);
		//trace记录每一个访问路径
		let trace = [];
		trace.push(obj);
		if (modHierarchy) {
			modHierarchy = modHierarchy.split(".");
			modHierarchy.forEach((item, index) => {
				trace.push(trace[index][item]);
			});
		}
		trace[trace.length - 1][name] = value;
		// 分发到model
		dispatch({
			type: `${namespace}/updateModel`,
			payload: obj
		});
	}

	function auditUpdate() {
		if (modelObj.audit.remark === '') { return message.error('请先填写备注') }
		dispatch({ type: `${namespace}/auditUpdate` })
	}

	// //状态值变化
	// function updateModel(value, name, modHierarchy) {
	// 	let obj = modelObj;
	// 	if (modHierarchy) {
	// 		modHierarchy = modHierarchy.split(".");
	// 		modHierarchy.map(e => {
	// 			obj = obj[e];
	// 		});
	// 	}
	// 	//如果是时间
	// 	if (name == 'time') {
	// 		obj['startTime'] = value[0];//发布开始时间
	// 		obj['endTime'] = value[1];//发布结束时间
	// 	} else {
	// 		obj[name] = value;
	// 	}
	// 	// 分发到model
	// 	dispatch({
	// 		type: `${namespace}/updateModel`,
	// 		payload: obj
	// 	});
	// };
	console.log('modal---', modelObj);
	return (
		<div>
			<Modal title="备注"
				visible={modelObj.downVisible}
				onCancel={() => updateModel(false, 'downVisible')}
				onOk={() => { auditUpdate() }}
			>
				<Row>
					<Col span={20}>
						<FormItem
							{...formItemLayout}
							label="备注内容">
							{getFieldDecorator('remark', {
								initialValue: modelObj.audit.remark,
								rules: [
									{ required: false, message: '请填写评价内容' },
								],
							})
								(<Input type="textarea"
									style={{ height: '84px' }}
									placeholder="请填写备注内容"
									onChange={(e) => { updateModel(e.target.value, 'remark', 'audit') }}
								/>)}
						</FormItem>
					</Col>
				</Row>
			</Modal>
			<ListPage pageProps={pageProps} />
		</div>
	)
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
