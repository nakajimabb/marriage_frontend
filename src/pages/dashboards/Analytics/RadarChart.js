import React from "react";
import styled, { withTheme } from "styled-components";

import { CardContent, Card as MuiCard, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Radar } from "react-chartjs-2";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const ChartWrapper = styled.div`
  height: 318px;
`;

const RadarChart = ({ theme }) => {
  const data = {
    labels: ["Technology", "Sports", "Media", "Gaming", "Arts"],
    datasets: [
      {
        label: "Interests",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderColor: theme.palette.secondary.main,
        pointBackgroundColor: theme.palette.secondary.main,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: theme.palette.secondary.main,
        data: [70, 53, 82, 60, 33]
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  };

  return (
    <Card mb={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Interests
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Radar data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(RadarChart);
