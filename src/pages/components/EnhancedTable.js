import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import {
  Checkbox,
  IconButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  FormControl,
  FormGroup,
  Typography, Grid, InputLabel, Input, FormControlLabel
} from "@material-ui/core";

import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";
import i18next from 'i18next'

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${props => props.theme.spacing(12)}px);
`;

function val(n, c) {
  return c.f ? c.f(n) : n[c.id]
}

function desc(a, b, orderCol) {
  if (val(b, orderCol) < val(a, orderCol)) {
    return -1;
  }
  if (val(b, orderCol) > val(a, orderCol)) {
    return 1;
  }
  return 0;
}

function filterDate(array, search, columns, exact) {
  if(search) {
    return array.filter(n => columns.some(c => {
      let v = String(val(n, c));
      return exact ? (v === search) : ~v.indexOf(search);
    }));
  } else {
    return array;
  }
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderCol) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderCol)
    : (a, b) => -desc(a, b, orderCol);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      columns,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      checkbox
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {
            checkbox ?
              (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount}
                    onChange={onSelectAllClick}
                  />
                </TableCell>
              ) : null

          }
          {columns.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
              {
                row.sortable ?
                  (
                  <Tooltip
                    title="Sort"
                    placement={row.numeric ? "bottom-end" : "bottom-start"}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                      onClick={this.createSortHandler(row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                  ) : row.label
                }
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

let EnhancedTableToolbar = props => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <div>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Nutrition
          </Typography>
        )}
      </div>
      <Spacer />
      <div>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

export default class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: props.columns[0].id,
      selected: [],
      page: 0,
      rowsPerPage: 10,
      search: '',
      exact: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    const { data } = this.props;
    if (event.target.checked) {
      this.setState(state => ({ selected: data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSearch = event => {
    this.setState({ search: event.target.value, page: 0 });
  };

  clickCheckbox = event => {
    this.setState({ [event.target.name]: !this.state[event.target.name] });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { data, columns, submenus, checkbox } = this.props;
    const { order, orderBy, selected, rowsPerPage, page, search, exact } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const orderCol = columns.find(c => c.id === orderBy);

    return (
      <Card mb={6}>
        <Paper>
          <CardContent pb={0} ml={5} mb={5} >
            <Grid container spacing={6} >
              <Grid item md={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="search">{ i18next.t('dict.search') }</InputLabel>
                  <Input id="search" name="search" defaultValue="" placeholder="Search word" onChange={this.handleChangeSearch} />
                </FormControl>
              </Grid>
              <Grid item md={2}>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="exact"
                        checked={this.exact}
                        onClick={this.clickCheckbox}
                      />
                    }
                    label={ i18next.t('dict.exact') }
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} >
                <Grid
                  justify="space-between"
                  container
                  spacing={24}
                >
                <FormControl>
                </FormControl>
                <FormGroup row>
                  {
                    submenus ? submenus.map((menu) => {
                      return (
                        <FormControl>
                          { React.cloneElement(menu.component, menu.props) }
                        </FormControl>
                      )
                    }) : null
                  }
                </FormGroup>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          {
            checkbox ? <EnhancedTableToolbar numSelected={selected.length} /> : null
          }
          <TableWrapper>
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                columns={columns}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
                checkbox={checkbox}
              />
              <TableBody>
                {stableSort(filterDate(data, search, columns, exact), getSorting(order, orderCol))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                      >
                        {
                          checkbox ? <TableCell padding="checkbox"><Checkbox checked={isSelected} /></TableCell> : null
                        }
                        {
                          columns.map((c) => {
                            return (
                              <TableCell
                                scope="row"
                                padding={c.disablePadding ? "none" : "default"}
                                align={c.numeric ? "right" : "left"}
                                >
                                {
                                  c.component ? React.cloneElement(c.component, c.props(n)) : val(n, c)
                                }
                              </TableCell>
                            );
                          })
                        }
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableWrapper>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </Card>
    );
  }
}
