/**
 * @(#)categoryManView.jsx 0.1.0 2018-03-26
 * Copyright (c) 2017, YUNXI. All rights reserved.
 * YUNXI PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// React基础组件
import React from 'react'
// dva 连接组件 - 连接route和model
import { connect } from 'dva'
// 表单Form等Antd组件
import { Form, Input, Select, Row, Col, Checkbox, Button, DatePicker, Modal, Icon, Popconfirm, message, Tree, Radio, Table, Switch, InputNumber } from 'antd';
// 表单域
const FormItem = Form.Item;
const Confirm = Modal.confirm
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
import moment from 'moment';
// const { RangePicker } = DatePicker;
import { get } from 'lodash'
import { Link } from "dva/router";
// 引入列表页组件
import ListPage from '../../../components/PageTmpl/ListPage'
// 引入model取值工具方法
import { mapStateToProps } from '../../../utils/view_utils'
import config from '../../../config/config'
import comCss from '../../common/comCss/comCss.less';
import $ from "jquery";
// 引入上传组件
import Uploader from '../../../components/Upload'
import styles from './categoryManStyle.less';
import { browserHistory, hashHistory } from 'dva/router'
/**
* 车型管理 - 类目管理 组件
*
* @author 贾诩
* @since 0.1.0
*/
const routeView = function ({ dispatch, model, form }) {
  const { resetFields, getFieldDecorator, validateFields, setFieldsValue } = form;
  // 取出model对象，命名空间
  const { modelObj, namespace } = model
  const { modalStatus } = modelObj;

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

  {/*==================================树处理函数开始===============================================*/ }
  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      dataList.push({ key, name: node.name });
      if (node.children) {
        generateList(node.children, node.key);
      }
    }
  };
  generateList(modelObj.catalogTree);

  const getSearch = (value) => {
    const expandedKeys = dataList.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(item.name, modelObj.catalogTree);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    dispatch({
      type: `${namespace}/getSearchKey`,
      payload: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      }
    });
  }

  const getParentKey = (name, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.name === name)) {
          parentKey = node.id + '';
        } else if (getParentKey(name, node.children)) {
          parentKey = getParentKey(name, node.children);
        }
      }
    }
    return parentKey;
  };

  const getTreeTitle = (title, item) => {
    return <div>
      {title}
      {
        item.id === modelObj.selectedKeys &&
        <div>
          <ButtonGroup style={{ display: 'block' }} size="small" onClick={e => { e.stopPropagation() }}>
            <Button onClick={() => changeModal(true, 'treeVisible')}><i className="iconfont icon-zengjia"></i>增加</Button>
            <Popconfirm Collapse title='确定要删除吗？' okText='确定' cancelText='取消' onConfirm={() => deleteNode(item)}>
              <Button><i className="iconfont icon-shanchu"></i>删除</Button>
            </Popconfirm>
          </ButtonGroup>
          <ButtonGroup style={{ display: 'block' }} size="small" onClick={e => { e.stopPropagation() }}>
            <Button onClick={() => onCopy(item.id, 'copy')}><i className="iconfont icon-zengjia"></i>复制属性组</Button>
            <Button onClick={() => onCopy(item.id, 'paste')}><i className="iconfont icon-zengjia"></i>粘贴属性组</Button>
          </ButtonGroup>
        </div>
      }
    </div>
  }

  const loop = data => data.map((item) => {
    const index = item.name.indexOf(modelObj.searchValue);
    const beforeStr = item.name.substr(0, index);
    const afterStr = item.name.substr(index + modelObj.searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{modelObj.searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.name}</span>;
    if (item.children && item.children.length > 0) {
      return (
        <TreeNode key={item.id} title={getTreeTitle(title, item)}>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id} title={getTreeTitle(title, item)} />;
  });

  const onExpand = (expandedKeys) => {
    dispatch({
      type: `${namespace}/onExpand`,
      payload: {
        expandedKeys,
        autoExpandParent: false,
      }
    });
  }

  const onSelect = (selectedKeys) => {
    dispatch({
      type: `${namespace}/getSelectDetail`,
      payload: {
        selectedKeys: selectedKeys[0],
      }
    });
  }
  {/*==================================树处理函数结束===============================================*/ }

  const onCopy = (id, type) => {
    dispatch({
      type: `${namespace}/onCopy`,
      payload: {
        id, type
      }
    })
  }

  const addNode = () => {
    dispatch({
      type: `${namespace}/addNode`,
      payload: {
      }
    })
  }

  const updateNode = () => {
    dispatch({
      type: `${namespace}/updateNode`,
      payload: {
      }
    })
  }

  const deleteNode = (item) => {
    if (item.children.length === 0) {
      dispatch({
        type: `${namespace}/deleteNode`,
        payload: {
          id: item.id
        }
      })
    } else {
      return message.error('请先删除下级目录！')
    }
  }

  const sortNode = (type) => {
    dispatch({
      type: `${namespace}/sortNode`,
      payload: {
        type
      }
    })
  }

  const changeModal = (visible, type, root, propGroupId, addPropGroup) => {
    //root为添加目录使用，propGroupId为编辑属性组使用,addPropGroup为新增属性组时用于判断清空数据
    dispatch({
      type: `${namespace}/changeModal`,
      payload: {
        visible, type, root, propGroupId, addPropGroup
      }
    })
    form.resetFields();
  }

  const deletePropGrop = (id) => {
    dispatch({
      type: `${namespace}/deletePropGrop`,
      payload: {
        id
      }
    })
  }

  const columns = [
    { title: '属性组名称', dataIndex: 'name', key: 'name' },
    { title: '属性名称', dataIndex: 'props', key: 'props' },
    {
      title: '操作', width: 80,
      render: (item) => {
        return <div>
          <Link onClick={() => changeModal(true, 'propGroupVisible', '', item.id)}>编辑</Link>
          <span className="ant-divider"></span>
          <Popconfirm Collapse title='确定要删除吗？' okText='确定' cancelText='取消' onConfirm={() => deletePropGrop(item.id)}>
            <Link>删除</Link>
          </Popconfirm>
        </div>
      }
    },
  ];

  const propGroupColumns = [
    { title: '属性名称', dataIndex: 'name', key: 'name' },
    { title: '属性描述', dataIndex: 'statement', key: 'statement' },
    {
      title: '设为销售属性', dataIndex: 'salesType',
      render: (text, record, index) => {
        if (record.showType === 5) {
          return "不可设置"
        } else {
          return <Switch checked={text} onChange={checked => updateProp(checked, 'salesType', index)} checkedChildren={'开'} unCheckedChildren={'关'} />
        }
      },
    },
    {
      title: '设为筛选条件', dataIndex: 'screenType',
      render: (text, record, index) => {
        if (record.showType === 4) {
          return <Switch checked={text} onChange={checked => updateProp(checked, 'screenType', index)} checkedChildren={'开'} unCheckedChildren={'关'} />
        } else {
          return "不可设置"
        }
      },
    },
    {
      title: '筛选条件优先级', dataIndex: 'screenPriority',
      render: (text, record, index) => {
        if (record.showType === 4) {
          return <InputNumber min={1} max={999} disabled={!record.screenType} onChange={value => updateProp(value, 'screenPriority', index)} value={text} />
        } else {
          return "不可设置"
        }
      },
    },
    {
      title: '操作',
      render: (text, record, index) => {
        return <Link onClick={() => deleteProp(index)}>删除</Link>
      },
    },
  ]

  const updateProp = (value, type, index) => {
    dispatch({
      type: `${namespace}/updateProp`,
      payload: {
        value, type, index
      }
    })
  }

  const deleteProp = (index) => {
    dispatch({
      type: `${namespace}/deleteProp`,
      payload: {
        index
      }
    })
  }

  let pageProps = {
    // ---------- 界面部分 ----------
    "ui": {
      // 页面接口地址
      "api_url": "caf/mgmt/items/prop/list-by-page",
      // 接口方式
      "method": "GET",
      // 接口参数
      "params": "pageNum=1&pageSize=10&catalogId=" + modelObj.selectedKeys,
      // 模拟数据 - 用于开发需要，若填充了上面的api_url之后，请将此项设置为null
      // "mockData": mockData,
      // 查询栏
      "search_bar": {
        "fields": [
          {
            "en_name": "name",
            "zh_name": "属性名称",
            "elem_type": "Input",
            "elem_valid_type": "string"
          },
          {
            "en_name": "showType",
            "zh_name": "显示类型",
            "elem_type": "Select",
            "elem_valid_type": "string",
            "cmpt_items": [
              { "label": "下拉", "value": "4" },
              { "label": "文本", "value": "5" },
              { "label": "颜色", "value": "6" }
            ],
          }
        ],
      },
      // 页面右上角操作栏
      "action_bar": [
      ],

      // 数据表格
      "table": {
        // 表头字段列表
        "fields": [
          {
            "en_name": "name",
            "zh_name": "属性名称 ",
          },
          {
            "en_name": "statement",
            "zh_name": "属性描述",
          },
          {
            "en_name": "showType",
            "zh_name": "显示类型",
            "render": (d, item, index) => {
              return <span> {['', '', '', '', '下拉', '文本', '颜色'][item.showType]}</span>
            },
          },
        ],

        // 表格操作
        // 操作栏设置
        "action_props": {
          "width": 70,
        },
        // 整个表格的宽度, 设置该属性后表格可左右滚动
        // "scroll": { x: 1665 },
        "actions": [
          {
            "func_name": "operat",
            "label": "添加",
            "render": (item) => {
              let flag = false
              modelObj.propGroup.map((obj, idx) => {
                if (obj.id === item.id) {
                  flag = true
                }
              })
              return <Link onClick={() => addProp(item)} disabled={flag}>添加</Link>
            },
          }
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

  const addProp = (item) => {
    dispatch({
      type: `${namespace}/addProp`,
      payload: {
        item
      }
    })
  }

  const savePropGroup = () => {
    dispatch({
      type: `${namespace}/savePropGroup`,
      payload: {
      }
    })
  }

  return (
    <div className="public_listMain">
      <Modal
        title="添加目录"
        visible={modelObj.treeVisible}
        onOk={() => addNode()}
        onCancel={() => changeModal(false, 'treeVisible')}
        confirmLoading={modelObj.addNodeLoading}
      >
        <Row>
          <Col span={2} style={{ width: 72, marginRight: 8 }}>
            <div className="ant-form-item-label">
              <label className="ant-form-item-required">类目名称</label>
            </div>
          </Col>
          <Col span={20}>
            <Input placeholder="请输入类目名称" maxLength='20' value={modelObj.nodeName} onChange={(e) => updateModel(e.target.value, 'nodeName')} />
          </Col>
        </Row>
      </Modal>
      <Modal
        title="属性组"
        width={800}
        visible={modelObj.propGroupVisible}
        onOk={() => savePropGroup()}
        onCancel={() => changeModal(false, 'propGroupVisible')}
        confirmLoading={modelObj.addPropLoading}
      >
        <Input addonBefore="属性组名称" maxLength='40' style={{ width: 300, marginLeft: 235 }} value={modelObj.propGroupName} onChange={(e) => updateModel(e.target.value, 'propGroupName')} />
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => changeModal(true, 'propVisible')}>添加属性</Button>
        </div>
        <Table columns={propGroupColumns} dataSource={modelObj.propGroup} pagination={false} />
      </Modal>
      <Modal
        title="添加属性到属性组"
        width={1000}
        visible={modelObj.propVisible}
        footer={
          <Button onClick={() => changeModal(false, 'propVisible')}>返回</Button>
        }
        onCancel={() => changeModal(false, 'propVisible')}
      >
        <ListPage pageProps={pageProps} />
      </Modal>
      <div className="boxShadow">
        <div style={{ border: '1px solid #EFEFF1', overflow: 'hidden' }}>
          {/*左右布局，左边树*/}
          <div style={{ width: 359, float: 'left', borderRight: '1px solid #EFEFF1' }}>
            <Search style={{ padding: '16px 0 16px 16px', width: 343 }} placeholder="搜索分类" onSearch={value => getSearch(value)} />
            <div className={styles.treeActionButton}>
              <Button onClick={() => changeModal(true, 'treeVisible', root)}>添加根目录</Button>
              <Button onClick={() => sortNode(1)} disabled={!!modelObj.selectedKeys ? false : true}>上移<i className="iconfont icon-shu-shangyi"></i></Button>
              <Button onClick={() => sortNode(2)} disabled={!!modelObj.selectedKeys ? false : true}>下移<i className="iconfont icon-shu-xiayi"></i></Button>
              <Button onClick={() => sortNode(0)} disabled={!!modelObj.selectedKeys ? false : true}>置顶<i className="iconfont icon-shu-zhiding"></i></Button>
              <Button onClick={() => sortNode(3)} disabled={!!modelObj.selectedKeys ? false : true}>置底<i className="iconfont icon-shu-zhidi"></i></Button>
              <p><i className="iconfont icon-ic_info_px"></i>最多可配置5个根目录，根目录下最多配置4个子分类。配置后展示在官方商城首页底部的文章链接位置。</p>
            </div>
            <div style={{ backgroundColor: '#FBFBFB', paddingLeft: 8, height: 600, overflow: 'auto' }}>
              <Tree
                showLine
                onExpand={onExpand}
                expandedKeys={modelObj.expandedKeys}
                autoExpandParent={modelObj.autoExpandParent}
                onSelect={onSelect}
              >
                {loop(modelObj.catalogTree)}
              </Tree>
            </div>
          </div>

          {/*左右布局，右边详情*/}
          <div style={{ padding: '16px 16px 16px 375px' }}>
            {
              !!modelObj.selectedKeys &&
              <div>

                <div className={styles.classify}>
                  <h2>类目编辑</h2>
                </div>

                <div style={{ marginTop: 8 }}>
                  <div className="ant-form-item-label" style={{ width: 110 }}>
                    <label className="ant-form-item-required">类目名称</label>
                  </div>
                  <Input placeholder="请输入类目名称" style={{ width: 300 }} maxLength='20' value={modelObj.title} onChange={e => updateModel(e.target.value, 'title')} />
                </div>

                <div style={{ marginTop: 8 }}>
                  <div className="ant-form-item-label" style={{ width: 110 }}>
                    <label>描述</label>
                  </div>
                  <Input placeholder="请输入描述" style={{ width: 300 }} maxLength='20' value={modelObj.statement} onChange={e => updateModel(e.target.value, 'statement')} />
                </div>

                <div style={{ marginTop: 8 }}>
                  <div className="ant-form-item-label" style={{ width: 110 }}>
                    <label>图片</label>
                  </div>
                  <div style={{ marginLeft: 120, marginTop: '-20px', position: 'relative' }}>
                    <Uploader
                      uploadSuccessCbf={imgUrl => updateModel(imgUrl, 'imgUrl')}
                      removeFileCbf={() => updateModel('', 'imgUrl')}
                      showType='2'
                      fileMaxSize={2}
                      fileType='image'
                      uploadedUrls={[modelObj.imgUrl]}
                      // imgUrlSize="? ,m_pad,h_165,w_375,color_FFFFFF"
                      uploadTip={() => {
                        return <p>支持扩展名：.png .jpg .gif<br />建议尺寸: 400x250像素</p>
                      }}
                    />
                    <p className={styles.introduce} >图片建议尺寸：500x250px</p>
                    <p className={styles.introduce} >建议大小：50kb</p>
                    <p className={styles.introduce} >图片格式：jpg,png</p>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div className="ant-form-item-label" style={{ width: 110 }}>
                    <label className="ant-form-item-required">特惠车订金额度</label>
                  </div>
                  <InputNumber
                    placeholder="请输入特惠车订金额度"
                    style={{ width: 300 }}
                    min={0.01}
                    max={99999999}
                    precision={2}
                    value={modelObj.earnest}
                    onChange={value => updateModel(value, 'earnest')}
                  />
                </div>

                <div style={{ marginTop: 8 }}>
                  <div className="ant-form-item-label" style={{ width: 110 }}>
                    <label className="ant-form-item-required">状态</label>
                  </div>
                  <RadioGroup value={modelObj.status} onChange={e => updateModel(e.target.value, 'status')}>
                    <Radio value={1}>启用</Radio>
                    <Radio value={0}>禁用</Radio>
                  </RadioGroup>
                  <div style={{ textAlign: 'center' }}>
                    <Button type="primary" onClick={() => updateNode()} loading={modelObj.saveNodeLoading}>保存</Button>
                  </div>
                </div>

                <div className={styles.classify}>
                  <h2>挂载属性组</h2>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={() => changeModal(true, 'propGroupVisible', '', '', true)}>新增</Button>
                </div>

                <Table columns={columns} dataSource={modelObj.propGroupList} pagination={false} />

              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// 连接视图(view)和模型(model)
export default connect(mapStateToProps)(Form.create()(routeView))
