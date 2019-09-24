import React from "react";
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
  Input
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios'
import i18next from 'i18next'

import env from "../../environment";
import { str } from '../../tools/str';
import CustomizedSnackbar from "../components/CustomizedSnackbar";


const collectErrors = (response) => {
  let errors = {};
  if (response.status === 500) {
    const data_errors = response.data.errors;
    const fields = Object.keys(data_errors);
    fields.forEach(field => {
      data_errors[field].forEach(message => {
        errors[field] = i18next.attr('user', field) + message;
      })
    });
  } else {
    errors.base = response.status + ' ' + response.statusText;
  }
  return errors
};

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: null,
      data: {},
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.showUser = this.showUser.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { open, user_id } = this.props;
    if(open && user_id != this.state.user_id) {
      if(user_id) {
        this.showUser(this.props.user_id);
      } else {
        this.setState({user_id: null, data: {}, errors: {}});
      }
    }
  }

  handleChange = event => {
    let data = Object.assign({}, this.state.data);
    data[event.target.name] = event.target.value;
    this.setState({ data });
  };

  showUser = async (user_id) =>  {
    const { session } = this.props;

    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/' + user_id;
      axios.get(url, {headers})
      .then((results) => {
        console.log(results);
        this.setState({user_id: user_id, data: results.data.user, errors: {}});
      })
      .catch((data) => {
        alert('データの取得に失敗しました。');
      });
    }
  };

  onSave = async () => {
    const { session, onClose } = this.props;
    const { user_id, data } = this.state;

    const headers  = session.headers;
    let body = {user: data};

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/users/';
      if(user_id) url += user_id;

      let promise;
      if(user_id) {
        promise = axios.patch(url, body, { headers });
      } else {
        promise = axios.post(url, body, { headers });
      }

      promise
      .then((results) => {
        onClose();
      })
      .catch((data) => {
        this.setState({errors: collectErrors(data.response)});
      });
    }
  };

  render() {
    const { open, onClose } = this.props;
    const { data } = this.state;

    return (
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle id="simple-dialog-title">{str(data.last_name) + str(data.first_name)}</DialogTitle>
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

          <Grid container spacing={6}>
            <Grid item md={6}>
              <FormControl fullWidth mb={3}>
                <InputLabel htmlFor="name">{ i18next.attr('user', 'last_name') }</InputLabel>
                <Input
                  name="last_name"
                  defaultValue=""
                  value={ str(data.last_name) } p
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
                  defaultValue=""
                  value={ str(data.first_name) }
                  onChange={this.handleChange}
                  error={this.state.errors.first_name}
                />
              </FormControl>
            </Grid>
          </Grid>


          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
            <Select
              value={ str(data.sex) }
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
              defaultValue=""
              value={ str(data.email) } p
              onChange={this.handleChange}
              error={this.state.errors.email}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="nickname">{ i18next.attr('user', 'nickname') }</InputLabel>
            <Input
              name="nickname"
              defaultValue=""
              value={ str(data.nickname) } p
              onChange={this.handleChange}
              error={this.state.errors.nickname}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="birthday"
              label={ i18next.attr('user', 'birthday') }
              type="date"
              defaultValue=""
              value={ str(data.birthday) } p
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
              multiline
              rowsMax="4"
              value={ str(data.bio) }
              onChange={this.handleChange}
              m={2}
              error={this.state.errors.bio}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password">{ i18next.attr('user', 'password') }</InputLabel>
            <Input
              name="password"
              defaultValue=""
              type="password"
              value={ str(data.password) }
              onChange={this.handleChange}
              error={this.state.errors.password}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password_confirmation">{ i18next.attr('user', 'password_confirmation') }</InputLabel>
            <Input
              name="password_confirmation"
              defaultValue=""
              type="password"
              value={ str(data.password_confirmation) }
              onChange={this.handleChange}
              error={this.state.errors.password_confirmation}
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserForm));
