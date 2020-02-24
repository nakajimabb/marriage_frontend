import React, {Suspense, lazy, useContext, useState, useEffect} from 'react';
import {Box, CircularProgress, Tab, Tabs, Typography, makeStyles} from '@material-ui/core';
import { Settings } from 'react-feather';

import env from 'src/environment';
import i18next from 'src/i18n'
import TitleBar from 'src/pages/components/TitleBar';
import QuestionForm from 'src/pages/questions/QuestionForm';
import AppContext from 'src/contexts/AppContext';
import axios from "axios";

const UserForm = lazy(() => import('./UserForm'));
const UserProfile = lazy(() => import('./UserProfile'));
const UserPassword = lazy(() => import('./UserPassword'));
const UserRequirement = lazy(() => import('./UserRequirement'));


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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MyProfile = () => {
  const {state: {session}} = useContext(AppContext);
  const [user, setUser] = useState(session.user);
  const title = i18next.t('views.user.account');
  const [tab, setTab] = React.useState(0);
  const [flags, setFlags] = useState({0: true});

  useEffect(() => {
    const user_id = user.id;
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + `api/users/${user_id}/edit`;
      axios.get(url, {headers})
        .then((results) => {
          setUser(results.data.user);
        })
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
        });
    }
  }, [session.headers, session.user]);

  const tabChange = (event, newValue) => {
    setFlags({...flags, [newValue]: true});
    setTab(newValue);
  };

  return (
    <React.Fragment>
      <TitleBar title={title} icon={<Settings />} variant="dense" >
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={tabChange}
          aria-label="simple tabs example"
        >
          <Tab label={i18next.t('views.user.edit_self')} {...a11yProps(0)} />
          <Tab label={i18next.t('views.user.edit_password')} {...a11yProps(1)} />
          <Tab label={i18next.t('views.user.public_profile')} {...a11yProps(2)} />
          <Tab label={i18next.model('question')} {...a11yProps(3)} />
          <Tab label={i18next.model('requirement')} {...a11yProps(4)} />
        </Tabs>
      </TitleBar>
      <Box>
        <Suspense fallback={<CircularProgress />}>
          <TabPanel value={tab} index={0}>
            { flags[0] ? <UserForm user={user} setUser={setUser} mode={'self'}/> : null }
          </TabPanel>
          <TabPanel value={tab} index={1}>
            { flags[1] ? <UserPassword user={user} setUser={setUser} /> : null }
          </TabPanel>
          <TabPanel value={tab} index={2}>
            { flags[2] ? <UserProfile user={user} open /> : null }
          </TabPanel>
          <TabPanel value={tab} index={3}>
            { flags[3] ? <QuestionForm user={user} /> : null }
          </TabPanel>
          <TabPanel value={tab} index={4}>
            { flags[4] ? <UserRequirement user={user} /> : null }
          </TabPanel>
        </Suspense>
      </Box>
    </React.Fragment>
  );
};

export default MyProfile;
