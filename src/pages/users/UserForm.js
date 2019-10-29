import React, { useState, useEffect, useRef } from "react";
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
import { makeStyles } from '@material-ui/core/styles';

import i18next from 'i18n'
import env from "environment";
import { str, collectErrors, createFormData } from 'helpers';
import CustomizedSnackbar from "pages/components/CustomizedSnackbar";
import DialogTitle from "pages/components/DialogTitle";
import ReactSelect from "pages/components/ReactSelect";


const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.body.background,
  },
}));

const UserForm = props => {

  const { open, user_id, session, onClose, maxWidth } = props;
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const [fullScreen, setFullScreen] = useState(props.fullScreen);
  const avatar = useRef();
  const countries  = i18next.data_list('country');
  const prefectures  = i18next.data_list('prefecture');
  const religions  = i18next.data_list('enum', 'user', 'religion');
  const classes = useStyles();

  useEffect(() => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id;
        axios.get(url, {headers})
            .then((results) => {
              let user2 = results.data.user;
              user2.password = user2.password_confirmation = '';
              setUser(user2);
              setErrors({})
            })
            .catch((data) => {
              alert('データの取得に失敗しました。');
            });
      }
    }
  }, [user_id, session.headers]);

  const handleChange = event => {
    let user2 = Object.assign({}, user);
    user2[event.target.name] = event.target.value;
    setUser(user2);
  };

  const handleChangeSelect = name => event => {
    let user2 = Object.assign({}, user);
    if(event) user2[name] = event.value;
    else      user2[name] = null;
    setUser(user2);
  };

  const handleChangeChecked = event => {
    let user2 = Object.assign({}, user);
    user2[event.target.name] = event.target.checked;
    setUser(user2);
  };

  const onSave = async () => {
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
        setErrors({});
        onClose();
      })
      .catch((data) => {
        setErrors(collectErrors(data.response));
      });
    }
  };

  const onResize = () => {
    setFullScreen(!fullScreen);
  };

  return (
      <Dialog
        open={open}
        onClose={onClose}
        disableBackdropClick={ true }
        disableEscapeKeyDown={ true }
        fullScreen = { fullScreen }
        maxWidth={ maxWidth }
      >
        <DialogTitle fullScreen={ fullScreen } onClose={ onClose } onResize={ onResize } >
          {str(user.last_name) + str(user.first_name)}
        </DialogTitle>
        <DialogContent className={classes.content}>
          { (Object.keys(errors).length > 0) ?
            (<CustomizedSnackbar
              variant="error"
              message={
                Object.keys(errors).map(key => {
                  return (
                    <div>{errors[key]}</div>
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
                ref={ avatar }
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
                  onChange={handleChange}
                  error={errors.last_name}
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
                  onChange={handleChange}
                  error={errors.first_name}
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
                  onChange={handleChange}
                  error={errors.last_name_kana}
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
                  onChange={handleChange}
                  error={errors.first_name_kana}
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
              onChange={handleChange}
              error={errors.email}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
            <Select
              value={ str(user.sex) }
              onChange={handleChange}
              inputProps={{
                name: "sex",
                id: "user_sex"
              }}
              error={errors.sex}
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
                control={<Checkbox name="courtship" checked={ !!user.courtship } onChange={ handleChangeChecked } value={ 1 } />}
                label= { i18next.attr('user', 'courtship') }
              />
              <FormControlLabel
                control={<Checkbox name="matchmaker" checked={ !!user.matchmaker } onChange={ handleChangeChecked } value={ 1 } />}
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
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              error={errors.birthday}
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
              onChange={handleChange}
              error={errors.nickname}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <Grid fullWidth container spacing={4} >
              <Grid item xs={6}>
                <InputLabel htmlFor="religion">{ i18next.attr('user', 'religion') }</InputLabel>
                <Select
                  value={ str(user.religion) }
                  onChange={handleChange}
                  inputProps={{
                    name: "religion",
                    id: "user_religion"
                  }}
                  error={errors.religion}
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
                  onChange={handleChange}
                  error={errors.sect_name}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="lang">{ i18next.attr('user', 'lang') }</InputLabel>
            <Select
              value={ str(user.lang) }
              onChange={handleChange}
              inputProps={{
                name: "lang",
                id: "user_lang"
              }}
              error={errors.lang}
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
                <ReactSelect
                  name="country"
                  value={ user.country ? {label: countries[user.country], value: user.country} : null }
                  label={ i18next.attr('user', 'country') }
                  options={ Object.keys(countries).map(country => ({label: countries[country], value: country})) }
                  onChange={handleChangeSelect('country')}
                  placeholder="国名"
                  isClearable={true}
                  error={errors.country}
                >
                </ReactSelect>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="zip"
                  label={ i18next.attr('user', 'zip') }
                  autoComplete="off"
                  defaultValue=""
                  value={ str(user.zip) }
                  onChange={handleChange}
                  error={errors.zip}
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
                  onChange={handleChange}
                  inputProps={{
                    name: "prefecture",
                    id: "user_prefecture"
                  }}
                  error={errors.prefecture}
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
                  onChange={handleChange}
                  error={errors.city}
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
              onChange={handleChange}
              error={errors.house_number}
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
                  onChange={handleChange}
                  error={errors.tel}
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
                  onChange={handleChange}
                  error={errors.fax}
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
              onChange={handleChange}
              m={2}
              error={errors.bio}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password">{ i18next.attr('user', 'password') }</InputLabel>
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              value={ str(user.password) }
              onChange={handleChange}
              error={errors.password}
            />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="password_confirmation">{ i18next.attr('user', 'password_confirmation') }</InputLabel>
            <Input
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={ str(user.password_confirmation) }
              onChange={handleChange}
              error={errors.password_confirmation}
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            { i18next.t('dict.cancel') }
          </Button>
          <Button onClick={onSave} color="primary">
            { i18next.t('dict.save') }
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserForm));
