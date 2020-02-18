import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { login } from 'src/redux/actions/sessionActions';
import { setTheme } from 'src/redux/actions/themeActions';
import AppContext from 'src/contexts/AppContext';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Button,
  Paper,
  Typography
} from '@material-ui/core';

import env from 'src/environment';
import i18next from 'src/i18n'


const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;


const SignIn = props => {
  const { dispatch } = useContext(AppContext);
  const history = useHistory();
  const [user, setUser] = useState({login: '', password: ''});
  const remember_me = false;

  useEffect(() => {
    const theme = Cookies.get('theme') || 0;
    dispatch(setTheme(theme));
  }, [user, dispatch]);

  const handleChange = name => event => {
    setUser({...user, [name]: event.target.value});
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const url = env.API_ORIGIN + 'auth/sign_in';
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    let body = {password: user.password};
    const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // Regular expression for email

    if(user.login.match(re)) {
      body['email'] = user.login;
    } else {
      body['nickname'] = user.login;
    }

    let response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(body)});
    if(response.ok) {
      const headers = {
        'access-token': response.headers.get('access-token'),
        'client': response.headers.get('client'),
        'uid': response.headers.get('uid'),
      };
      let json = await response.json();
      const user2 = json.data;
      dispatch(login({headers, user: user2}));
      history.push('/');
    } else {
      alert(response.status + ' ' + response.statusText);
    }
  };

    return (
      <Wrapper>
        <Typography component="h1" variant="h1" align="center" gutterBottom>
          Special4
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Sign in to your account to continue
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="login"
              name="login"
              label={ i18next.t('views.user.email_or_nickname') }
              autoComplete="nickname"
              autoFocus
              value={user.login}
              onChange={handleChange('login')}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="password"
              name="password"
              type="password"
              label={ i18next.attr('user', 'password') }
              autoComplete="current-password"
              value={user.password}
              onChange={handleChange('password')}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          { remember_me ?
            <FormControlLabel
              control={<Checkbox value="remember" color="primary"/>}
              label={ i18next.attr('user', 'remember_me') }
            /> : null
          }
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            mb={2}
          >
            { i18next.t('devise.sessions.new.sign_in') }
          </Button>
          <Button
            component={Link}
            to="/auth/reset-password"
            fullWidth
            color="primary"
          >
            { i18next.t('devise.shared.links.forgot_your_password') }
          </Button>
        </form>
      </Wrapper>
    );
};

export default SignIn;
