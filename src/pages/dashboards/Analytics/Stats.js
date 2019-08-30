import React from "react";
import styled from "styled-components";

import { lighten } from "@material-ui/core/styles/colorManipulator";

import {
  Box,
  Card,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  LinearProgress as MuiLinearProgress,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Typography = styled(MuiTypography)(spacing);

const LinearProgress = styled(MuiLinearProgress)`
  background: ${props => lighten(props.rgbcolor, 0.625)};
  margin-top: ${props => props.theme.spacing(8)}px;
  margin-bottom: ${props => props.theme.spacing(3)}px;
  height: 7px;
  border-radius: 2px;

  div {
    background: ${props => props.rgbcolor};
  }
`;

const CardContent = styled(MuiCardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${props => props.rgbcolor};
  color: ${props => props.theme.palette.common.white};
  margin-bottom: ${props => props.theme.spacing(4)}px;

  span {
    padding-left: ${props => props.theme.spacing(2)}px;
    padding-right: ${props => props.theme.spacing(2)}px;
  }
`;

function Stats({ title, amount, color, chip }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={6}>
          {title}
        </Typography>
        <Typography variant="h3" mb={6}>
          <Box fontWeight="fontWeightRegular">{amount}</Box>
        </Typography>
        <Chip label={chip} rgbcolor={color} />
        <LinearProgress variant="determinate" value={30} rgbcolor={color} />
      </CardContent>
    </Card>
  );
}

export default Stats;
