import React from 'react';
const { Component } = React
import cx from 'classnames'
import { Icon, Popconfirm, Table, Input, Select } from 'antd';
import { Link } from "dva/router";
const Option = Select.Option
import styles from "./index.less";
import config from "Config/config";
import { cloneDeep, get, isArray, pick } from "lodash";
import EditableCell from "./editableCell";

import { getSalesProp } from "../editModelServ";

/**
 * 动态表头 可编辑表格 组件
 * @author 阿九
 * @since 0.1.0
 *
 * @prop {[array]} dataSource  已有的skus数据
 * @prop {[boolean]} editable  为true时可编辑, 为false时不可编辑
 * @prop {[string / int]} catalog 用户选择的类目ID
 *
 * @prop {[function]} dataCbk 将数据传回给父组件
 */

class EditedTable extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      catalogId: '',
      salesProp: [],
      // 表格的标题配置
      columns: [],
      // 表格行数据模板
      rowTemplate: {},
      // 表格数据
      tableData: [],
      // 外部skus数据只在第一次传入后初始化到state中
      initFlag: true,
    }
  }


  // 插入真实 DOM
  componentDidMount() {
    // 表格初始化
    let columns = this.getTableColumns()
    let rowTemplate = this.getTableTemplate()
    this.setState({columns, rowTemplate}, () => {
      // 初始化一行数据, 传入true标识初始化
      this.addRow(true)
    })
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
    let oldId = this.state.catalogId
    let newId = nextProps.catalogId
    if (oldId !== newId) {
      // 如果catalogId变化, 则调用接口获取销售属性
      this.setState({catalogId: newId}, () => {
        if (nextProps.dataSource.length === 0) {
          this.salesProp(newId)
        } else {
          // 已有skus数据, 将其传入salesProp函数中
          this.salesProp(newId, cloneDeep(nextProps.dataSource))
        }
      })
    }
  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {
  }

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {

  }

  // 获取销售属性
  async salesProp(catalogId, exitData = null) {
    if (catalogId === '') {
      return false
    }
    let { data, resultCode, resultMsg } = await getSalesProp({id: catalogId})
    if (resultCode + '' === '0') {
      let curColumns = this.getTableColumns(data)
      let rowTemplate = this.getTableTemplate(data)
      let newTableData = []
      if (this.state.initFlag && !!exitData) {
        // initFlag为true, 且exitData存在, 对外部传入数据进行初始化
        newTableData = this.dataTranslate(exitData, rowTemplate, data)
      } else {
        // 新增时, 无skus数据
        newTableData = this.mergeSalesProps(rowTemplate)
        this.dataAssemble(newTableData)
      }
      this.setState({
        salesProp: data,
        columns: curColumns,
        rowTemplate,
        tableData: newTableData,
        initFlag: false
      })
    }
  }

  // 根据销售属性生成表头
  getTableColumns(salesProp) {
    // 初始表格第一列
    let listColumns = [
      {
        key: 'code',
        dataIndex: 'code',
        title: '规格编号',
      },
      {
        key: 'guidePrice',
        dataIndex: 'guidePrice',
        title: '指导价',
        width: 120,
        render: (text, record, index) => {
          return <div>
            <EditableCell
              innerClass={styles.test}
              type='inputNumber'
              value={text}
              dataCbk={e => this.onCellChange(e, 'guidePrice', index)}
              extendProps={{
                min: 1,
                max: 9999999999,
                precision: 2,
                formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
            />
          </div>
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 100,
        render: (text, record, index) => {
          let addFlag = this.state.tableData.length - 1 === index
          let deleteFlag = this.state.tableData.length > 1
          return <div>
            {
              deleteFlag && <Popconfirm
                title='确定要删除吗?'
                okText='确定'
                cancelText='取消'
                onConfirm={() => this.deleteRow(index)}
              >
                <Link>删除</Link>
              </Popconfirm>
            }
            {
              (deleteFlag && addFlag) && <span className="ant-divider"></span>
            }
            {
              addFlag && <Link onClick={(e) => this.addRow()} >添加</Link>
            }
          </div>
        }
      }
    ]
    let dynamicColumns = []
    // 根据销售属性动态生成
    if (isArray(salesProp)) {
      dynamicColumns = salesProp.map((prop, propIndex) => {
        return {
          key: prop.propId + '',
          dataIndex: prop.propId + '',
          title: prop.propName,
          width: 120,
          render: (text, record, index) => {
            if (this.props.editable) {
              return <div>
                <EditableCell
                  type='select'
                  value={text.valueId}
                  optionsSetting={{
                    options: prop.props,
                    labelName: 'valueName',
                    valueName: 'valueId'
                  }}
                  dataCbk={(v, n) => this.onCellChange([v, n.props.children], ['valueId', 'valueName'], index, text.propId)}
                />
              </div>
            } else {
              return <div>{text.valueName}</div>
            }
          }
        }
      })
    }

    listColumns.splice(1, 0, ...dynamicColumns)
    return listColumns
  }

  // 根据销售属性生成列表模板
  getTableTemplate(salesProp) {
    let rowTemplate = {
      code: '',
      guidePrice: '',
      skuId: ''
    }
    if (isArray(salesProp)) {
      salesProp.map(prop => {
        rowTemplate[prop.propId] = {
          groupId: prop.groupId,
          groupName: prop.groupName,
          propId: prop.propId,
          propName: prop.propName,
          valueId: '',
          valueName: '',
        }
      })
    }
    return rowTemplate
  }

  // 新增时, 改变销售属性, 重置表格中所有数据
  mergeSalesProps(rowTemplate) {
    let { tableData } = this.state
    let newTableData = tableData.map(row => {
      let tmpRow = cloneDeep(pick(row, ['key', 'code', 'guidePrice', 'skuId']))
      return Object.assign({}, cloneDeep(rowTemplate), tmpRow)
    })
    return newTableData
  }

  // skus数据存在时, 根据销售属性重新构造表格数据
  dataTranslate(tableData, rowTemplate, salesProp) {
    let copyData = cloneDeep(tableData)
    let copyRow = cloneDeep(rowTemplate)
    let copyProp = cloneDeep(salesProp)

    let propKeys = copyProp.map(prop => prop.propId)
    let newTableData = copyData.map(record => {
      // 将原有数据的skuId, code, guidePrice取出来, 作为新的对象
      let newRow = pick(record, ['skuId', 'code', 'guidePrice'])
      newRow.key = newRow.code
      let specifications = record.specifications
      // 遍历销售属性
      propKeys.map(key => {
        // 如果原有数据内有这个销售属性
        let flag = true
        for (let i = 0; i < specifications.length; i++) {
          const item = specifications[i];
          if (item.propId === key) {
            newRow[key] = cloneDeep(item)
            flag = false
            break;
          }
        }
        // flag 为true 说明原有数据中无该销售属性
        if (flag) {
          newRow[key] = cloneDeep(copyRow[key])
        }
      })

      return newRow
    })

    return newTableData
  }

  // 生成code编号
  generateCode(maxCode) {
    // maxCode是当前最大code [string]
    let newCode = Number(maxCode) + 1 + ''
    let num = 3 - newCode.length
    let seize = ''
    for (let i = 0; i < num; i++) {
      seize += '0'
    }
    return seize + newCode
  }

  // 新增一行, 表格中添加一行模板行
  addRow(initFlag) {
    let { tableData, rowTemplate } = this.state
    let maxCode = ''
    if (tableData.length > 0) {
      maxCode = tableData[tableData.length - 1].code
    }
    let newCode = this.generateCode(maxCode)
    let newRow = Object.assign({}, rowTemplate, {key: newCode, code: newCode})
    tableData.push(cloneDeep(newRow))
    this.dataAssemble(tableData, initFlag)
    this.setState({tableData})
  }

  // 删除一行
  deleteRow(index) {
    let { tableData } = this.state
    let copyData = cloneDeep(tableData)
    copyData.splice(index, 1)
    this.dataAssemble(copyData)
    this.setState({tableData: copyData})
  }

  // 表格内, 数据改变, 需要改变表格的state, 并转换成需要的数据格式 传入父组件
  onCellChange(value, name, index, propId) {
    let tableData = cloneDeep(this.state.tableData)
    if (!!propId) {
      if (isArray(name)) {
        name.map((n, i) => {
          tableData[index][propId][n] = value[i]
        })
      } else {
        tableData[index][propId][name] = value
      }
    } else {
      tableData[index][name] = value
    }
    this.dataAssemble(tableData)
    this.setState({tableData})
  }

  // 把tableData的数据组装成外部需要的格式, 传给父组件
  dataAssemble(data, initFlag = false) {
    let copyData = cloneDeep(data)
    let newData = copyData.map(record => {
      let newRow = pick(record, ['code', 'guidePrice','skuId'])
      let keys = Object.keys(record)
      newRow.specifications = []
      keys.map(key => {
        if (!['code', 'guidePrice', 'key', 'skuId'].includes(key)) {
          newRow.specifications.push(record[key])
        }
      })
      return newRow
    })

    this.props.dataCbk(newData, initFlag)
  }

  render() {
    return <Table
      dataSource={this.state.tableData}
      columns={this.state.columns}
      pagination={false}
      bordered
    />
  }

  componentWillUnmount() {
    console.log('editable table unmount')
  }

}

export default EditedTable
