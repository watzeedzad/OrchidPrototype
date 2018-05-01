import React, { Component } from 'react';
import Highcharts from "highcharts";
import {
    HighchartsChart,
    withHighcharts,
    Series,
    XAxis,
    YAxis
} from "react-jsx-highcharts";
import 'bootstrap/dist/css/bootstrap.min.css';

require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/solid-gauge")(Highcharts);


const plotOptions = {
    solidgauge: {
        dataLabels: {
            y: 5,
            borderWidth:0 ,
            useHTML: true
        }
    }
};

const paneOptions = {
    center: ["50%", "85%"],
    size: "100%",
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

class Speedometer extends Component {
    render() {
        return (
            <div className="gauge-empty">
                <HighchartsChart
                    chart={{ type: "gauge" }}
                    plotOptions={plotOptions}
                    pane={paneOptions}
                >
                    <XAxis />

                    <YAxis
                        id="myAxis"
                        min={this.props.min}
                        max={this.props.max}
                        lineWidth={0}
                        minorTickInterval={null}
                        tickAmount={2}
                        title={{
                            y: -70
                        }}
                        labels={{ distance: 25 }}
                        tickPosition='outside'
                        tickPositions={[this.props.min, this.props.minConfig, this.props.maxConfig, this.props.max]}
                        minorTickLength={0}
                        plotBands={[{
                            from: this.props.min,
                            to: this.props.minConfig,
                            color: this.props.minColor,
                            thickness: '50%',
                        }, {
                            from: this.props.minConfig,
                            to: this.props.maxConfig,
                            color: this.props.midColor,
                            thickness: '50%'
                        }, {
                            from: this.props.maxConfig,
                            to: this.props.max,
                            color: this.props.maxColor,
                            thickness: '50%'
                        }]}
                    >
                        <Series
                            name="speed"
                            data={[this.props.currentValue]}
                            type="gauge"
                        />
                    </YAxis>
                </HighchartsChart>
            </div>
        )
    }
}

//const Gauge = ({ data }) => <GraphRender data={data} />;

export default withHighcharts(Speedometer, Highcharts);
