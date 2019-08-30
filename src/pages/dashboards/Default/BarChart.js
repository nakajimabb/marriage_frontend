import React from "react";
import styled, { withTheme } from "styled-components";

import { CardContent, Card as MuiCard, Typography } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { Bar } from "react-chartjs-2";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  height: 318px;
  width: 100%;
`;

const BarChart = ({ theme }) => {
  const data = {
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
        label: "Mobile",
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        hoverBackgroundColor: theme.palette.secondary.main,
        hoverBorderColor: theme.palette.secondary.main,
        data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79]
      },
      {
        label: "Desktop",
        backgroundColor: theme.palette.grey["200"],
        borderColor: theme.palette.grey["200"],
        hoverBackgroundColor: theme.palette.grey["200"],
        hoverBorderColor: theme.palette.grey["200"],
        data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68]
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false
          },
          stacked: false,
          ticks: {
            stepSize: 20
          }
        }
      ],
      xAxes: [
        {
          barPercentage: 0.75,
          categoryPercentage: 0.5,
          stacked: false,
          gridLines: {
            color: "transparent"
          }
        }
      ]
    }
  };

  return (
    <Card mb={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Mobile / Desktop
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(BarChart);
