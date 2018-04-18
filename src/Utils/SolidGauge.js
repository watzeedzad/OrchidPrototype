import React, { Component } from "react";
import Highcharts from "highcharts";
import {
    HighchartsChart,
    withHighcharts,
    Series,
    XAxis,
    YAxis
  } from "react-jsx-highcharts";

require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/solid-gauge")(Highcharts);

const plotOptions = {
  solidgauge: {
    dataLabels: {
      y: 5,
      borderWidth: 0,
      useHTML: true
    }
  }
};

const paneOptions = {
  center: ["50%", "45%"],
  size: "80%",
  startAngle: -90,
  endAngle: 90,
  background: {
    backgroundColor:
      (Highcharts.theme && Highcharts.theme.background2) || "#EEE",
    innerRadius: "60%",
    outerRadius: "100%",
    shape: "arc"
  }
};

const GraphRender = ({ data }) => {
  return (
    <div className="gauge-empty">
      <div className="no-data">Data Unavaialble</div>
      <HighchartsChart
        chart={{ type: "solidgauge" }}
        plotOptions={plotOptions}
        pane={paneOptions}
      >
        <XAxis />

        <YAxis
          id="myAxis"
          min={0}
          max={100}
          lineWidth={0}
          minorTickInterval={null}
          tickAmount={2}
          title={{
            y: -70
          }}     
          labels={{ distance:25 }}
          tickPosition = 'outside'
          tickPositions = {[0,30,40,100]}
          minorTickLength = {0}
          stops = {[
            [0.0, '#6FCEE6'], // green
            [0.3, '#8DE239'], // yellow
            [0.4, '#E84848'] // red
          ]}
        >
          <Series
            id="gauge-test"
            name="gauge-test"
            data={[35]}
            type="solidgauge"
          />
        </YAxis>
      </HighchartsChart>
    </div>
  );
};

const Gauge = ({ data }) => <GraphRender data={data} />;

export default withHighcharts(Gauge, Highcharts);