import React, { Fragment, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';
import axios from "axios";

import env from 'src/environment';
import { login, logout } from 'src/redux/actions/sessionActions';
import { setTheme } from 'src/redux/actions/themeActions';
import { setNotification } from 'src/redux/actions/notificationActions';
import AppContext from 'src/contexts/AppContext';


const AuthGuard = props => {
  const {state: {session, notification}, dispatch} = useContext(AppContext);
  const { location, history } = props;
  const [user, setUser] = useState(session.user);
  const [count, setCount] = useState(notification.count);
  const str_headers = Cookies.get('headers');
  const headers  = (str_headers ? JSON.parse(str_headers) : null);
  const theme = Cookies.get('theme') || 0;

  const redirectSignIn = () => {
    if(location.pathname !== '/auth/sign-in') {
      dispatch(logout());
      history.push('/auth/sign-in');
    }
  };

  function diff_user(user1, user2) {
    const keys = Object.keys(user1);
    return keys.filter(key => user1[key] !== user2[key])
  }

  const initSession = () => {
    if(headers) {
      const url = env.API_ORIGIN + 'auth/validate_token';
      axios.get(url, { headers })
        .then((results) => {
          let user2 = results.data.data;
          if(diff_user(user2, user).length > 0) {
            setUser(user2);
          }
          setCount(+user2.notification_count || 0);
        })
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
          redirectSignIn();
        });
    } else {
      redirectSignIn();
    }
  };

  useEffect(() => {
    initSession();
  });

  useEffect(() => {
    dispatch(setNotification({count}));
  }, [count, dispatch]);

  useEffect(() => {
    dispatch(setTheme(theme));
  }, [theme, dispatch]);

  useEffect(() => {
    if(Object.keys(user).length > 0) {
      dispatch(login({headers, user}));
    }
  }, [user, dispatch]);

  return (!session.loggedIn || !session.user) ? null : <Fragment>{ props.children }</Fragment>;
};

export default withRouter(AuthGuard);
