import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { login } from "../../redux/actions/sessionActions";
import { setTheme } from "../../redux/actions/themeActions";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

import env from '../../environment';
import Cookies from "js-cookie";


const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;


class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const { dispatch, history } = this.props;

    const url = env.API_ORIGIN + 'auth/sign_in';
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    const body = {email: this.state.email, password: this.state.password};

    let response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(body)});
    if(response.ok) {
      const headers = {
        'access-token': response.headers.get('access-token'),
        'client': response.headers.get('client'),
        'uid': response.headers.get('uid'),
      };
      let json = await response.json();
      const user = json.data;
      dispatch(login({headers, user}));
      const theme = Cookies.get('theme') || 0;
      dispatch(setTheme(theme));
      history.push('/');
    } else {
      alert("ログインに失敗しました。(" + response.status + ' ' + response.statusText + ')');
    }
  };

  render() {
    return (
      <Wrapper>
        <Typography component="h1" variant="h1" align="center" gutterBottom>
          Special4
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Sign in to your account to continue
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus value={this.state.email} onChange={this.handleChange('email')} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.handleChange('password')}
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
  }
}

export default connect(store => ({ session: store.sessionReducer }))(SignIn);
