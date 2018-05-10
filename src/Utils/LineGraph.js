import React, { Component } from "react";
import Highcharts from "highcharts";
import {
  HighchartsChart,
  withHighcharts,
  Series,
  XAxis,
  YAxis,
  Tooltip
} from "react-jsx-highcharts";

require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);


const plotOptions = {
  line: {
    dataLabels: {
      enabled: true
    },
    enableMouseTracking: false
  }
};

//<Tooltip padding={10} hideDelay={250} shape="square" />
class LineGraph extends Component {
  render() {
    return (
      <div className="gauge-empty">
        <div className="text-center">{this.props.name}</div>
        <HighchartsChart chart={{ type: "line" }} plotOptions={plotOptions}>
          <Tooltip padding={1} hideDelay={250} shape="square" />

          <XAxis
            title={{text: "เวลา"}}
            categories={[
              "0.00",
              "1.00",
              "2.00",
              "3.00",
              "4.00",
              "5.00",
              "6.00",
              "7.00",
              "8.00",
              "9.00",
              "10.00",
              "11.00",
              "12.00",
              "13.00",
              "14.00",
              "15.00",
              "16.00",
              "17.00",
              "18.00",
              "19.00",
              "20.00",
              "21.00",
              "22.00",
              "23.00"
            ]}
          />

          <YAxis title={{ text: this.props.yName }} id="myAxis">
            <Series
              id="series"
              data={this.props.history}
              type="line"
            />
          </YAxis>
        </HighchartsChart>
      </div>
    )
  }
}

export default withHighcharts(LineGraph, Highcharts);
