import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  AppBar,
  FormGroup,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Container,
  Box,
  Toolbar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  InputLabel,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";

import i18next from 'i18n'
import { str, collectErrors, createFormData } from 'helpers';
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";
import env from 'environment';


const useStyles = makeStyles(theme => ({
  paper: {
    margin: 10,
  },
  content: {
    margin: 'auto',
    width: 420,
  },
  item: {
    padding: 0,
    margin: 0,
  },
  number: {
    width: 80,
  },
  name: {
    width: 100,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
}));

const RoomForm = props => {

  const { room_id, session, onClose, onUpdate } = props;
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [room, setRoom] = useState({});
  const classes = useStyles();
  const room_types = i18next.data_list('enum', 'room', 'room_type');
  const prefectures = i18next.data_list('prefecture');
  const user = session.user;

  useEffect(() => {
    if(room_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + `api/rooms/${room_id}/edit`;

        axios.get(url, {headers})
          .then((results) => {
            setRoom(results.data.room);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  }, [room_id, session.headers]);

  const onSave = () => {
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/rooms/';
      if(room_id) url += room_id;

      let promise;
      let room_params = createFormData(room, 'room');

      if(room_id) {
        promise = axios.patch(url, room_params, { headers });
      } else {
        promise = axios.post(url, room_params, { headers });
      }
      promise
        .then((results) => {
          setErrors({});
          setMessage(i18next.t('views.app.save_done'));
          onUpdate(results.data.room);
          onClose();
        })
        .catch((data) => {
          setErrors(collectErrors(data.response, 'room'));
        });
    }
  };

  const handleChange = event => {
    let room2 = Object.assign({}, room);
    room2[event.target.name] = event.target.value;
    setRoom(room2);
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

      <Container maxWidth="sm" spacing={5}>
        <Paper className={classes.paper}>
          <Box className={classes.content}>
            <List component="nav">
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.attr('room', 'name') }
                </ListItemIcon>
                <ListItemText >
                  <FormControl fullWidth>
                    <TextField
                      name="name"
                      autoComplete="off"
                      defaultValue=""
                      value={ str(room.name) }
                      onChange={handleChange}
                      error={errors.name}
                    />
                  </FormControl>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.attr('room', 'room_type') }
                </ListItemIcon>
                <ListItemText >
                  <FormControl fullWidth>
                    <Select
                      value={ str(room.room_type) }
                      onChange={handleChange}
                      inputProps={{
                        name: "room_type",
                        id: "room_room_type"
                      }}
                      error={errors.room_type}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em></em>
                      </MenuItem>
                      {
                        Object.keys(room_types).map(room_type => <MenuItem value={room_type}>{ room_types[room_type] }</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.attr('room', 'dated_on') }
                </ListItemIcon>
                <ListItemText >
                  <FormControl fullWidth>
                    <TextField
                      name="dated_on"
                      type="date"
                      autoComplete="off"
                      defaultValue=""
                      value={ str(room.dated_on) }
                      onChange={handleChange}
                      error={errors.dated_on}
                    />
                  </FormControl>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.attr('room', 'fixed_on') }
                </ListItemIcon>
                <ListItemText >
                  <FormControl fullWidth>
                    <TextField
                      name="fixed_on"
                      type="date"
                      autoComplete="off"
                      defaultValue=""
                      value={ str(room.fixed_on) }
                      onChange={handleChange}
                      error={errors.fixed_on}
                    />
                  </FormControl>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.t('views.room.user_count') }
                </ListItemIcon>
                <ListItemText >
                  <FormGroup row>
                    <FormControl>
                      <TextField
                        name="male_count"
                        type="number"
                        label={ i18next.enum('user', 'sex', 'male') }
                        autoComplete="off"
                        defaultValue=""
                        value={ str(room.male_count) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.male_count}
                      />
                    </FormControl>
                    <Box m={5}>
                    </Box>
                    <FormControl>
                      <TextField
                        name="female_count"
                        type="number"
                        label={ i18next.enum('user', 'sex', 'female') }
                        autoComplete="off"
                        defaultValue=""
                        value={ str(room.female_count) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.female_count}
                      />
                    </FormControl>
                  </FormGroup>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.attr('user', 'age') }
                </ListItemIcon>
                <ListItemText >
                  <FormGroup row>
                    <FormControl>
                      <TextField
                        name="min_age"
                        type="number"
                        autoComplete="off"
                        defaultValue=""
                        value={ str(room.min_age) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.min_age}
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
                        value={ str(room.max_age) }
                        onChange={handleChange}
                        className={classes.number}
                        error={errors.max_age}
                      />
                    </FormControl>
                  </FormGroup>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.t('views.room.place') }
                </ListItemIcon>
                <ListItemText >
                  <FormGroup row>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="prefecture">{ i18next.attr('room', 'prefecture') }</InputLabel>
                      <Select
                        value={ str(room.prefecture) }
                        onChange={handleChange}
                        inputProps={{
                          name: "prefecture",
                          id: "room_prefecture"
                        }}
                        error={errors.prefecture}
                      >
                        <MenuItem value="">
                          <em></em>
                        </MenuItem>
                        {
                          Object.keys(prefectures).map(prefecture => <MenuItem value={prefecture}>{ prefectures[prefecture] }</MenuItem>)
                        }
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        name="address"
                        autoComplete="off"
                        label={ i18next.attr('room', 'address') }
                        defaultValue=""
                        value={ str(room.address) }
                        onChange={handleChange}
                        error={errors.address}
                      />
                    </FormControl>
                  </FormGroup>
                </ListItemText>
              </ListItem>
              <ListItem className={classes.item} >
                <ListItemIcon className={classes.name} >
                  { i18next.attr('room', 'remark') }
                </ListItemIcon>
                <ListItemText >
                  <FormControl fullWidth>
                    <TextField
                      name="remark"
                      autoComplete="off"
                      multiline
                      rows="15"
                      rowsMax="50"
                      value={ str(room.remark) }
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      error={errors.remark}
                    />
                  </FormControl>
                </ListItemText>
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Container>
      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            <Grid item>
              {
                onClose ? (
                  <Button onClick={() => onClose()} color="primary">
                    { i18next.t('views.user.back') }
                  </Button>
                ): null
              }
              {
                onSave ? (
                  <Button onClick={onSave} color="primary">
                    {i18next.t('views.app.save')}
                  </Button>
                ) : null
              }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(RoomForm));