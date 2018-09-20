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
class GrowthRateGraph extends Component {
  render() {
    return (
      <div className="gauge-empty">
        <div className="text-center">{this.props.name}</div>
        <HighchartsChart chart={{ type: "line" }} plotOptions={plotOptions}>
          <Tooltip padding={1} hideDelay={250} shape="square" />

          <XAxis
            title={{text: "วันที่"}}
            categories={this.props.timeStamp}
          />

          <YAxis title={{ text: this.props.yName }} id="myAxis">
            <Series
              id="series"
              data={this.props.data}
              type="line"
            />
          </YAxis>
        </HighchartsChart>
      </div>
    )
  }
}

export default withHighcharts(GrowthRateGraph, Highcharts);
