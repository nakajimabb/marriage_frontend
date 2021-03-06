import React, {useContext} from 'react';
import {
  AppBar,
  Toolbar,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  makeStyles,
} from '@material-ui/core';
import axios from 'axios';

import env from 'src/environment';
import i18next from 'src/i18n'
import { str, age } from 'src/helpers';
import AppContext from 'src/contexts/AppContext';
import UserImages from "./UserImages";


const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
  content: {
    backgroundColor: theme.body.background,
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
  },
  card_header: {
    paddingBottom: 5,
  },
  card_content: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  list_text: {
    paddingLeft: 5,
  },
  text_half: {
    paddingLeft: 5,
    width: '30%',
  },
}));

const UserFriend = props => {
  const {state: {session}} = useContext(AppContext);
  const { user, user_friend, onRequest } = props;
  const me = session.user;
  const request_ok = me.role_matchmaker && user.role_matchmaker && me.id !== user.id;

  if(request_ok) {
    if(user_friend) {
      let label = '';
      if(user_friend.status === 'accepted') {
        label = i18next.t('views.user_friend.friend');
      } else {
        label = i18next.t('views.user_friend.sent');
      }
      return (
        <Grid container justify = "center">
          <Button disabled size="small" variant="contained" color="primary">
            { label }
          </Button>
        </Grid>
      );
    } else {
      return (
        <Grid container justify = "center">
          <Button onClick={onRequest} size="small" variant="contained" color="primary">
            { i18next.t('views.user.request_sharing') }
          </Button>
        </Grid>
      );
    }
  } else {
    return null;
  }
};

const UserProfile = props => {
  const {state: {session}} = useContext(AppContext);
  const { user, user_friend, setUserFriend, onClose } = props;
  const classes = useStyles();
  const user_age = age(user.birthday) || user.age;
  const me = session.user;
  let roles = [];
  if(user.role_courtship) roles.push(i18next.attr('user', 'role_courtship'));
  if(user.role_matchmaker) roles.push(i18next.attr('user', 'role_matchmaker'));

  const onRequest = async () => {
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/user_friends/request_sharing';
      let user_params = {user_id: me.id, companion_id: user.id};

      let promise = axios.post(url, user_params, { headers });
      promise
        .then((results) => {
          const user_friend = results.data.user_friend;
          setUserFriend(user_friend);
        })
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
        });
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={4}>
          <Card className={classes.card}>
            <CardHeader
                title={ i18next.t('views.user.basic') }
                className={classes.card_header}
            />
            <CardContent className={classes.card_content} >
              <Grid container justify = "center">
                <Avatar
                    alt={ str(user.code) }
                    src={ user.avatar_url }
                    style={ {width: 160, height: 160, margin: 10} }
                />
              </Grid>
            </CardContent>
            <UserFriend user={user} user_friend={user_friend} onRequest={onRequest} />
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'code') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.code }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'sex') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.sex ? i18next.enum('user', 'sex', user.sex) : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'age') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user_age ? user_age + i18next.t('views.app.age_year') : null }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'marital_status') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.marital_status ? i18next.enum('user', 'marital_status', user.marital_status) : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.t('views.user.roles') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ roles.join(', ') }
                  className={classes.list_text}
                />
              </ListItem>
              {
                user.role_matchmaker ?
                  (
                    <ListItem button >
                      <ListItemIcon>
                        <ListItemText
                          inset
                          primary={ i18next.attr('user', 'courtships_size') }
                          className={classes.text_half}
                        />
                      </ListItemIcon>
                      <ListItemText
                        inset
                        primary={ user.courtships_size }
                        className={classes.text_half}
                      />
                      <ListItemIcon>
                        <ListItemText
                          inset
                          primary={ i18next.attr('user', 'member_sharing') }
                          className={classes.text_half}
                        />
                      </ListItemIcon>
                      <ListItemText
                        inset
                        primary={ user.member_sharing ? i18next.enum('user', 'member_sharing', user.member_sharing) : '' }
                        className={classes.text_half}
                      />
                    </ListItem>
                  ) : null
              }
            </List>
          </Card>

          <Card className={classes.card}>
            <CardHeader
              title={ i18next.t('views.user.physical') }
              className={classes.card_header}
            />
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'blood') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.blood ? str(i18next.enum('user', 'blood', user.blood)) : null }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'height') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.height ? str(user.height) + 'cm' : null }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'weight') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.weight ? str(user.weight) + 'kg' : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'drinking') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.drinking ? str(i18next.enum('user', 'drinking', user.drinking)) : null }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'smoking') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.smoking ? str(i18next.enum('user', 'smoking', user.smoking)) : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.t('views.user.sickness') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.diseased ? user.disease_name : null }
                />
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <UserImages user={user} />

          <Card className={classes.card}>
            <CardHeader
              title={ i18next.t('views.user.religion') }
              className={classes.card_header}
            />
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'religion')}
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.religion ? str(i18next.enum('user', 'religion', user.religion)) : null }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'sect')}
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.sect }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'church')}
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.church }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.t('views.user.baptism') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.baptized ? i18next.t('views.user.baptized') : i18next.t('views.user.unbaptized') }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'baptized_year') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ str(user.baptized_year) }
                  className={classes.text_half}
                />
              </ListItem>
            </List>
          </Card>

          <Card className={classes.card}>
            <CardHeader
              title={ i18next.t('views.user.misc') }
              className={classes.card_header}
            />
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'job') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.job }
                  className={classes.text_half}
                />
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'income') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.income ? str(user.income) + i18next.t('views.user.income_unit') : null }
                  className={classes.text_half}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'education') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.education }
                  className={classes.list_text}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListItemText
                    inset
                    primary={ i18next.attr('user', 'hobby') }
                    className={classes.text_half}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={ user.hobby }
                  className={classes.list_text}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
          <Card className={classes.card}>
            <CardHeader
              title={ i18next.attr('user', 'bio') }
              className={classes.card_header}
            />
            <CardContent>
              { user.bio }
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardHeader
              title={ i18next.attr('user', 'remark_self') }
              className={classes.card_header}
            />
            <CardContent>
              { user.remark_self }
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardHeader
              title={ i18next.attr('user', 'remark_matchmaker') }
              className={classes.card_header}
            />
            <CardContent>
              { user.remark_matchmaker }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            {
              onClose ? (
                <Grid item>
                  <Button onClick={() => onClose(null)} color="primary">
                    { i18next.t('views.user.back') }
                  </Button>
                </Grid>
              ) : null
            }
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default UserProfile;
