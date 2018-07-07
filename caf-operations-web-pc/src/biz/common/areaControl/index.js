import React from 'react';
import styles  from './areaControl.less';
import {Cascader} from 'antd';
import { request } from '../../../config/request'
import area from '../../../utils/area'

const { Component } = React


/*
* 店铺弹窗
*
* *
* */

export default class extends Component {
  // 构造函数
  constructor(props, context) {
    super(props, context);
    this.state = {
      //需要父级传递的参数
      propsParameter: {
        changeOnSelect: this.props.changeOnSelect || false,//是否可以单级选中
        //是否显示头部,传none，则不显示
        titleDisplay:this.props.titleDisplay || true,
        className: this.props.className || '',//控件自定意义的样式
        disabled: this.props.disabled || false,//是否禁用   默认正常
        url: this.props.url || 'sys/area/list',//获取地区的地址,common/area/list，area/pulldown/list
        title: this.props.title || '地区',//标题
        selArea: this.props.selArea || [],//选中的地区id
        selAreaText:[],//选中的地区text
        isReFetch: this.props.isReFetch || [],//是否重新获取地址
        changeArea: ()=>{
          //选中的地区回调
          this.props.changeArea(this.state.propsParameter.selArea,this.state.propsParameter.selAreaText);
        },
      },
      //请求的参数
      parameter: {},

      //获取的地区列表
      areaList: area.data,
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
      // console.log('data',data)
      THIS.setState({
        areaList: data.data.list
      });

    }, function (error) {
      console.log(error);
    });
  }

  //选中的地区
  changeArea(areaId,text){
    let THIS = this;
    this.state.propsParameter.selArea = areaId;
    // this.state.propsParameter.selAreaText = [text[0].label,text[1].label,text[2].label];
    this.state.propsParameter.selAreaText = text.map(o => o.label).join(', ');
    this.setState({},()=>{
      THIS.state.propsParameter.changeArea();
    });
  }

  render() {
    let THIS = this;
    return (
      <div>
        {THIS.state.propsParameter.titleDisplay != 'none' ? <div className="ant-form-item-label"><label className="ant-form-item-required">{THIS.state.propsParameter.title}</label></div> : null}
        <Cascader
          className = {styles[THIS.state.propsParameter.className]}
          disabled = {THIS.state.propsParameter.disabled}
          placeholder="请选择地区"
          size="large"
          value={THIS.state.propsParameter.selArea}
          options={THIS.state.areaList}
          onChange={this.changeArea.bind(THIS)}
          allowClear={false}
          changeOnSelect={this.state.propsParameter.changeOnSelect}
        />
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
    //是否重新获取数据
    if(nextProps.isReFetch){
      this.dataList();
    }
    this.state.propsParameter.selArea = nextProps.selArea;
    this.setState({});
  }

  // 插入真实 DOM
  componentDidMount() {
    let THIS = this;
    THIS.dataList();
  }

}
