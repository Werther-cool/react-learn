/**
 * Created by yang.fan on 2018/01/30.
 */

/*
 *
 * 新增、编辑页面，组件统一封装调用
 *
 * */
/*
* 使用说明
* 1、注释带*表示该字段是必填属性
* */

import React from 'react'
import styles  from './formHtml.less'
import {Form, Input, Select, Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
import { request } from '../../../config/request'
import {cloneDeep} from 'lodash'
const { Component } = React

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      /*
      * 共有的参数和方法
      * */
      type: this.props.type || 'Input',//类型
      label: this.props.label || '',//名称
      id: this.props.id || '',//*字段唯一标示
      required: this.props.required || false,//是否必选
      value: (this.props.value || '') + '',//输入框的值
      ifValidator: this.props.ifValidator || false,//是否添加私有校验
      placeholder: this.props.placeholder || '',//输入框提示语
      message: this.props.message || '该内容不能为空',//必填报错提示语
      disabled: this.props.disabled || false,//是否禁用
      onChange: ()=>{
        this.props.onChange(this.state.value, this.state.id);
      },//*修改值的回调，返回value和id
      validator: (rule, value, callback)=>{
        this.props.validator(rule, value, callback)
      },//私有校验的回调

      /*----------------------------组件私有的参数-------------------------------------*/

      /*
      * input组件参数
      * */
      inputPar: {
        type: this.props.inputPar?this.props.inputPar.type:'text' || 'text',//输入框类型
        maxLength: this.props.inputPar?this.props.inputPar.maxLength:'50' || '50',//输入框最大长度
      },

      /*
      * textarea组件参数
      * */
      textareaPar: {
        maxLength: this.props.textareaPar?this.props.textareaPar.maxLength:'500' || '50',//输入框最大长度
        rows: this.props.textareaPar?this.props.textareaPar.rows:'4' || '4',//输入框最大长度
      },

      /*
      * select下拉组件参数
      * */
      selectPar: {
        data: this.props.selectPar?this.props.selectPar.data:[] || [],//列表数据
        valueName: this.props.selectPar?this.props.selectPar.valueName:null || null,//下拉组件的值的名称
        name: this.props.selectPar?this.props.selectPar.name:null || null,//下拉选项的名称
        defaultSelName: this.props.selectPar?this.props.selectPar.defaultSelName:'' || '',//下拉选项的名称
      },

      /*
      * Checkbox组件参数
      * */
      checkboxPar: {
        data: this.props.checkboxPar?this.props.checkboxPar.data:[] || [],//多选列表数据
      },

    }
  }

  //修改输入框值
  changeInput(value){
    let THIS = this;
    this.setState({value}, ()=>{
      THIS.state.onChange();
    })
  }
  //输入框的校验
  inputVal(rule, value, callback){
    /*if (value.trim().length === 0 || value.trim().length > 50) {
      callback(this.state.calText);
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()*/
    this.state.validator(rule, value, callback);
  }

  render() {
    let THIS = this;
    let html = '';
    let { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    let {
      type, label, id, value,
      required, message, ifValidator, placeholder,
      disabled, inputPar, textareaPar, selectPar,
      checkboxPar,
    } = this.state;
    // 表单项布局
    let formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };
    //根据不同类型展示不同html
    switch(type){
      //input组件
      case 'Input':
        html = <FormItem {...formItemLayout}  label={label} hasFeedback>
          {getFieldDecorator(id, {
            initialValue: value,
            rules: [
              {required: required, message: message},
              {
                validator: ifValidator ? this.inputVal.bind(THIS) : '',
              }
            ],
          })
          (<Input
            type={inputPar.type}
            maxLength={inputPar.maxLength}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e)=>{this.changeInput(e.target.value)}}
          />)}
        </FormItem>;
        break;

      //textarea组件，多行文本框
      case 'Textarea':
        html = <div>
          <FormItem className={styles.textAreaCss} {...formItemLayout}  label={label} hasFeedback>
            {getFieldDecorator(id, {
              initialValue: value,
              rules: [
                {required: required, message: message},
                {
                  validator: ifValidator ? this.inputVal.bind(THIS) : '',
                }
              ],
            })
            (<Input
              type="textarea"
              rows={textareaPar.rows}
              maxLength={textareaPar.maxLength}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(e)=>{this.changeInput(e.target.value)}}
            />)}
            <span>{value.length + ' / ' + textareaPar.maxLength}</span>
          </FormItem>
        </div>;
        break;

      //Select组件
      case 'Select':
        html = <FormItem {...formItemLayout}  label={label} hasFeedback>
          {getFieldDecorator(id, {
            // onChange: e => THIS.updateModel(e.target.value, 'deliveryMobile', 'logistics'),
            initialValue: value + '',
            rules: [
              {required: required, message: message},
              {
                validator: ifValidator ? this.inputVal.bind(THIS) : '',
              }
            ],
          })
          (<Select
            placeholder={placeholder}
            disabled={disabled}
            onChange={(value)=>{this.changeInput(value)}}
          >
            <Option value="">{'请选择' + selectPar.defaultSelName}</Option>
            {
              selectPar.data && selectPar.data.map((item, i)=>{
                return <Option
                  key={'sel_' + id + i}
                  value={selectPar.valueName?item[selectPar.valueName] + '' : item.value + ''}
                >
                  {selectPar.name?item[selectPar.name] : item.name}
                </Option>
              })
            }
          </Select>)}
        </FormItem>;
        break;

      //Checkbox组件
      case 'Checkbox':
        html = <FormItem {...formItemLayout} label={label}>
          {getFieldDecorator(id, {
            initialValue: value,
            rules: [
              {type: 'array', required: required, message: message},
            ],
          })
          (<CheckboxGroup options={checkboxPar.data} onChange={(value)=>{this.changeInput(value)}} />)}
        </FormItem>;
        break;
    }

    return (
      <div className={styles.formCss}>
        {html}
      </div>
    )
  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {
  }

  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {
  }

  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {
    // console.log('新属性: ', nextProps);
    //收到新的value时重新加载
    if(nextProps.value){
      this.state.value = nextProps.value;
      this.setState({});
      // this.setState({...nextProps});
    }
    if(nextProps.disabled){
      this.state.disabled = nextProps.disabled;
      this.setState({});
      // this.setState({...nextProps});
    }
  }

  componentDidMount() {
  }

}
