import React, { Component } from 'react';
import { Input, Select, InputNumber, Radio, Checkbox, TreeSelect, Cascader } from 'antd';
import { isArray, get } from "lodash";
import { treeDataInit } from "Utils/util";
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group


/**
 * 可编辑单元格 组件
 * @author 阿九
 * @since 0.1.0
 *
 * @prop {[string]} type.required
 *       单元格类型: ['select', 'input', 'inputNumber', 'radio', 'checkbox', 'treeSelect', 'cascader']
 * @prop {[string / int]} value.required 单元格的值
 * @prop {[object]} optionsSetting: { 需要列出选项的单元格的选项配置
 *                    options: {[array]},         选项数组
 *                    labelName: {[string]},      选项标签显示字段 default: 'label'
 *                    valueName: {[string]}       选项取值字段 default: 'value'
 *                    childrenName: {[string]}    选项children取值字段 default: 'children'
 *                  }
 * @prop {[object]} extendProps 其他自定义扩展属性
 * @prop {[string]} innerClass 样式类名
 *
 * @prop {[function]} dataCbk.required 将数据传回给父组件
 */

 class EditableCell extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  // 渲染类型映射
  cellTypeMapper(type) {
    let self = this
    let typeMapper = {
      'select': self.renderSelect.bind(self),
      'input': self.renderInput.bind(self),
      'inputNumber': self.renderInputNumber.bind(self),
      'radio': self.renderRadio.bind(self),
      'checkbox': self.renderCheckbox.bind(self),
      'treeSelect': self.renderTreeSelect.bind(self),
      'cascader': self.renderCascader.bind(self)
    }
    return typeMapper[type]
  }

  // 获取自定义扩展属性
  getExtendProps() {
    let {extendProps} = this.props
    if (!!extendProps) {
      return extendProps
    } else {
      return {}
    }
  }

  // 普通选项数据转换
  optionsTransfer() {
    try {
      let {optionsSetting} = this.props
      let {options, labelName = 'label', valueName = 'value'} = optionsSetting
      let tmpArr = []
      if (isArray(options)) {
        tmpArr = options.map(option => {
          return {
            label: option[labelName],
            value: option[valueName]
          }
        })
      }
      return tmpArr
    } catch (e) {
      console.log('[Component] <EditableCell> 参数 optionsSetting 错误 in optionsTransfer: ', e)
    }
  }

  // 树状选项数据转换
  treeDataTranfer() {
    try {
      let {optionsSetting} = this.props
      let {options, labelName = 'label', valueName = 'value', childrenName = 'children'} = optionsSetting
      let treeData = treeDataInit(options, labelName, valueName, childrenName)
      return treeData
    } catch (e) {
      console.log('[Component] <EditableCell> 参数 optionsSetting 错误 in treeDataTranfer: ', e)
    }
  }

  // 生成选项
  getOptions() {
    let options = this.optionsTransfer()
    return options.map((option, index) => <Option
      key={'op_' + index}
      value={option.value + ''}
    >
      { option.label }
    </Option>
   )
  }

  // 渲染单选
  renderSelect() {
    return <div className={this.props.innerClass}>
      <Select
        value={this.props.value + ''}
        onSelect={(e, n, l) => this.props.dataCbk(e, n, l)}
        {...this.getExtendProps()}
      >
        <Option value=''>请选择</Option>
        {
          this.getOptions()
        }
      </Select>
    </div>
  }

  // 渲染输入框
  renderInput() {
    return <div className={this.props.innerClass}>
      <Input
        placeholder='请输入'
        value={this.props.value}
        onChange={e => this.props.dataCbk(e.target.value)}
        {...this.getExtendProps()}
      />
    </div>
  }

  // 渲染数字输入框
  renderInputNumber() {
    return <div className={this.props.innerClass}>
      <InputNumber
        placeholder='请输入'
        value={this.props.value}
        onChange={e => this.props.dataCbk(e)}
        {...this.getExtendProps()}
      />
    </div>
  }

  // 渲染单选框
  renderRadio() {
    return <div className={this.props.innerClass}>
      <RadioGroup
        options={this.optionsTransfer()}
        value={this.props.value}
        onChange={e => this.props.dataCbk(e.target.value)}
        {...this.getExtendProps()}
      />
    </div>
  }

  // 渲染多选框
  renderCheckbox() {
    return <div className={this.props.innerClass}>
      <CheckboxGroup
        options={this.optionsTransfer()}
        value={this.props.value}
        onChange={e => this.props.dataCbk(e)}
      />
    </div>
  }

  // 渲染树形选择框
  renderTreeSelect() {
    return <div className={this.props.innerClass}>
      <TreeSelect
        placeholder="请选择"
        treeData={this.treeDataTranfer()}
        treeDefaultExpandAll
        value={this.props.value}
        // onChange={e => this.props.dataCbk(e)}
        onSelect={(v, n, e) => this.props.dataCbk(v)}
      />
    </div>
  }

  renderCascader() {
    try {
      return <div className={this.props.innerClass}>
        <Cascader
          placeholder="请选择"
          options={this.treeDataTranfer()}
          placeholder='请输入'
          value={this.props.value}
          changeOnSelect={true}
          onChange={e => this.props.dataCbk(e)}
        />
      </div>
    } catch (e) {
      console.log('[Component] <EditableCell> 参数 value 错误 in renderCascader: ', e)
    }
  }

  render() {
    let dom = this.cellTypeMapper(this.props.type)()
    return dom
  }

 }

 export default EditableCell
