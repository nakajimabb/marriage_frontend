import React, {useContext, useState} from "react";
import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel, Select,
  TextField
} from "@material-ui/core";

import env from 'src/environment';
import i18next from 'src/i18n'
import { str } from 'src/helpers';
import AppContext from 'src/contexts/AppContext';
import CustomizedSnackbar from 'src/pages/components/CustomizedSnackbar';
import axios from "axios";


const UserInvitation = props => {
  const {open, handleClose} = props;
  const [user, setUser] = useState({email: '', sex: ''});
  const [message, setMessage] = useState(null);
  const {state: {session}} = useContext(AppContext);

  const handleChange = event => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    setUser({...user, [event.target.name]: value});
  };

  const handleSubmit = event => {
    event.preventDefault();
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + `api/users/invite`;
      axios.post(url, {email: user.email, sex: user.sex}, { headers })
        .then((results) => {
          handleClose();
        })
        .catch(({response}) => {
          const message = (response.data && response.data.error) ? response.data.error
            : response.status + ' ' + response.statusText;
          setMessage(message);
        });
    }
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={ !!message }
        variant="error"
        message={message}
        onClose={() => setMessage(null)}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">{ i18next.t('views.user.invite_user') }</DialogTitle>
          <DialogContent>
            <DialogContentText>
              { i18next.t('views.user.invite_user_subtitle') }
            </DialogContentText>
            <Grid container spacing={4} >
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="name"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
                  <Select
                    native
                    required
                    value={ str(user.sex) }
                    onChange={handleChange}
                    inputProps={{
                      name: "sex",
                      id: "user_sex",
                    }}
                    fullWidth
                  >
                    <option value="" />
                    <option value="male">{ i18next.enum('user', 'sex', 'male') }</option>
                    <option value="female">{ i18next.enum('user', 'sex', 'female') }</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              { i18next.t('views.app.cancel') }
            </Button>
            <Button type="submit" color="primary">
              { i18next.t('views.user.send_invitation') }
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default UserInvitation;
