import React, {useContext, useState} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

import env from 'src/environment';
import i18next from 'src/i18n'
import AppContext from 'src/contexts/AppContext';
import CustomizedSnackbar from 'src/pages/components/CustomizedSnackbar';
import axios from "axios";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState('error');

  const handleSubmit = async event => {
    event.preventDefault();

    let url = env.API_ORIGIN + 'api/users/send_reset_password';
    axios.post(url, {email})
      .then((results) => {
        setVariant('success');
        setMessage(i18next.t('views.app.sent_mail'));
      })
      .catch(({response}) => {
        setVariant('error');
        const message = (response.data && response.data.error) ? response.data.error
          : response.status + ' ' + response.statusText;
        setMessage(message);
      });
  };

  return (
    <Wrapper>
      <CustomizedSnackbar
        open={ !!message }
        variant={ variant }
        message={ message }
        onClose={() => setMessage(null)}
      />
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        { i18next.t('devise.passwords.new.forgot_your_password') }
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Enter your email to reset your password
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">{ i18next.attr('user', 'email') }</InputLabel>
          <Input
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={ e => setEmail(e.target.value) }
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          mt={2}
        >
          { i18next.t('devise.passwords.new.send_me_reset_password_instructions') }
        </Button>
        <Button
          component={Link}
          to="/auth/sign-in"
          fullWidth
          color="primary"
        >
          { i18next.t('devise.shared.links.back') }
        </Button>
      </form>
    </Wrapper>
  );
};

export default ResetPassword;
