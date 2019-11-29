import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Divider,
  Box,
  Tab,
  Tabs,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from 'axios'

import i18next from 'i18n'
import { str } from 'helpers';
import UserForm from "./UserForm";
import UserProfile from "./UserProfile";
import UserRequirement from "./UserRequirement";
import PartnerList from "./PartnerList";
import QuestionForm from "../questions/QuestionForm";
import env from 'environment';

const useStyles = makeStyles(theme => ({
  tabs: {
    backgroundColor: theme.palette.common.white,
  },
  content: {
    backgroundColor: theme.body.background,
    margin: 0,
    padding: 0,
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
  const { user_id, session, onClose, form, profile, requirement, partners, question, action, setTitle } = props;
  const [user, setUser] = useState({});
  const [user_friend, setUserFriend] = useState({});
  const [matchmakers, setMatchmakers] = useState([]);
  const [tab, setTab] = React.useState(0);
  const classes = useStyles();

  let index = 0, tab_indexes = {};
  if(form) tab_indexes.form = index++;
  if(profile) tab_indexes.profile = index++;
  if(requirement) tab_indexes.requirement = index++;
  if(question) tab_indexes.question = index++;
  if(partners) tab_indexes.partners = index++;

  useEffect(() => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id + '/' + str(action);
        axios.get(url, {headers})
          .then((results) => {
            const data = results.data;
            const title = str(data.user.nickname) + i18next.t('views.user.page_of');
            setUser(data.user);
            setUserFriend(data.user_friend);
            setMatchmakers(data.matchmakers);
            setTitle(title);
          })
          .catch(({response}) => {
            setTitle(null);
            alert(response.status + ' ' + response.statusText);
          });
      }
    } else {
      const full_name = session.user.last_name + ' ' + session.user.first_name;
      setMatchmakers([{id: session.user.id, full_name: full_name}]);

      let user2 = Object.assign({}, user);
      const title = i18next.t('views.user.new');
      user2.matchmaker_id = session.user.id;
      setUser(user2);
      setTitle(title);
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

  return (
    <React.Fragment>
      {
        (Object.keys(tab_indexes).length >= 2) ? (
          <React.Fragment>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={tabChange}
              className={classes.tabs}
            >
              { form ? (<Tab label={i18next.t('views.app.edit')} {...a11yProps(tab_indexes.form)} />) : null } }
              { profile ? (<Tab label={i18next.t('views.user.public_profile')} {...a11yProps(tab_indexes.profile)} />) : null }
              { requirement ? (<Tab label={i18next.model('requirement')} {...a11yProps(tab_indexes.requirement)} />) : null }
              { question ? (<Tab label={i18next.model('question')} {...a11yProps(tab_indexes.question)} />) : null }
              { partners ? (<Tab label={i18next.t('views.user.partner_matches')} {...a11yProps(tab_indexes.partners)} />) : null }
            </Tabs>
            <Divider />
          </React.Fragment>
        ) : null
      }
      <Box className={classes.content}>
        {
          form ?
            (<TabPanel value={tab} index={tab_indexes.form} style={{position: 'relative'}}>
              <UserForm user={user} matchmakers={matchmakers} setUser={setUser} onClose={onClose} />
            </TabPanel>) : null
        }
        {
          profile ?
            (<TabPanel value={tab} index={tab_indexes.profile}>
              <UserProfile user={user} user_friend={user_friend} setUserFriend={setUserFriend} onClose={onClose} />
            </TabPanel>) : null
        }
        {
          requirement ?
            (<TabPanel value={tab} index={tab_indexes.requirement}>
              <UserRequirement user={user} onClose={onClose} />
            </TabPanel>) : null
        }
        {
          question ?
            (<TabPanel value={tab} index={tab_indexes.question}>
              <QuestionForm user={user} onClose={onClose} />
            </TabPanel>) : null
        }
        {
          partners ?
            (<TabPanel value={tab} index={tab_indexes.partners}>
              <PartnerList user={user} all onClose={onClose} />
            </TabPanel>) : null
        }
      </Box>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserPage));
