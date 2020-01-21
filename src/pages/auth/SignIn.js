import React, { useContext, useState, useEffect } from 'react';
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
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from '@material-ui/core';
import { spacing } from '@material-ui/system';

import env from 'src/environment';


const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;


const SignIn = props => {
  const { dispatch } = useContext(AppContext);
  const { history } = props;
  const [user, setUser] = useState({});

  useEffect(() => {
    const theme = Cookies.get('theme') || 0;
    dispatch(setTheme(theme));
  }, [user, dispatch]);

  const handleChange = name => event => {
    let user2 = Object.assign({}, user);
    user2[name] = event.target.value;
    setUser(user2);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const url = env.API_ORIGIN + 'auth/sign_in';
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    const body = {nickname: user.nickname, password: user.password};

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
            <InputLabel htmlFor="nickname">nickname</InputLabel>
            <Input id="nickname" name="nickname" autoComplete="nickname" autoFocus value={user.nickname} onChange={handleChange('nickname')} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={handleChange('password')}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary"/>}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            mb={2}
          >
            Sign in
          </Button>
          <Button
            component={Link}
            to="/auth/reset-password"
            fullWidth
            color="primary"
          >
            Forgot password
          </Button>
        </form>
      </Wrapper>
    );
};

export default SignIn;
