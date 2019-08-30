import React, { Component } from "react";
import styled, { withTheme } from "styled-components";

import { CardContent, Card as MuiCard, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { Line } from "react-chartjs-2";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  height: 378px;
`;

class LineChart extends Component {
  constructor() {
    super();

    this.data = canvas => {
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(
        0,
        fade(this.props.theme.palette.secondary.main, 0.0875)
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            label: "Sales ($)",
            fill: true,
            backgroundColor: gradient,
            borderColor: this.props.theme.palette.secondary.main,
            data: [
              2115,
              1562,
              1584,
              1892,
              1587,
              1923,
              2566,
              2448,
              2805,
              3438,
              2917,
              3327
            ]
          },
          {
            label: "Orders",
            fill: true,
            backgroundColor: "transparent",
            borderColor: this.props.theme.palette.grey["500"],
            borderDash: [4, 4],
            data: [
              958,
              724,
              629,
              883,
              915,
              1214,
              1476,
              1212,
              1554,
              2128,
              1466,
              1827
            ]
          }
        ]
      };
    };

    this.options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        intersect: false
      },
      hover: {
        intersect: true
      },
      plugins: {
        filler: {
          propagate: false
        }
      },
      scales: {
        xAxes: [
          {
            reverse: true,
            gridLines: {
              color: "rgba(0,0,0,0.0)"
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              stepSize: 500
            },
            display: true,
            borderDash: [5, 5],
            gridLines: {
              color: "rgba(0,0,0,0.0375)",
              fontColor: "#fff"
            }
          }
        ]
      }
    };
  }

  render() {
    return (
      <Card mb={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Revenue
          </Typography>

          <Spacer mb={6} />

          <ChartWrapper>
            <Line data={this.data} options={this.options} />
          </ChartWrapper>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(LineChart);
