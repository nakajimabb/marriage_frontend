import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input, Avatar
} from "@material-ui/core";

import i18next from 'i18n'
import env from "environment";
import { str, collectErrors, createFormData } from 'helpers';
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";


class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: null,
      user: {},
      errors: {},
    };
    this.avatar = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.showUser = this.showUser.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    const { user_id } = this.props;
    if(user_id) {
      this.showUser(this.props.user_id);
    } else {
      this.setState({user_id: null, user: {}, errors: {}});
    }
  }

  handleChange = event => {
    let user = Object.assign({}, this.state.user);
    user[event.target.name] = event.target.value;
    this.setState({ user });
  };

  showUser = async (user_id) =>  {
    const { session } = this.props;

    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/' + user_id;
      axios.get(url, {headers})
      .then((results) => {
        let user = results.data.user;
        user.password = user.password_confirmation = '';
        this.setState({user_id, user, errors: {}});
      })
      .catch((data) => {
        alert('データの取得に失敗しました。');
      });
    }
  };

  onSave = async () => {
    const { session, onClose } = this.props;
    const { user_id, user } = this.state;
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/users/';
      if(user_id) url += user_id;

      let promise;
      let user_params = createFormData(user, 'user');

      const avatar = document.getElementById('avatar');
      if(avatar.files.length > 0) {
        user_params.append('user[avatar]', avatar.files[0]);
      }

      if(user_id) {
        promise = axios.patch(url, user_params, { headers });
      } else {
        promise = axios.post(url, user_params, { headers });
      }

      promise
      .then((results) => {
        this.setState({errors: {}});
        onClose();
      })
      .catch((data) => {
        this.setState({errors: collectErrors(data.response)});
      });
    }
  };

  render() {
    const { open, onClose } = this.props;
    const { user } = this.state;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        disableBackdropClick={ true }
        disableEscapeKeyDown={ true }
      >
        <DialogTitle id="simple-dialog-title">{str(user.last_name) + str(user.first_name)}</DialogTitle>
        <DialogContent>
          { (Object.keys(this.state.errors).length > 0) ?
            (<CustomizedSnackbar
              variant="error"
              message={
                Object.keys(this.state.errors).map(key => {
                  return (
                    <div>{this.state.errors[key]}</div>
                  );
                })
              }
            />) : null
          }

          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Avatar
              alt={ str(user.nickname) }
              src={ user.avatar_url }
              style={ {width: 160, height: 160} }
            />
            <FormControl fullWidth >
              <input
                id="avatar"
                name="avatar"
                type="file"
                ref={ this.avatar }
              />
            </FormControl>
          </Grid>

          <Grid container spacing={6}>
            <Grid item md={6}>
              <FormControl fullWidth mb={3}>
                <InputLabel htmlFor="name">{ i18next.attr('user', 'last_name') }</InputLabel>
                <Input
                  name="last_name"
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.last_name) }
                  onChange={this.handleChange}
                  error={this.state.errors.last_name}
                />
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <FormControl fullWidth mb={3}>
                <InputLabel htmlFor="name">{ i18next.attr('user', 'first_name') }</InputLabel>
                <Input
                  name="first_name"
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.first_name) }
                  onChange={this.handleChange}
                  error={this.state.errors.first_name}
                />
              </FormControl>
            </Grid>
          </Grid>


          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
            <Select
              value={ str(user.sex) }
              onChange={this.handleChange}
              inputProps={{
                name: "sex",
                id: "user_sex"
              }}
              error={this.state.errors.sex}
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              <MenuItem value='male'>{ i18next.enum('user', 'sex', 'male') }</MenuItem>
              <MenuItem value='female'>{ i18next.enum('user', 'sex', 'female') }</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="email">{ i18next.attr('user', 'email') }</InputLabel>
            <Input
              name="email"
              type="email"
              autoComplete="off"
              defaultValue=""
              value={ str(user.email) }
              onChange={this.handleChange}
              error={this.state.errors.email}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="nickname">{ i18next.attr('user', 'nickname') }</InputLabel>
            <Input
              name="nickname"
              autoComplete="off"
              defaultValue=""
              value={ str(user.nickname) }
              onChange={this.handleChange}
              error={this.state.errors.nickname}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="birthday"
              label={ i18next.attr('user', 'birthday') }
              type="date"
              autoComplete="off"
              defaultValue=""
              value={ str(user.birthday) }
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
              error={this.state.errors.birthday}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="bio"
              label={ i18next.attr('user', 'bio') }
              autoComplete="off"
              multiline
              rowsMax="4"
              value={ str(user.bio) }
              onChange={this.handleChange}
              m={2}
              error={this.state.errors.bio}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password">{ i18next.attr('user', 'password') }</InputLabel>
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              value={ str(user.password) }
              onChange={this.handleChange}
              error={this.state.errors.password}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password_confirmation">{ i18next.attr('user', 'password_confirmation') }</InputLabel>
            <Input
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={ str(user.password_confirmation) }
              onChange={this.handleChange}
              error={this.state.errors.password_confirmation}
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            { i18next.t('dict.cancel') }
          </Button>
          <Button onClick={this.onSave} color="primary">
            { i18next.t('dict.save') }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserForm));
