import clsx from 'clsx';
import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  AppBar,
  Grid,
  Container,
  Toolbar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";

import i18next from 'i18n'
import { str } from 'helpers';
import TitleBar from "pages/components/TitleBar";
import env from 'environment';


const useStyles = makeStyles(theme => ({
  list: {
    margin: 0,
    padding: 0,
    width: '100%',
  },
  paper: {
    margin: 10,
  },
  title: {
    margin: 0,
    padding: '5px 20px',
    borderBottom: '1px solid lightgray',
  },
  item: {
    borderBottom: '1px solid lightgray',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  number: {
    width: 80,
  },
  name: {
    width: 150,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
  remark: {
    whiteSpace: 'pre-wrap',
  },
  male: {
    color: 'dodgerblue',
  },
  female: {
    color: 'hotpink',
  },
}));

const RoomPage = props => {

  const { room_id, session, onClose } = props;
  const [room, setRoom] = useState({});
  const [room_user, setRoomUser] = useState({});
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const prefectures = i18next.data_list('prefecture');
  const user = session.user;
  const title = str(room.dated_on).replace(/-/g, '/') + ' ' + room.name;

  useEffect(() => {
    if(room_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + `api/rooms/${room_id}`;

        axios.get(url, {headers})
          .then((results) => {
            setRoom(results.data.room);
            setRoomUser(results.data.user);
            setUsers(results.data.users);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
            onClose();
          });
      }
    }
  }, [room_id, session.headers]);

  return (
    <React.Fragment>
      <TitleBar title={title} variant="dense" />
      <Container maxWidth="sm" spacing={5}>
        <Paper className={classes.paper}>
          <List component="nav" className={classes.list}>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.attr('room', 'name') }
              </ListItemIcon>
              <ListItemText >
                { str(room.name) }
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.attr('room', 'user') }
              </ListItemIcon>
              <ListItemText >
                { str(room_user.nickname) }
                &ensp;
                { i18next.enum('user', 'sex', user.sex) }
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.attr('room', 'room_type') }
              </ListItemIcon>
              <ListItemText >
                { i18next.enum('room', 'room_type', room.room_type) }
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.attr('room', 'dated_on') }
              </ListItemIcon>
              <ListItemText >
                { str(room.dated_on).replace(/-/g, '/') }
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.attr('room', 'fixed_on') }
              </ListItemIcon>
              <ListItemText >
                { str(room.fixed_on).replace(/-/g, '/') }
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.t('views.room.user_count') }
              </ListItemIcon>
              <ListItemText >
                { i18next.enum('user', 'sex', 'male') } ({ str(room.male_count) }{ i18next.t('views.app.human_number_unit') })
              </ListItemText>
              <ListItemText >
                { i18next.enum('user', 'sex', 'female') } ({ str(room.female_count) }{ i18next.t('views.app.human_number_unit') })
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.attr('user', 'age') }
              </ListItemIcon>
              <ListItemText >
                {room.min_age}~{room.max_age} {i18next.t('views.app.age_year')}
              </ListItemText>
            </ListItem>
            <ListItem button className={classes.item} >
              <ListItemIcon className={classes.name} >
                { i18next.t('views.room.place') }
              </ListItemIcon>
              <ListItemText >
                { room.prefecture ? prefectures[room.prefecture] : null }
                { str(room.address) }
              </ListItemText>
            </ListItem>
            <ListItem button >
              <ListItemIcon className={classes.name} >
                { i18next.attr('room', 'remark') }
              </ListItemIcon>
              <ListItemText >
                <Typography className={classes.remark}>
                  { room.remark }
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </Paper>
        {
          (user.role_matchmaker && users) ? (
            <Paper className={classes.paper}>
              <Typography className={classes.title}>
                { i18next.t('views.room.users') }
              </Typography>
              <List component="nav" className={classes.list}>
                {
                  users.map(user => {
                    return (
                      <ListItem button className={clsx(classes.item, classes[user.sex])} >
                        <ListItemIcon className={classes.name} >
                          { user.nickname }
                        </ListItemIcon>
                        <ListItemText >
                          { user.sex ? <span>{ i18next.enum('user', 'sex', user.sex) }&ensp;</span> : null }
                          { user.age ? <span>{ user.age + i18next.t('views.app.age_year') }&ensp;</span> : null }
                          { user.role_matchmaker ? <span>{ i18next.t('views.user.matchmaker') }&ensp;</span> : null }
                          { user.marital_status ? <span>{ i18next.enum('user', 'marital_status', user.marital_status) }&nbsp;</span> : null }
                          { user.job ? <span>{ user.job }&ensp;</span> : null }
                          { user.hobby ? <span>{ user.hobby }&ensp;</span> : null }
                          { user.religion ? <span>{ i18next.enum('user', 'religion', user.religion) }&ensp;</span> : null }
                        </ListItemText>
                      </ListItem>
                    )
                  })
                }
              </List>
            </Paper>
          ) : null
        }
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
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(RoomPage));
