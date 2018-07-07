import React from 'react'
import styles  from './boxPopup.less'
import { Modal, Button , Row , Col ,Input ,Table ,Icon,Select} from 'antd';
import { request } from '../../../config/request'
import { message } from 'antd'
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
        width: this.props.width || '1090px',//弹窗宽度
        btnName: this.props.btnName || '添加',//操作栏名称
        radioOrCheckbox: this.props.radioOrCheckbox || false,//单选或者多选
        title:this.props.title || "经营品牌",//提示文字，
        seaTitle:this.props.seaTitle || null,//搜索框的提示文字
        dataName:this.props.dataName || null,// 判断如果data多层就要传dataName
        url:this.props.url || '/yundt/mgmt/item/brand/list-by-page',//请求的接口地址
        onItem: this.props.onItem || [],//选中的项
        visible: this.props.visible || false,//是否打开
        orShopDE: this.props.orShopDE || false,//不同店铺相同商品的删除和添加
        id: this.props.id || 'id',//id的字段名
        name: this.props.name || 'name',//发送的参数中的name查询字段
        length: this.props.length || '', //限定添加的数量
        showName: this.props.showName || 'name', //已选择显示的名称
        isSearch: this.props.isSearch || false, //查询字段是否为必填字段
        isMethod: this.props.isMethod || 'GET', //查询方式
        errorMessage: this.props.errorMessage || '', //报错提示语
        key:this.props.key ||'',
        MultipleSearch:this.props.MultipleSearch || [],
        cbk:()=>{
          //确认按钮回调，返回所有选中的项
          this.props.cbk(this.state.propsParameter.onItem);
        },
        //删除选项时的回调,返回当前项
        closeCbk:()=>{

          this.props.closeCbk();
        },
        //页头
        columns: this.props.columns || [
          {title: '商品ID', dataIndex: 'id', key: 'id'},
          {title: '商品名称', dataIndex: 'name', key: 'name'},
          {title: '商品图片', render: (item)=> {
              return <img alt="" style={{width:"50px"}} src={item.icon+'?x-oss-process=image/resize,w_100'} />
            }
          },
          {title: '店铺名称', dataIndex: 'code', key: 'code'},
          {title: '状态', dataIndex: 'statusName', key: 'statusName'}
        ]
      },
      //parameter:{{xx:xx}}可添加请求参数
      parameter: {
        //请求数据所需值
        pageNum: 1,//当前页
        pageSize: 10,
        total: '',
      },
      list: []
    }

    this.pagination = {
      current: this.state.parameter.pageNum,
      total: this.state.parameter.total,
      onChange: (page)=> {
        this.state.parameter.pageNum = page;
        this.dataList();
      }
    };
  }


  //获取数据
  dataList(type) {


    if(this.state.propsParameter.visible){
      // this.state.propsParameter.onItem = [];
      //当查询项为必填项时，做判断
      if(type && (this.state.parameter[this.state.propsParameter.name] == null || this.state.parameter[this.state.propsParameter.name] == undefined) && this.state.propsParameter.isSearch){
        message.error('请输入查询项');
        let list = [];
        this.setState({
          list
        });
        return false;

      }
      let THIS = this;

      if (type === 'search'){
        this.state.parameter.pageNum = 1
      }

      try{
        request({
          url: this.state.propsParameter.url,
          method: this.state.propsParameter.isMethod,
          data: this.state.parameter
        }).then((data)=> {
          if(data.data){
            let dataName = this.state.propsParameter.dataName ? data.data[this.state.propsParameter.dataName] : data.data;
            dataName.forEach((x,idx) => {
              //给table添加唯一标识
              x['key'] = idx;
            });
            THIS.pagination.total = data.data.total;
            THIS.pagination.current = data.data.pageNum;
            THIS.setState({
              list: dataName
            });
          }else{

            return false;
          }
        }, function (error) {
          console.log(error);
        });

      }catch(e){
        message.error(e || '未知的网络异常');
      }



    }
  }

  //添加项
  addItem(item) {
    //单、多选
    let r = this.state.propsParameter.radioOrCheckbox;
    let dataLength = this.state.propsParameter.length;
    //首先判断单、多选
    if(r){
      //单选情况
      this.state.propsParameter.onItem = [item];
      this.setState({});

      //多选情况
    }else{
      //限定添加的数量
      if(dataLength != ''){
        if(this.state.propsParameter.onItem.length == dataLength){
          if('' !== this.state.propsParameter.errorMessage){
            message.error(this.state.propsParameter.errorMessage);
          }else{
            message.error(`不能添加超过${dataLength}个`);
          }

        }else{
          //判断所选项不存在于已选
          let t = true;
          this.state.propsParameter.onItem.map((i)=> {
            if(this.state.propsParameter.orShopDE) {
              if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id] && i.shopId == item.shopId) {
                message.error('不能重复添加')
                t = false;
              }
            }else{
              if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id]) {
                message.error('不能重复添加')
                t = false;
              }
            }
          });
          if (t) {
            this.state.propsParameter.onItem.push(item);
            this.setState({});
            message.success('操作成功');
          }
        }
      }else{
        //判断所选项不存在于已选
        let t = true;
          this.state.propsParameter.onItem.map((i)=> {
            if(this.state.propsParameter.orShopDE) {
              if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id] && i.shopId == item.shopId) {
                message.error('不能重复添加')
                t = false;
              }
            }else{
              if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id]) {
                message.error('不能重复添加')
                t = false;
              }
            }
          });
          if (t) {
            this.state.propsParameter.onItem.push(item);
            this.setState({});
            message.success('操作成功');
        }
      }
    }
  }

  //删除选中项
  deleteItem(item) {
    // this.state.propsParameter.onItem.map((i,index)=> {
    //   if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id]) {
    //     this.state.propsParameter.onItem.splice(index,1)
    //     this.setState({});
    //   }
    // });
    if(this.state.propsParameter.orShopDE){
      this.state.propsParameter.onItem.map((i,index)=> {
        if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id] && i.shopId == item.shopId) {
          this.state.propsParameter.onItem.splice(index,1)
          this.setState({});
        }
      });
    }else{
      this.state.propsParameter.onItem.map((i,index)=> {
        if (i[this.state.propsParameter.id] == item[this.state.propsParameter.id]) {
          this.state.propsParameter.onItem.splice(index,1)
          this.setState({});
        }
      });
    }
  }

  //查询值
  changeText(event) {
    this.state.parameter[this.state.propsParameter.name] = event.target.value;
    this.setState({});
  }

  changeMultipleSearch(event,key) {
    this.state.parameter[key] = event;
    this.setState({});
  }

  closeBox(){
    this.state.propsParameter.closeCbk();
  }

  //表格操作栏
  tableOperation(){
    let THIS = this;
    THIS.dataList();
    THIS.state.propsParameter.columns.map((item,i)=>{
      if(item.title === '操作') THIS.state.propsParameter.columns.splice(i,1);
    });
    THIS.state.propsParameter.columns.push({
      title: '操作',
      render: (item)=> {
        let flag = false
        THIS.state.propsParameter.onItem.map((obj,idx) => {
          if (obj[THIS.state.propsParameter.id] === item[THIS.state.propsParameter.id]){
            flag = true
          }
        })
        if (flag){
          return <a onClick={this.addItem.bind(this,item)} disabled={true} style={{color:'#999'}}>{THIS.props.btnName || '添加'}</a>
        }else {
          return <a onClick={this.addItem.bind(this,item)}>{THIS.props.btnName || '添加'}</a>
        }
      }
    });
    THIS.setState({});
  }

  render() {
    let THIS = this;
    return (
      <div className={styles.boxContent}>
        <Modal
          style={{top:"65px"}}
          title={`请选择${THIS.state.propsParameter.title}`}
          visible={THIS.state.propsParameter.visible}
          onOk={() => {
            if(THIS.state.propsParameter.onItem.length <= 0){
              message.error('内容不能为空，请选择内容!');
              return false;
            }
            THIS.closeBox();
            this.state.parameter[this.state.propsParameter.name]=undefined;
            THIS.setState({});
            THIS.state.propsParameter.cbk();
          }}
          onCancel={() => {
            this.state.parameter[this.state.propsParameter.name]=undefined;
            THIS.setState({});
            THIS.closeBox();
          }}
          okText="确认"
          cancelText="取消"
          width={THIS.state.propsParameter.width}
          key={THIS.state.propsParameter.key}
        >
          <Row style={{display:'flex',alignItems:'center'}}>
            <Col span={3}>
              <p>{this.state.propsParameter.seaTitle || this.state.propsParameter.title}名称：</p>
            </Col>
            <Col span={5}>
              <Input maxLength='50' value={this.state.parameter[this.state.propsParameter.name]} placeholder={`输入${this.state.propsParameter.seaTitle || this.state.propsParameter.title}名称`} onChange={THIS.changeText.bind(THIS)}/>
            </Col>
            <Col span={1}></Col>
            {
              this.state.propsParameter.MultipleSearch.map((obj,idx) => {
                if (idx>1){return false}
                return <Col span={8} style={{display:'flex',alignItems:'center'}} key={idx}>
                  <Col span={6}>
                    <p>{obj.title}：</p>
                  </Col>
                  <Col span={15}>
                    {
                      obj.type === 'Input' ?
                        <Input placeholder={obj.placeholder} value={this.state.parameter[obj.key]} onChange={event => this.changeMultipleSearch(event.target.value,obj.key)}/>
                        :
                        <Select placeholder={obj.placeholder} value={this.state.parameter[obj.key]} onChange={event => this.changeMultipleSearch(event,obj.key)}>
                          <Select.Option value=''>请选择</Select.Option>
                          {
                            obj.value.map((object,index) => {
                              return <Select.Option value={object.id} key={index}>{object.name}</Select.Option>
                            })
                          }
                        </Select>
                    }
                  </Col>
                  <Col span={3}></Col>
                </Col>
              })
            }
          </Row>
          <Row style={{margin:'8px 0'}}>
            <Col span={22}></Col>
            <Col span={2}>
              <Button type="searchSubm" onClick={THIS.dataList.bind(THIS,'search')}>查询</Button>
            </Col>
          </Row>
          <Table dataSource={this.state.list} columns={this.state.propsParameter.columns} pagination={this.pagination}/>
          {/*已选择的品牌 dataSource={dataSource} columns={columns}*/}
          <div className={styles.choiced}>
            <div className="ant-form-item-label">
              <label className="ant-form-item-required">已添加的{THIS.state.propsParameter.title}</label>
            </div>
            <div className={styles.choicedName}>
              {
                THIS.state.propsParameter.onItem.map((item, index)=> {
                  return <span key={index}>{item[THIS.state.propsParameter.showName]}<Icon onClick={this.deleteItem.bind(THIS,item)}
                                                                                           type="close"/></span>
                })
              }
            </div>
          </div>
        </Modal>
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
    this.state.propsParameter.visible = nextProps.visible;
    if(nextProps.onItem){
      this.state.propsParameter.onItem = nextProps.onItem;
    }
    if(nextProps.parameter){
      this.state.parameter = Object.assign(this.state.parameter, nextProps.parameter)
    }
    if (nextProps.MultipleSearch){
      this.state.propsParameter.MultipleSearch = nextProps.MultipleSearch
    }
    //修改表头时
    if (nextProps.columns){
      this.state.propsParameter.columns = nextProps.columns;
      this.tableOperation();
    }
    this.setState({}, ()=>{this.dataList()});
  }

  // 插入真实 DOM
  componentDidMount() {
    this.tableOperation();
  }

}
