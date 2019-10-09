import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input,
  Avatar,
  Checkbox,
  FormGroup,
} from "@material-ui/core";

import i18next from 'i18n'
import env from "environment";
import { str, collectErrors, createFormData } from 'helpers';
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";
import DialogTitle from "pages/components/DialogTitle";


class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: null,
      user: {},
      errors: {},
      fullScreen: this.props.fullScreen,
    };
    this.avatar = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeChecked = this.handleChangeChecked.bind(this);
    this.showUser = this.showUser.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onResize = this.onResize.bind(this);
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

  handleChangeChecked = event => {
    let user = Object.assign({}, this.state.user);
    user[event.target.name] = event.target.checked;
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

  onResize = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  };

  render() {
    const { open, onClose, maxWidth } = this.props;
    const { user, fullScreen } = this.state;
    const countries  = i18next.data_list('country');
    const prefectures  = i18next.data_list('prefecture');
    const religions  = i18next.data_list('enum', 'user', 'religion');

    return (
      <Dialog
        open={open}
        onClose={onClose}
        disableBackdropClick={ true }
        disableEscapeKeyDown={ true }
        fullScreen = { fullScreen }
        maxWidth={ maxWidth }
      >
        <DialogTitle fullScreen={ fullScreen } onClose={ onClose } onResize={ this.onResize } >
          {str(user.last_name) + str(user.first_name)}
        </DialogTitle>
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

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <TextField
                  name="last_name"
                  label={ i18next.attr('user', 'last_name') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.last_name) }
                  onChange={this.handleChange}
                  error={this.state.errors.last_name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="first_name"
                  label={ i18next.attr('user', 'first_name') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.first_name) }
                  onChange={this.handleChange}
                  error={this.state.errors.first_name}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <TextField
                  name="last_name_kana"
                  label={ i18next.attr('user', 'last_name_kana') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.last_name_kana) }
                  onChange={this.handleChange}
                  error={this.state.errors.last_name_kana}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="first_name_kana"
                  label={ i18next.attr('user', 'first_name_kana') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.first_name_kana) }
                  onChange={this.handleChange}
                  error={this.state.errors.first_name_kana}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="email"
              label={ i18next.attr('user', 'email') }
              type="email"
              autoComplete="off"
              defaultValue=""
              value={ str(user.email) }
              onChange={this.handleChange}
              error={this.state.errors.email}
              fullWidth
            />
          </FormControl>

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
              fullWidth
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              <MenuItem value='male'>{ i18next.enum('user', 'sex', 'male') }</MenuItem>
              <MenuItem value='female'>{ i18next.enum('user', 'sex', 'female') }</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <FormGroup aria-label="position" name="position" row >
              <FormControlLabel
                control={<Checkbox name="courtship" checked={ !!user.courtship } onChange={ this.handleChangeChecked } value={ 1 } />}
                label= { i18next.attr('user', 'courtship') }
              />
              <FormControlLabel
                control={<Checkbox name="matchmaker" checked={ !!user.matchmaker } onChange={ this.handleChangeChecked } value={ 1 } />}
                label= { i18next.attr('user', 'matchmaker') }
              />
            </FormGroup>
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
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="nickname"
              label={ i18next.attr('user', 'nickname') }
              autoComplete="off"
              defaultValue=""
              value={ str(user.nickname) }
              onChange={this.handleChange}
              error={this.state.errors.nickname}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <InputLabel htmlFor="religion">{ i18next.attr('user', 'religion') }</InputLabel>
                <Select
                  value={ str(user.religion) }
                  onChange={this.handleChange}
                  inputProps={{
                    name: "religion",
                    id: "user_religion"
                  }}
                  error={this.state.errors.religion}
                  fullWidth
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  {
                    Object.keys(religions).map(religion => <MenuItem value={religion}>{ religions[religion] }</MenuItem>)
                  }
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sect_name"
                  label={ i18next.attr('user', 'sect_name') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.sect_name) }
                  onChange={this.handleChange}
                  error={this.state.errors.sect_name}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="lang">{ i18next.attr('user', 'lang') }</InputLabel>
            <Select
              value={ str(user.lang) }
              onChange={this.handleChange}
              inputProps={{
                name: "lang",
                id: "user_lang"
              }}
              error={this.state.errors.lang}
              fullWidth
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              <MenuItem value='en'>{ i18next.t('lang.en') }</MenuItem>
              <MenuItem value='ja'>{ i18next.t('lang.ja') }</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <InputLabel htmlFor="country">{ i18next.attr('user', 'country') }</InputLabel>
                <Select
                  value={ str(user.country) }
                  onChange={this.handleChange}
                  inputProps={{
                    name: "country",
                    id: "user_country"
                  }}
                  error={this.state.errors.country}
                  fullWidth
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  {
                    Object.keys(countries).map(country => <MenuItem value={country}>{ countries[country] }</MenuItem>)
                  }
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="zip"
                  label={ i18next.attr('user', 'zip') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.zip) }
                  onChange={this.handleChange}
                  error={this.state.errors.zip}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <InputLabel htmlFor="prefecture">{ i18next.attr('user', 'prefecture') }</InputLabel>
                <Select
                  value={ str(user.prefecture) }
                  onChange={this.handleChange}
                  inputProps={{
                    name: "prefecture",
                    id: "user_prefecture"
                  }}
                  error={this.state.errors.prefecture}
                  fullWidth
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  {
                    Object.keys(prefectures).map(prefecture => <MenuItem value={prefecture}>{ prefectures[prefecture] }</MenuItem>)
                  }
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="city"
                  label={ i18next.attr('user', 'city') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.city) }
                  onChange={this.handleChange}
                  error={this.state.errors.city}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              name="house_number"
              label={ i18next.attr('user', 'house_number') }
              autoComplete="off"
              defaultValue=""
              value={ str(user.house_number) }
              onChange={this.handleChange}
              error={this.state.errors.house_number}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <TextField
                  name="tel"
                  label={ i18next.attr('user', 'tel') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.tel) }
                  onChange={this.handleChange}
                  error={this.state.errors.tel}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="fax"
                  label={ i18next.attr('user', 'fax') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.fax) }
                  onChange={this.handleChange}
                  error={this.state.errors.fax}
                  fullWidth
                />
              </Grid>
            </Grid>
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
