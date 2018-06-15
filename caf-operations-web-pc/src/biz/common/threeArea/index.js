/**
 * Created by yang.fan on 2017/12/29.
 */
import React from 'react';
import styles  from './threeArea.less';
import {Select, Row, Col} from 'antd';
const Option = Select.Option;
import { request } from '../../../config/request'
import area from '../../../utils/area'
import {cloneDeep} from 'lodash'
const { Component } = React


/*
* 三级联动的地址控件
* 扬帆
* *
* */

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      //需要父级传递的参数
      propsParameter: {
        ifArea: this.props.ifArea || false,//判断区是否为多选
        url: this.props.url || 'sys/area/list',//获取地区的地址,common/area/list，area/pulldown/list
        selArea: this.props.selArea || {pCode:'',cCode:'',aCode:''},//选中的地区id
        selAreaText:{pName:'',cName:'',aName:''},//选中的地区text
        changeArea: ()=>{
          //选中的地区回调
          this.props.changeArea(this.state.propsParameter.selArea,this.state.propsParameter.selAreaText);
        },
      },
      //请求的参数
      parameter: {},

      //获取的地区列表
      areaList: area.data || [],

      //市列表
      cList: [],

      //区列表
      aList: [],
    }

  }


  //获取数据
  dataList() {
    let THIS = this;
    request({
      url: this.state.propsParameter.url,
      method: 'GET',
      data: this.state.parameter
    }).then((data)=> {
      THIS.setState({
        areaList: data.data.list || []
      });

    }, function (error) {
      console.log(error);
    });
  }

  //选择省
  pChange(ifOnClick, value){
    let THIS = this;
    let codes = cloneDeep(this.state.propsParameter.selArea);
    //赋值
    this.state.propsParameter.selArea.pCode = value;

    //当点击地址控件时才清空原有的市、区列表
    if(ifOnClick){
      this.state.cList = [];
      this.state.aList = [];
      this.state.propsParameter.selArea.cCode = '';
      this.state.propsParameter.selArea.aCode = '';
    }

    //赛选市的列表
    let list = this.state.areaList;
    list && list.map((obj, i)=>{
      if('' + value === '' + obj.value){
        THIS.state.cList = obj.children || [];

        //获取省的名字
        THIS.state.propsParameter.selAreaText.pName = obj.label;
      }
    });

    //更新状态
    this.setState({},()=>{
      THIS.state.propsParameter.changeArea();

      if('' !== codes.cCode && !ifOnClick){
        THIS.cChange(false, codes.cCode);
      }
    });
  }

  //选择市
  cChange(ifOnClick, value){
    let THIS = this;
    // console.log('市: ', value);
    let codes = cloneDeep(this.state.propsParameter.selArea);
    //赋值
    this.state.propsParameter.selArea.cCode = value;

    //赛选区的列表
    let list = this.state.cList;
    list && list.map((obj, i)=>{
      if('' + value === '' + obj.value){
        THIS.state.aList = obj.children || [];

        //获取市的名字
        THIS.state.propsParameter.selAreaText.cName = obj.label;
      }
    });

    //判断区是多选还是单选
    if(this.state.propsParameter.ifArea){
      //多选
      this.state.propsParameter.selArea.aCode = [];

    }else{
      //单选
      this.state.propsParameter.selArea.aCode = '';

    }

    //更新状态
    this.setState({},()=>{
      THIS.state.propsParameter.changeArea();

      if('' !== codes.aCode && !ifOnClick){
        THIS.aChange(false, codes.aCode);
      }
    });
  }

  //选择区
  aChange(ifOnClick, value){
    let THIS = this;
    //赋值
    this.state.propsParameter.selArea.aCode = value;

    //赛选区的名称
    let list = this.state.aList;
    let nameList = null;
    //判断区是多选还是单选
    if(THIS.state.propsParameter.ifArea){
      nameList = [];
      for(let j=0; j<value.length; j++){
        list && list.map((obj, i)=>{
          if('' + value[j] === '' + obj.value){
            //获取市的名字
            nameList.push(obj.label);
          }
        });
      }

    }else{
      nameList = '';
      list && list.map((obj, i)=>{
        if('' + value === '' + obj.value){
          nameList = obj.label;
        }
      });

    }
    //获取市的名字
    THIS.state.propsParameter.selAreaText.aName = nameList;

    //更新状态
    this.setState({},()=>{
      THIS.state.propsParameter.changeArea();
    });
  }

  render() {
    let THIS = this;
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            {/*省*/}
            <Select
              showSearch
              placeholder="请选择省份"
              optionFilterProp="children"
              onChange={this.pChange.bind(THIS, true)}
              value={this.state.propsParameter.selArea.pCode + ''}
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
            >
              <Option value={''}>请选择省份</Option>
              {
                this.state.areaList && this.state.areaList.map((obj, i)=>{
                  return <Option key={'areaList_' + obj.value} value={obj.value + ''}>{obj.label}</Option>
                })
              }
            </Select>
          </Col>

          <Col span={8}>
            {/*市*/}
            {
              this.state.cList.length > 0 && (
                <Select
                  showSearch
                  placeholder="请选择市级"
                  optionFilterProp="children"
                  onChange={this.cChange.bind(THIS, true)}
                  value={this.state.propsParameter.selArea.cCode + ''}
                  filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }}
                >
                  <Option value={''}>请选择市</Option>
                  {
                    this.state.cList && this.state.cList.map((obj, i)=>{
                      return <Option key={'cList_' + obj.value} value={obj.value + ''}>{obj.label}</Option>
                    })
                  }
                </Select>
              )
            }
          </Col>

          <Col span={8}>
            {/*区*/}
            {
              this.state.aList.length > 0 && (
                <Select
                  showSearch
                  multiple= {this.state.propsParameter.ifArea}
                  placeholder= "请选择区级"
                  value= {this.state.propsParameter.selArea.aCode}
                  onChange= {this.aChange.bind(THIS, true)}
                  filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }}
                >
                  {
                    this.state.aList && this.state.aList.map((obj, i)=>{
                      return <Option key={'aList_' + obj.value} value={obj.value + ''}>{obj.label}</Option>
                    })
                  }
                </Select>
              )
            }
          </Col>
        </Row>
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
    // console.log('nextProps: ',nextProps);
    this.state.propsParameter.selArea = nextProps.selArea;
    this.setState({},()=>{
      if('' !== nextProps.selArea.pCode){
        this.pChange(false, nextProps.selArea.pCode);

      }
    });

  }

  // 插入真实 DOM
  componentDidMount() {
    let THIS = this;
    let codes = this.state.propsParameter.selArea;

    //获取地址列表
    THIS.dataList();

    if('' !== codes.pCode){
      THIS.pChange(false, codes.pCode);

    }
  }

}
