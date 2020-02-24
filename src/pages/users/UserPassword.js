import React, {useContext, useState} from 'react';
import {
  AppBar,
  FormControl,
  Grid,
  InputLabel,
  Input,
  Toolbar,
  Button,
  makeStyles, Container, Paper,
} from '@material-ui/core';
import axios from 'axios';

import env from 'src/environment';
import i18next from 'src/i18n'
import { str, collectErrors, createFormData } from 'src/helpers';
import CustomizedSnackbar from 'src/pages/components/CustomizedSnackbar';
import AppContext from 'src/contexts/AppContext';


const useStyles = makeStyles(theme => ({
  paper: {
    margin: 40,
    padding: 20,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
}));


// mode => self, matchmaker, head, admin
const UserPassword = props => {
  const {state: {session}} = useContext(AppContext);
  const { user, setUser } = props;
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const classes = useStyles();
  const user_id = user.id;

  const onSave = () => {
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + `api/users/${user_id}`;

      let user_params = createFormData({ id: user.id,
                                         password: user.password,
                                         password_confirmation: user.password_confirmation
                                        }, 'user');

      axios.patch(url, user_params, { headers })
        .then((results) => {
          setErrors({});
          setMessage(i18next.t('views.app.save_done'));
          setUser(results.data.user);
        })
        .catch(({response}) => {
          setErrors(collectErrors(response, 'user'));
        });
    }
  };

  const handleChange = event => {
    setUser({...user, [event.target.name]: event.target.value});
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={ Object.keys(errors).length > 0 }
        variant="error"
        message={
          Object.keys(errors).map((key, i) => {
            return (
              <div key={i}>{errors[key]}</div>
            );
          })
        }
        onClose={() => setErrors({})}
      />
      <CustomizedSnackbar
        open={ !!message }
        variant="info"
        message={ message }
        onClose={() => setMessage(null)}
      />

      <Container maxWidth="xs">
        <Paper className={classes.paper}>
          <form onSubmit={onSave}>
            <FormControl fullWidth>
              <InputLabel htmlFor="password">{ i18next.attr('user', 'password') }</InputLabel>
              <Input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={ str(user.password) }
                onChange={handleChange}
                error={!!errors.password}
              />

              <FormControl fullWidth>
                <InputLabel htmlFor="password_confirmation">{ i18next.attr('user', 'password_confirmation') }</InputLabel>
                <Input
                  name="password_confirmation"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={ str(user.password_confirmation) }
                  onChange={handleChange}
                  error={!!errors.password_confirmation}
                />
              </FormControl>
            </FormControl>
          </form>
        </Paper>
      </Container>

      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            <Grid item>
              <Button onClick={onSave} color="primary">
                {i18next.t('views.app.save')}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default UserPassword;
