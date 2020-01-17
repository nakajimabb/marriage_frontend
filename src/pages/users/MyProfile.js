import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { Settings } from 'react-feather';

import i18next from 'src/i18n'
import TitleBar from 'src/pages/components/TitleBar';
import QuestionForm from 'src/pages/questions/QuestionForm';
import AppContext from 'src/contexts/AppContext';
import UserRequirement from './UserRequirement';
import UserProfile from './UserProfile';
import UserSelf from './UserSelf';


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
  const [matchmakers, setMatchmakers] = useState([]);
  const title = i18next.t('views.user.account');
  const [tab, setTab] = React.useState(0);

  const tabChange = (event, newValue) => {
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
        <TabPanel value={tab} index={0}>
          <UserSelf user={user} matchmakers={matchmakers} setUser={setUser} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <UserProfile user={user} open />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <QuestionForm user={user} />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <UserRequirement user={user} />
        </TabPanel>
      </Box>
    </React.Fragment>
  );
};

export default withRouter(MyProfile);
