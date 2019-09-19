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

import env from "../../environment";


class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: null,
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { open, user_id } = this.props;
    if(open && user_id != this.state.user_id) {
      if(user_id) {
        this.updateData(this.props.user_id);
      } else {
        this.setState({user_id: null, data: {}});
      }
    }
  }

  handleChange = event => {
    let data = Object.assign({}, this.state.data);
    data[event.target.name] = event.target.value;
    this.setState({ data });
  };

  updateData = async (user_id) =>  {
    const { session } = this.props;

    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/' + user_id;
      axios.get(url, {headers})
      .then((results) => {
        console.log(results);
        this.setState({user_id: user_id, data: results.data.user});
      })
      .catch((data) => {
        alert('データの取得に失敗しました。');
      });
    }
  };

  onSave = async () => {
    const { session } = this.props;
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
        alert('社員を保存しました。');
      })
      .catch((data) =>{
        alert('社員の保存に失敗しました。');
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
        <DialogTitle id="simple-dialog-title">{String(data.last_name) + String(data.first_name)}'s profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item md={6}>
              <FormControl fullWidth mb={3}>
                <InputLabel htmlFor="name">Last name</InputLabel>
                <Input
                  name="last_name"
                  defaultValue=""
                  placeholder="Last name"
                  value={ String(data.last_name) } p
                  onChange={this.handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <FormControl fullWidth mb={3}>
                <InputLabel htmlFor="name">First name</InputLabel>
                <Input
                  name="first_name"
                  defaultValue=""
                  value={ String(data.first_name) }
                  placeholder="First name"
                  onChange={this.handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>


          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="sex">Sex</InputLabel>
            <Select
              value={ String(data.sex) }
              onChange={this.handleChange}
              inputProps={{
                name: "sex",
                id: "user_sex"
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value='male'>male</MenuItem>
              <MenuItem value='female'>female</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              name="email"
              type="email"
              defaultValue=""
              placeholder="Email"
              value={ String(data.email) } p
              onChange={this.handleChange}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="nickname">nickname</InputLabel>
            <Input
              name="nickname"
              defaultValue=""
              placeholder="nickname"
              value={ String(data.nickname) } p
              onChange={this.handleChange}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="birthday"
              label="Birthday"
              type="date"
              defaultValue=""
              value={ String(data.birthday) } p
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="bio"
              label="bio"
              multiline
              rowsMax="4"
              value={ String(data.bio) }
              onChange={this.handleChange}
              m={2}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password">password</InputLabel>
            <Input
              name="password"
              defaultValue=""
              type="password"
              value={ String(data.password) }
              onChange={this.handleChange}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password_confirmation">password confirmation</InputLabel>
            <Input
              name="password_confirmation"
              defaultValue=""
              type="password"
              value={ String(data.password_confirmation) }
              onChange={this.handleChange}
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
