import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Dialog,
  DialogContent,
  Tab,
  Tabs,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { User } from "react-feather";
import axios from 'axios'

import i18next from 'i18n'
import DialogTitle from "pages/components/DialogTitle";
import { str } from 'helpers';
import UserForm from "./UserForm";
import UserProfile from "./UserProfile";
import env from 'environment';

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.body.background,
  },
}));

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
};

const UserPage = props => {
  const { open, user_id, session, onClose, maxWidth, form, profile, action } = props;
  const [user, setUser] = useState({});
  const [user_friend, setUserFriend] = useState({});
  const [matchmakers, setMatchmakers] = useState([]);
  const [fullScreen, setFullScreen] = useState(props.fullScreen);
  const [tab, setTab] = React.useState(0);
  const classes = useStyles();
  const title = str(user.nickname) + i18next.t('views.user.page_of');

  let index = 0, tab_indexes = {};
  if(form) tab_indexes.form = index++;
  if(profile) tab_indexes.profile = index++;

  useEffect(() => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id + '/' + str(action);
        axios.get(url, {headers})
          .then((results) => {
            setUser(results.data.user);
            setUserFriend(results.data.user_friend);
            setMatchmakers(results.data.matchmakers);
          })
          .catch((data) => {
            alert('データの取得に失敗しました。');
          });
      }
    } else {
      const full_name = session.user.last_name + ' ' + session.user.first_name;
      setMatchmakers([{id: session.user.id, full_name: full_name}]);

      let user2 = Object.assign({}, user);
      user2.matchmaker_id = session.user.id;
      setUser(user2);
    }
  }, [user_id, session.headers]);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const tabChange = (event, newValue) => {
    setTab(newValue);
  };

  const onClose2 = () => {
    onClose(null);
  };

  const onResize = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose2}
        disableBackdropClick={ true }
        disableEscapeKeyDown={ true }
        fullScreen = { fullScreen }
        maxWidth={ maxWidth }
      >
        <DialogTitle title={title} icon={<User />} fullScreen={ fullScreen } onClose={ onClose2 } onResize={ onResize } >
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={tabChange}
            aria-label="simple tabs example"
          >
            { form ? (<Tab label={i18next.t('views.app.edit')} {...a11yProps(tab_indexes.form)} />) : null } }
            { profile ? (<Tab label={i18next.t('views.user.public_profile')} {...a11yProps(tab_indexes.profile)} />) : null }
          </Tabs>
        </DialogTitle>
        <DialogContent className={classes.content}>
          {
            form ?
              (<TabPanel value={tab} index={tab_indexes.form} >
                <UserForm user={user} matchmakers={matchmakers} setUser={setUser} onClose={onClose} />
              </TabPanel>) : null
          }
          {
            profile ?
              (<TabPanel value={tab} index={tab_indexes.profile}>
                <UserProfile user={user} user_friend={user_friend} setUserFriend={setUserFriend} />
              </TabPanel>) : null
          }
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserPage));
