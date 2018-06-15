/**
 * @(#)agencyListView.jsx 0.1.0 2018-03-19
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm } from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
import moment from 'moment';
// const { RangePicker } = DatePicker;
import { get } from 'lodash'
import { Link, hashHistory } from "dva/router";
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
import config from '../../../config/config'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
import styles from './agencyListStyle.less';
// 引入模拟数据
// import mockData  from './mockData'
/**
* 经销商管理 - 经销商列表 组件
*
* @author 阿九
* @since 0.1.0
*/

//布局配置
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 13
	},
}
const routeView = function ({ dispatch, model, form }) {
	const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form;
	// 取出model对象，命名空间
	const { modelObj, namespace } = model
	const { modalStatus } = modelObj;

	let pageProps = {
		// ---------- 界面部分 ----------
		"ui": {
			// 页面接口地址
			"api_url": "caf/mgmt/dealer/list",
			// 接口方式
			"method": "GET",
			// 接口参数
			"params": "pageNum=1&pageSize=10",
			// 模拟数据 - 用于开发需要，若填充了上面的api_url之后，请将此项设置为null
			// "mockData": mockData,
			// 查询栏
			"search_bar": {
				"fields": [
					{
						"en_name": "code",
						"zh_name": "经销商编号",
						"elem_type": "Input",
						"elem_valid_type": "string"
					},
					{
						"en_name": "dealerName",
						"zh_name": "经销商名称",
						"elem_type": "Input",
						"elem_valid_type": "string"
					},
					{
						"en_name": "cityId",
						"zh_name": "所属地区",
						"elem_type": "Cascader",
						"elem_valid_type": "string",
						changeOnSelect: true,
						"cmpt_items": modelObj.areaTree,
					},
					// 单选类型示例
					// {
					//   "en_name": "gender",
					//   "zh_name": "性别",
					//   "elem_type": "Select",
					//   "elem_valid_type": "string",
					//   "cmpt_items": [
					//     {"label": "男", "value": "1"},
					//     {"label": "女", "value": "2"}
					//   ],
					//   // "cmpt_field_name": "sexList"
					// },
					// 时间范围示例
					// {
					//   "en_name": "modifyDate",
					//   "zh_name": "创建时间",
					//   "elem_type": "Date",
					//   "split_keys": ['createTimeBegin', 'createTimeEnd'],
					//   "format": 'YYYY-MM-DD',
					//   "elem_valid_type": "string"
					// },
				],
				// 重置按钮钩子函数, 在点击重置按钮时会被调用
				// 同样的, 还有 searchHandler 搜索按钮钩子函数
				// "resetHandler": () =>{
				//   updateModel(true, 'clearConditionFlag')
				//   setTimeout(() => {
				//     updateModel(false, 'clearConditionFlag')
				//   }, 300);
				// },

				// 自定义按钮设置, 与搜索/重置按钮同一排
				// "actions": [
				//   {
				//     "func_name": "more",
				//     // "label": "更多搜索条件",
				//     // "type": "primary",
				//     // "onClick": (e) =>{
				//     //   console.log('more')
				//     //   showModal()
				//     // }
				//     "render": () => {
				//       return <Button type="default" htmlType="button" onClick={() => $('#userList-children').slideToggle() }>更多搜索条件</Button>
				//     }
				//   }
				// ]
			},
			// 页面右上角操作栏
			"action_bar": [
				{
					"func_name": "onAdd",
					"label": "新增",
					"type": "primary",
					"icon": "plus",
					"onClick": (e) => {
						hashHistory.push('/home/agencyMgmt/addAgency')
					}
				}
			],

			// 数据表格
			"table": {
				// 表头字段列表
				"fields": [
					{
						"en_name": "code",
						"zh_name": "经销商编号",
						"width": 150,
						// "render": (text, record, index) => {
						//   return <span>{ record.seller.id }</span>
						// }
					},
					{
						"en_name": "dealerName",
						"zh_name": "经销商名称",
						// "width": 200,
						// "render": (text, record, index) => {
						//   return <span>{ record.seller.sellerName }</span>
						// }
					},
					{
						"en_name": "aliasName",
						"zh_name": "简称",
						// "width": 200,
						// "render": (text, record, index) => {
						//   return <span>{ record.seller.companyName }</span>
						// }
					},
					{
						"en_name": "cityCode",
						"zh_name": "所属地区",
						// "width": 120,
						render: (text, record, index) => {
							return <div>{record.provinceName}/{record.cityName}</div>
						}
					},
					{
						"en_name": "countyCode",
						"zh_name": "所属区域",
						// "width": 120,
						render: (text, record, index) => {
							return <div>{record.areaName}</div>
						}
					},
					{
						"en_name": "mainBrand",
						"zh_name": "经营品牌",
						// "width": 120,
						"render": (text, record, index) => {
							let brand = record.brands.map(e => e.name)
							return <span>{brand.join(',')}</span>
						}

					},
					{
						"en_name": "status",
						"zh_name": "经营状态",
						"width": 70,
						render: (text, record, index) => {
							let str = '';
							if (record.status === 0) { str = '未定义' }
							if (record.status === 1) { str = '营业' }
							if (record.status === 2) { str = '禁封' }
							if (record.status === 3) { str = '停业' }
							if (record.status === 4) { str = '在建' }
							if (record.status === 5) { str = '取消' }
							return <div>{str}</div>
						}
					},
					{
						"en_name": "createTime",
						"zh_name": "创建时间",
						"width": 150,
						// "render": (text, record, index) => {
						//   return <span>{ record.seller.createTime }</span>
						// }
					},
				],

				// 表格操作
				// 操作栏设置
				"action_props": {
					"width": 80,
				},
				// 整个表格的宽度, 设置该属性后表格可左右滚动
				// "scroll": { x: 1665 },
				"actions": [
					{
						"func_name": "onDetail",
						"label": "查看",
						"type": "",
						"icon": "",
						"onClick": (e, record) => {
							hashHistory.push(`/home/agencyMgmt/agencyDetail?id=${record.id}`)
						},
					},
					{
						"func_name": "onEdit",
						"label": "编辑",
						"type": "",
						"icon": "",
						"onClick": (e, record) => {
							hashHistory.push(`/home/agencyMgmt/addAgency?id=${record.id}`)
						},
					},
					// {
					//   "func_name": "onDetail",
					//   "label": "查看详情",
					//   "type": "",
					//   "icon": "",
					//   "url": "/home/userMgmt/userDetails",
					//   "params": "accountId="
					// },
					// 删除接口在func_name为onDelete时会自动添加popconfirm
					// {
					//   "func_name": "onDelete",
					//   "label": "删除",
					//   "api_url": "yundt/mgmt/item/prop/group/efficacyDel",
					//   "params": "&id=",
					//   "method": "DELETE"
					// }
				]
			}
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
		let obj = modelObj;
		if (modHierarchy) {
			modHierarchy = modHierarchy.split(".");
			modHierarchy.map(e => {
				obj = obj[e];
			});
		}
		//如果是时间
		if (name == 'time') {
			obj['startTime'] = value[0];//发布开始时间
			obj['endTime'] = value[1];//发布结束时间
		} else {
			obj[name] = value;
		}
		// 分发到model
		dispatch({
			type: `${namespace}/updateModel`,
			payload: obj
		});
	};

	// 编辑属性
	function updateProp() {
		updateModel(true, 'loading')
		dispatch({
			type: `${namespace}/updateProp`,
			payload: {}
		});
	}

	return (
		<div>
			<ListPage pageProps={pageProps} />
		</div>
	)
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
