import React, { Suspense, lazy, useContext, useState } from 'react';
import {Box, CircularProgress, Tab, Tabs, Typography} from '@material-ui/core';
import { Settings } from 'react-feather';

import i18next from 'src/i18n'
import TitleBar from 'src/pages/components/TitleBar';
import QuestionForm from 'src/pages/questions/QuestionForm';
import AppContext from 'src/contexts/AppContext';

const UserForm = lazy(() => import('./UserForm'));
const UserProfile = lazy(() => import('./UserProfile'));
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
          <Tab label={i18next.t('views.user.public_profile')} {...a11yProps(1)} />
          <Tab label={i18next.model('question')} {...a11yProps(2)} />
          <Tab label={i18next.model('requirement')} {...a11yProps(3)} />
        </Tabs>
      </TitleBar>
      <Box>
        <Suspense fallback={<CircularProgress />}>
          <TabPanel value={tab} index={0}>
            { flags[0] ? <UserForm user={user} setUser={setUser} mode={'self'}/> : null }
          </TabPanel>
          <TabPanel value={tab} index={1}>
            { flags[1] ? <UserProfile user={user} open /> : null }
          </TabPanel>
          <TabPanel value={tab} index={2}>
            { flags[2] ? <QuestionForm user={user} /> : null }
          </TabPanel>
          <TabPanel value={tab} index={3}>
            { flags[3] ? <UserRequirement user={user} /> : null }
          </TabPanel>
        </Suspense>
      </Box>
    </React.Fragment>
  );
};

export default MyProfile;
