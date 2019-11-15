import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  FormGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input,
  Checkbox,
  Container,
  Box,
  AppBar,
  Toolbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper, FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";

import i18next from 'i18n'
import { str, collectErrors, createFormData } from 'helpers';
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";
import env from 'environment';


const useStyles = makeStyles(theme => ({
  paper: {
    padding: 10,
  },
  cell: {
    padding: '3px 15px',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  number: {
    width: 80,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
}));

const UserRequirement = props => {

  const { user, session, matchmakers, setUser, onClose } = props;
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [requirement, setRequirement] = useState({});
  const religions = i18next.data_list('enum', 'user', 'religion');
  const marital_statuses = i18next.data_list('enum', 'user', 'marital_status');
  const classes = useStyles();
  const user_id = user.id;

  useEffect(() => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/requirements/get_by_user_id?user_id=' + user_id;

        axios.get(url, {headers})
          .then((results) => {
            setRequirement(results.data.requirement);
          })
          .catch((data) => {
            alert('データの取得に失敗しました。');
          });
      }
    }
  }, [user_id, session.headers]);

  const onSave = async () => {
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/requirements/';
      if(requirement.id) url += requirement.id;

      let promise;
      let requirement_params = createFormData(requirement, 'requirement');

      if(requirement.id) {
        promise = axios.patch(url, requirement_params, { headers });
      } else {
        promise = axios.post(url, requirement_params, { headers });
      }
      promise
        .then((results) => {
          setErrors({});
          setMessage(i18next.t('views.app.save_done'));
        })
        .catch((data) => {
          setErrors(collectErrors(data.response, 'requirement'));
        });
    }
  };

  const handleChange = event => {
    let requirement2 = Object.assign({}, requirement);
    requirement2[event.target.name] = event.target.value;
    setRequirement(requirement2);
  };

  const handleChangeChecked = event => {
    let requirement2 = Object.assign({}, requirement);
    requirement2[event.target.name] = event.target.checked;
    setRequirement(requirement2);
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={ Object.keys(errors).length > 0 }
        variant="error"
        message={
          Object.keys(errors).map(key => {
            return (
              <div>{errors[key]}</div>
            );
          })
        }
        onClose={() => setErrors({})}
      />
      <CustomizedSnackbar
        open={ message }
        variant="info"
        message={ message }
        onClose={() => setMessage(null)}
      />

      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell variant="head" className={classes.cell} >
                  { i18next.attr('user', 'age') }
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormGroup row>
                    <FormControl>
                      <TextField
                        name="min_age"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(requirement.min_age) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.min_age}
                        fullWidth
                      />
                    </FormControl>
                    <Box m={2}>
                      &nbsp; 〜 &nbsp;
                    </Box>
                    <FormControl>
                      <TextField
                        name="max_age"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(requirement.max_age) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.max_age}
                        fullWidth
                      />
                    </FormControl>
                  </FormGroup>
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={ <Checkbox name="required_age"
                                          checked={ !!requirement.required_age }
                                          onChange={ handleChangeChecked }
                                          value={ 1 }
                                />
                              }
                      label= { i18next.t('views.app.required') }
                    />
                  </FormControl>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head" className={classes.cell} >
                  { i18next.attr('user', 'religion') }
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <Select
                      value={ str(requirement.religion) }
                      onChange={handleChange}
                      inputProps={{
                        name: "religion",
                        id: "requirement_religion"
                      }}
                      error={errors.religion}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em></em>
                      </MenuItem>
                      {
                        Object.keys(religions).map(religion => <MenuItem value={religion}>{ religions[religion] }</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={ <Checkbox name="required_religion"
                                          checked={ !!requirement.required_religion }
                                          onChange={ handleChangeChecked }
                                          value={ 1 }
                      />
                      }
                      label= { i18next.t('views.app.required') }
                    />
                  </FormControl>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head" className={classes.cell} >
                  { i18next.attr('user', 'marital_status') }
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <Select
                      value={ str(requirement.marital_status) }
                      onChange={handleChange}
                      inputProps={{
                        name: "marital_status",
                        id: "requirement_marital_status"
                      }}
                      error={errors.marital_status}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em></em>
                      </MenuItem>
                      {
                        Object.keys(marital_statuses).map(marital_status => <MenuItem value={marital_status}>{ marital_statuses[marital_status] }</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={ <Checkbox name="required_marital_status"
                                          checked={ !!requirement.required_marital_status }
                                          onChange={ handleChangeChecked }
                                          value={ 1 }
                      />
                      }
                      label= { i18next.t('views.app.required') }
                    />
                  </FormControl>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head" className={classes.cell} >
                  { i18next.attr('user', 'income') }
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormGroup row>
                    <FormControl>
                      <TextField
                        name="min_income"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(requirement.min_income) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.min_income}
                        fullWidth
                      />
                    </FormControl>
                    <Box m={2}>
                      &nbsp; 〜 &nbsp;
                    </Box>
                    <FormControl>
                      <TextField
                        name="max_income"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(requirement.max_income) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.max_income}
                        fullWidth
                      />
                    </FormControl>
                  </FormGroup>
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={ <Checkbox name="required_income"
                                          checked={ !!requirement.required_income }
                                          onChange={ handleChangeChecked }
                                          value={ 1 }
                      />
                      }
                      label= { i18next.t('views.app.required') }
                    />
                  </FormControl>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head" className={classes.cell} >
                  { i18next.attr('user', 'height') }
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormGroup row>
                    <FormControl>
                      <TextField
                        name="min_height"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(requirement.min_height) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.min_height}
                        fullWidth
                      />
                    </FormControl>
                    <Box m={2}>
                      &nbsp; 〜 &nbsp;
                    </Box>
                    <FormControl>
                      <TextField
                        name="max_height"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(requirement.max_height) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.max_height}
                        fullWidth
                      />
                    </FormControl>
                  </FormGroup>
                </TableCell>
                <TableCell className={classes.cell} >
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={ <Checkbox name="required_height"
                                          checked={ !!requirement.required_height }
                                          onChange={ handleChangeChecked }
                                          value={ 1 }
                      />
                      }
                      label= { i18next.t('views.app.required') }
                    />
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Container>
      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            <Grid item>
              <Button onClick={onSave} color="primary">
                { i18next.t('views.app.save') }
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserRequirement));