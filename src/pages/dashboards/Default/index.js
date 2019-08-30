import React from "react";
import styled, { withTheme } from "styled-components";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { indigo, green, blue, orange, red } from "@material-ui/core/colors";

import Actions from "./Actions";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import Stats from "./Stats";
import Table from "./Table";

import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Users
} from "react-feather";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Default({ theme }) {
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
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Sales Today"
            amount="2.532"
            icon={ShoppingBag}
            color={blue[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Visitors"
            amount="170.212"
            icon={Users}
            color={orange[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Total Earnings"
            amount="$ 24.300"
            icon={DollarSign}
            color={green[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Pending Orders"
            amount="45"
            icon={ShoppingCart}
            color={red[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Total Revenue"
            amount="$ 18.400"
            icon={Truck}
            color={indigo[500]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={8}>
          <LineChart />
        </Grid>
        <Grid item xs={12} lg={4}>
          <DoughnutChart />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={4}>
          <BarChart />
        </Grid>
        <Grid item xs={12} lg={8}>
          <Table />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withTheme(Default);
