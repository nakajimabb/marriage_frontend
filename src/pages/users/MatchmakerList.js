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

  return (
    <React.Fragment>
      <UserList
        title={title}
        icon={<AllInclusive />}
        data={data}
        all
        profile
      />
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(MatchmakerList));
