import React from "react";
import styled, { withTheme } from "styled-components";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography
} from "@material-ui/core";

import { indigo, green, blue, orange } from "@material-ui/core/colors";

import { spacing } from "@material-ui/system";

import Actions from "./Actions";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import LanguagesTable from "./LanguagesTable";
import RadarChart from "./RadarChart";
import Stats from "./Stats";
import TrafficTable from "./TrafficTable";
import WorldMap from "./WorldMap";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Analytics() {
  return (
    <React.Fragment>
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" display="inline">
            Welcome back, Lucy
          </Typography>
          <Typography variant="body2" ml={2} display="inline">
            Monday, 29 April 2019
          </Typography>
        </Grid>

        <Grid item>
          <Actions />
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Visitors"
                amount="24.532"
                value={75}
                color={blue[500]}
                chip="Today"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Activity"
                amount="63.200"
                value={30}
                color={orange[500]}
                chip="Annual"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Real-Time"
                amount="1.320"
                value={85}
                color={indigo[500]}
                chip="Monthly"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Stats
                title="Bounce"
                amount="12.364"
                value={25}
                color={green[500]}
                chip="Yearly"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7}>
          <WorldMap />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4}>
          <DoughnutChart />
        </Grid>
        <Grid item xs={12} lg={4}>
          <LanguagesTable />
        </Grid>
        <Grid item xs={12} lg={4}>
          <BarChart />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={4}>
          <RadarChart />
        </Grid>
        <Grid item xs={12} lg={8}>
          <TrafficTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withTheme(Analytics);
