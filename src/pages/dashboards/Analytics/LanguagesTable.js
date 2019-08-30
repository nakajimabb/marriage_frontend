import React from "react";
import styled, { withTheme } from "styled-components";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  LinearProgress as MuiLinearProgress
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${props => props.theme.spacing(12)}px);
`;

const LinearProgress = styled(MuiLinearProgress)`
  height: 16px;
  width: 180px;
  border-radius: 3px;
  background: ${props => props.theme.palette.grey[200]};
`;

function LanguagesTable() {
  return (
    <Card mb={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Languages
        </Typography>
      </CardContent>
      <Paper>
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row">
                  Language
                </TableCell>
                <TableCell align="right">Users</TableCell>
                <TableCell>% Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell scope="row">en-us</TableCell>
                <TableCell align="right">865</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">en-gb</TableCell>
                <TableCell align="right">240</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">fr-fr</TableCell>
                <TableCell align="right">220</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={50}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">es-es</TableCell>
                <TableCell align="right">162</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={30}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">de-de</TableCell>
                <TableCell align="right">86</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={15}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">ru-ru</TableCell>
                <TableCell align="right">32</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={5}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableWrapper>
      </Paper>
    </Card>
  );
}

export default withTheme(LanguagesTable);
