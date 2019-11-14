import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import { Settings } from "react-feather";

import i18next from 'i18n'
import TitleBar from "pages/components/TitleBar";
import UserProfile from "./UserProfile";
import UserSelf from "./UserSelf";


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

const MyProfile = props => {
  const { session } = props;
  const [user, setUser] = useState(session.user);
  const [matchmakers, setMatchmakers] = useState([]);
  const title = i18next.t('views.user.account');
  const [tab, setTab] = React.useState(0);

  const tabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <React.Fragment>
      <TitleBar title={title} icon={<Settings />} >
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={tabChange}
          aria-label="simple tabs example"
        >
          <Tab label={i18next.t('views.user.edit_self')} {...a11yProps(0)} />
          <Tab label={i18next.t('views.user.public_profile')} {...a11yProps(1)} />
        </Tabs>
      </TitleBar>
      <Box p={6}>
        <TabPanel value={tab} index={0}>
          <UserSelf user={user} matchmakers={matchmakers} setUser={setUser} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <UserProfile user={user} open />
        </TabPanel>
      </Box>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(MyProfile));
