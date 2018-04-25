import React from "react";
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
                chart={{ type: "gauge" }}
                plotOptions={plotOptions}
                pane={paneOptions}
            >
                <XAxis />

                <YAxis
                    id="myAxis"
                    min={0}
                    max={50}
                    lineWidth={0}
                    minorTickInterval={null}
                    tickAmount={2}
                    title={{
                        y: -70
                    }}
                    labels={{ distance: 25 }}
                    tickPosition='outside'
                    tickPositions={[0, this.props.minTempConfig,this.props.maxTempConfig, 50]}
                    minorTickLength={0}
                    plotBands={[{
                        from: 0,
                        to: this.props.minTempConfig,
                        color: 'rgb(192, 0, 0)',
                        thickness: '50%',
                    }, {
                        from: this.props.minTempConfig,
                        to: this.props.maxTempConfig,
                        color: 'rgb(255, 192, 0)',
                        thickness: '50%'
                    }, {
                        from: this.props.maxTempConfig,
                        to: 50,
                        color: 'rgb(155, 187, 89)',
                        thickness: '50%'
                    }]}
                >
                    <Series
                        name="speed"
                        data={this.props.currentTemp}
                        type="gauge"
                    />
                </YAxis>
            </HighchartsChart>
        </div>
    );
};

const Gauge = ({ data }) => <GraphRender data={data} />;

export default withHighcharts(Gauge, Highcharts);
