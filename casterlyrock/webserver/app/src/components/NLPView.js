import React, { Component } from 'react';
import {Card, Row, Col, Statistic, Button, Tabs,
        Badge, Table, Tag} from 'antd';
import { Chart } from "react-charts";
import HeatMap from "react-heatmap-grid";

const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;



class NLPView extends Component{
  constructor(props){

    super(props);
    // const id = parseInt(props.match.params.number, 10)
    this.state = {
      eval_result: null,
      id: props.match.params.number,
      confusion_matrix: {}
    }

  }

  componentDidMount(){
    console.log('/api/nlp/submit?id=' + this.state.id);
    fetch('/api/nlp/submit?id=' + this.state.id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(

         (response) =>{
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response

          response.json().then((data)=> {
            delete data['id'];
            delete data['_id'];
            console.log(data);

            this.setState({eval_result : data});
            // this.setState({eval_result_accuracy : data.accuracy});

          });

          }
      );

      fetch('/api/nlp/confusion?id=' + this.state.id, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(

           (response) =>{
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }
            // Examine the text in the response

            response.json().then((data)=> {

              delete data['_id'];
              delete data['id'];
              console.log(data);
              this.setState({confusion_matrix: data['confusion_matrix']});

              // this.setState({eval_result_accuracy : data.accuracy});

            });

            }
        );
  }

  // const fetchData = () => {
  //   console.log(this.state.id);
  //   fetch('/api/nlp/submit?=' + String(this.state.id), {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   }).then(
  //
  //        (response) =>{
  //         if (response.status !== 200) {
  //           console.log('Looks like there was a problem. Status Code: ' +
  //             response.status);
  //           return;
  //         }
  //         // Examine the text in the response
  //
  //         response.json().then((data)=> {
  //           console.log(data);
  //           this.setState({eval_result : data.data});
  //           // this.setState({eval_result_accuracy : data.accuracy});
  //
  //         });
  //
  //         }
  //     );
  // }

  render(){
    let xLabels = []
    for (let [key, value] of Object.entries(this.state.confusion_matrix)){
      xLabels.push(key);
    }

    let yLabels = []
    for (let [key, value] of Object.entries(this.state.confusion_matrix)){
      yLabels.push(key);
    }

    let heatmap_data = []
    for (let [key, value] of Object.entries(this.state.confusion_matrix)) {
      let curr = []
      for (let [k2, v2] of Object.entries(this.state.confusion_matrix)) {

          if(!(k2 in this.state.confusion_matrix[key])){
            curr.push(0) ;
          }else{
            curr.push(this.state.confusion_matrix[key][k2]);
          }
      }
      heatmap_data.push(curr);
    }




    const columns = [];
    columns.push({title: '', dataIndex: 'blank', key:'blank', render: text => <b>{text}</b>});
    for (let [key, value] of Object.entries(this.state.confusion_matrix)){
      columns.push({title: key, dataIndex: key, key: key})
    }
    let count = 1;
    const data = []
    for (let [key, value] of Object.entries(this.state.confusion_matrix)) {
      let row = {}
      row['key'] = count;
      row['blank'] = key
      count++;
      for (let [k2, v2] of Object.entries(this.state.confusion_matrix)) {

          if(!(k2 in this.state.confusion_matrix[key])){
            row[k2] = 0;
          }else{
            row[k2] = this.state.confusion_matrix[key][k2];
          }
      }
      data.push(row);

    }

    console.log(data);
    return (
      <div>
      <Card title="Model Evaluation" >
      <Row type="flex">

      {this.state.eval_result &&
      Object.keys(this.state.eval_result).map((key, index) =>
          <Col span={6}>
          <Card title={key}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="TP"
                      value={this.state.eval_result[key].tp}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="FP"
                      value={this.state.eval_result[key].fp}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="FN"
                      value={this.state.eval_result[key].fn}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
              </Row>
              <Card>
              <Row gutter={24}>
              <Col span={12}>

                      <Card>
                        <Statistic
                          title="Precision"
                          value={this.state.eval_result[key].precision * 100}
                          precision={2}
                          valueStyle={{ color: '#3f8600' }}
                          suffix="%"
                        />
                      </Card>
              </Col>
              <Col span={12}>

                      <Card>
                        <Statistic
                          title="Recall"
                          value={this.state.eval_result[key].recall * 100}
                          precision={2}
                          valueStyle={{ color: '#3f8600' }}
                          suffix="%"
                        />
                        </Card>
              </Col>
              </Row>
              </Card>
          </Card>
          </Col>
      )}
      </Row>




        {/*<Table dataSource={data} columns={columns} pagination={{ pageSize: 30 }}/>*/}

      </Card>

      <Row type="flex">

      <Col span={24}>

      <Card title="Evaluation Details" >
      <Row>
        <h3>Confusion Matrix:</h3>
      </Row>
      <Row>
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            yLabelWidth={130}
            xLabelsLocation={"top"}
            data={heatmap_data}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background: `rgb(255, 0, 0, ${value > 3 ? 1 - (max - value) / (max - min ) : ((1 - (max - value) / (max - min ))+(value * .05)) })`,
              fontSize: "12.5px",
              color: "#000"
            })}
            cellRender={value => value && `${value}`}

          />
      </Row>
          <br/>
          <Tabs defaultActiveKey="3" >


            <TabPane tab="True Positive" key="3" >

            <Row type="flex">
            <Col span={6}>

            </Col>
            </Row>


            </TabPane>

            <TabPane tab="False Positive" key="1">
                    {this.response && this.response.serving_default &&
                    <Card>
                    <Badge status="success" text="Input Tensors" />
                    <br/>
                      <Table dataSource={this.response.serving_default.inputs}>
                          <Column
                            title="Name"
                            dataIndex="name"
                            key="name"
                          />
                          <Column
                            title="Key"
                            dataIndex="key"
                            key="key"
                          />
                          <Column
                            title="Dtype"
                            dataIndex="dtype"
                            key="dtype"
                          />
                          <Column
                            title="Dims"
                            dataIndex="dims"
                            key="dims"
                            render={dims => (
                              <span>
                                {dims.map(dim => <Tag color="blue" key={dim}>{dim}</Tag>)}
                              </span>
                            )}
                          />
                      </Table>
                      <Badge status="success" text="Output Tensors" />
                      <br/>
                      <Table dataSource={this.response.serving_default.outputs}>
                          <Column
                            title="Name"
                            dataIndex="name"
                            key="name"
                          />
                          <Column
                            title="Key"
                            dataIndex="key"
                            key="key"
                          />
                          <Column
                            title="Dtype"
                            dataIndex="dtype"
                            key="dtype"
                          />
                          <Column
                            title="Dims"
                            dataIndex="dims"
                            key="dims"
                            render={dims => (
                              <span>
                                {dims.map(dim => <Tag color="blue" key={dim}>{dim}</Tag>)}
                              </span>
                            )}
                          />
                      </Table>
                    </Card>
                    }




            </TabPane>
            <TabPane tab="False Negative" key="4" style={{ height: 200 }}>

            <Chart
              data={[
                {
                  label: "Champion",
                  data: [[0, 800], [1, 780], [2, 800], [3, 820], [4, 800]]
                },
                {
                  label: "Challenger",
                  data: [[0, 900], [1, 980], [2, 900], [3, 920], [4, 900]]
                }
              ]}
              axes={[
                { primary: true, type: "linear", position: "bottom" },
                { type: "linear", position: "left" }
              ]}
            /></TabPane>

          </Tabs>
      </Card>
          </Col>
      </Row>
      </div>

    );
  }
}

export default NLPView
