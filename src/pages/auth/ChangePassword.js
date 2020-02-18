import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router';
import {useParams} from 'react-router-dom';
import {
  FormControl,
  TextField,
  Button,
  Paper,
  Typography
} from '@material-ui/core';

import env from 'src/environment';
import i18next from 'src/i18n'
import AppContext from 'src/contexts/AppContext';
import CustomizedSnackbar from 'src/pages/components/CustomizedSnackbar';
import { login } from 'src/redux/actions/sessionActions';
import axios from "axios";
import styled from "styled-components";


const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const UserAccept = () => {
  const {dispatch} = useContext(AppContext);
  const {reset_password_token} = useParams();
  const [user, setUser] = useState({password: '', password_confirmation: ''});
  const [message, setMessage] = useState(null);
  const history = useHistory();

  const handleChange = name => event => {
    setUser({...user, [name]: event.target.value});
  };

  const handleSignIn = async email => {
    const url = env.API_ORIGIN + 'auth/sign_in';
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    let body = {email: email, password: user.password};

    let response = await fetch(url, {method: 'POST', headers, body: JSON.stringify(body)});
    if(response.ok) {
      const headers = {
        'access-token': response.headers.get('access-token'),
        'client': response.headers.get('client'),
        'uid': response.headers.get('uid'),
      };
      let json = await response.json();
      dispatch(login({headers, user: json.data}));
      history.push('/');
    } else {
      const message = response.status + ' ' + response.statusText;
      setMessage(message);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    let url = env.API_ORIGIN + 'api/users/reset_password';
    const {password, password_confirmation} = user;
    axios.post(url, {reset_password_token, password, password_confirmation})
      .then((results) => {
        handleSignIn(results.data.user.email);
      })
      .catch(({response}) => {
        const message = (response.data && response.data.error) ? response.data.error
          : response.status + ' ' + response.statusText;
        setMessage(message);
      });
  };

  return (
    <React.Fragment>
      <Wrapper>
        <CustomizedSnackbar
          open={ !!message }
          variant="error"
          message={message}
          onClose={() => setMessage(null)}
        />
        <Typography component="h2" variant="body1" align="center">
          { i18next.t('devise.passwords.edit.change_my_password') }
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="password"
              name="password"
              type="password"
              required
              label={ i18next.attr('user', 'password') }
              autoComplete="current-password"
              value={user.password}
              onChange={handleChange('password')}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              label={ i18next.attr('user', 'password_confirmation') }
              autoComplete="current-password"
              value={user.password_confirmation}
              onChange={handleChange('password_confirmation')}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            mb={2}
          >
            { i18next.t('devise.passwords.edit.change_my_password') }
          </Button>
        </form>
      </Wrapper>
    </React.Fragment>
  );
};

export default UserAccept;
