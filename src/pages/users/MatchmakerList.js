import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Tabs, Tab, Typography } from "@material-ui/core";
import { AllInclusive } from "@material-ui/icons";
import axios from 'axios'

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import TitleBar from "pages/components/TitleBar";
import UserList from "./UserList";
import env from 'environment';


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

const MatchmakerList = props => {
  const { dispatch, session, history } = props;
  const [data, setData] = useState([]);
  const title = i18next.t('views.user.matchmakers');
  const [tab, setTab] = React.useState(0);

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/matchmakers';
      axios.get(url, {headers})
        .then((results) => {
          setData(results.data.users);
        })
        .catch((data) => {
          alert('データの取得に失敗しました。');
        });
    }
    else {
      dispatch(logout());
      history.push('/auth/sign-in');
    }
  }, [session.headers]);

  const tabChange = (event, newValue) => {
    setTab(newValue);
  };

  const filterMatchMakers = (data, options) => {
    return data.filter(user => Object.keys(options).every(column => user[column] == options[column]));
  };

  function updateUser(user_id) {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id;
        axios.get(url, {headers})
          .then((results) => {
            let user = results.data.user;
            let data2 = Array.from(data);
            const index = data.findIndex(u => u.id == user.id)
            if(~index) {
              data2[index] = user;
            } else {
              data2.push(user)
            }
            setData(data2);
          })
          .catch((data) => {
            alert('データの取得に失敗しました。');
          });
      }
    }
  }

  return (
    <React.Fragment>
      <TitleBar title={title} icon={<AllInclusive />} >
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={tabChange}
          aria-label="simple tabs example"
        >
          <Tab label={i18next.t('views.app.list')} {...a11yProps(0)} />
          <Tab label={i18next.t('views.user.matchmaker_public')} {...a11yProps(1)} />
          <Tab label={i18next.t('views.user.matchmaker_friend')} {...a11yProps(2)} />
        </Tabs>
      </TitleBar>

      <Box px={3}>
        <TabPanel value={tab} index={0}>
          <UserList data={data} all updateUser={updateUser} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <UserList data={filterMatchMakers(data, {member_sharing: 'member_public'})} all updateUser={updateUser} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <UserList data={filterMatchMakers(data, {friend: true})} all updateUser={updateUser} />
        </TabPanel>
      </Box>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(MatchmakerList));
