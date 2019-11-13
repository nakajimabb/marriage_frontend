import React, { Component, Fragment } from 'react';
import Cookies from "js-cookie";
import {connect} from "react-redux";
import { withRouter } from "react-router-dom";

import { login, logout } from "../redux/actions/sessionActions";
import { setTheme } from "../redux/actions/themeActions";
import env from '../environment';


class AuthGuard extends Component {
  constructor(props) {
    super(props);

    this.redirectSignIn = this.redirectSignIn.bind(this);
    this.initSession = this.initSession.bind(this);
  }

  redirectSignIn = () => {
    const { location, history, dispatch } = this.props;

    if(location.pathname !== '/auth/sign-in') {
      dispatch(logout());
      history.push('/auth/sign-in');
    }
  };

  initSession = async () => {
    const { dispatch } = this.props;

    let headers = Cookies.get('headers');
    if(headers) {
      const url = env.API_ORIGIN + 'auth/validate_token';
      headers = JSON.parse(headers);

      let response = await fetch(url, {method: 'GET', headers});
      if(response.ok) {
        headers = {
          'access-token': response.headers.get('access-token'),
          'client': response.headers.get('client'),
          'uid': response.headers.get('uid'),
        };
        let json = await response.json();
        const user = json.data;
        dispatch(login({headers, user}));
        const theme = Cookies.get('theme') || 0;
        dispatch(setTheme(theme));
      } else {
        this.redirectSignIn();
      }
    } else {
      this.redirectSignIn();
    }
  };

  componentDidMount() {
    this.initSession();
  }

  render() {
    const { children, session } = this.props;
    return (!session.loggedIn || !session.user) ? null : <Fragment>{children}</Fragment>;
  }
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(AuthGuard));
