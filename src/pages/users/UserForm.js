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
  Box,
  Card,
  CardHeader,
  CardContent,
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
  card: {
    marginTop: 10,
    marginBottom: 10,
  }
}));

const UserForm = props => {

  const { open, user_id, session, onClose, maxWidth } = props;
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const [fullScreen, setFullScreen] = useState(props.fullScreen);
  const avatar = useRef();
  const countries = i18next.data_list('country');
  const prefectures = i18next.data_list('prefecture');
  const bloods = i18next.data_list('enum', 'user', 'blood');
  const religions = i18next.data_list('enum', 'user', 'religion');
  const drinkings = i18next.data_list('enum', 'user', 'drinking');
  const smokings = i18next.data_list('enum', 'user', 'smoking');
  const marital_statuses = i18next.data_list('enum', 'user', 'marital_status');
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

          <Grid container spacing={6}>
            <Grid item xs={12} md={6} lg={4}>
              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.basic') }
                />
                <CardContent>
                  <Grid container justify = "center">
                    <Box m={3}>
                      <Avatar
                          alt={ str(user.nickname) }
                          src={ user.avatar_url }
                          style={ {width: 160, height: 160, margin: 10} }
                      />
                      <FormControl fullWidth>
                        <input
                          id="avatar"
                          name="avatar"
                          type="file"
                          ref={ avatar }
                        />
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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
                </CardContent>
              </Card>

              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.physical') }
                />
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="blood">{ i18next.attr('user', 'blood') }</InputLabel>
                    <Select
                        value={ str(user.blood) }
                        onChange={handleChange}
                        inputProps={{
                          name: "blood",
                          id: "user_blood"
                        }}
                        error={errors.blood}
                        fullWidth
                    >
                      <MenuItem value="">
                        <em></em>
                      </MenuItem>
                      {
                        Object.keys(bloods).map(blood => <MenuItem value={blood}>{ bloods[blood] }</MenuItem>)
                      }
                    </Select>
                  </FormControl>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField
                            name="height"
                            type="number"
                            label={ i18next.attr('user', 'height') }
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.height) }
                            onChange={handleChange}
                            error={errors.height}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField
                            name="weight"
                            type="number"
                            label={ i18next.attr('user', 'weight') }
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.weight) }
                            onChange={handleChange}
                            error={errors.weight}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="drinking">{ i18next.attr('user', 'drinking') }</InputLabel>
                        <Select
                            value={ str(user.drinking) }
                            onChange={handleChange}
                            inputProps={{
                              name: "drinking",
                              id: "user_drinking"
                            }}
                            error={errors.drinking}
                            fullWidth
                        >
                        <MenuItem value="">
                          <em></em>
                        </MenuItem>
                        {
                          Object.keys(drinkings).map(drinking => <MenuItem value={drinking}>{ drinkings[drinking] }</MenuItem>)
                        }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="smoking">{ i18next.attr('user', 'smoking') }</InputLabel>
                        <Select
                            value={ str(user.smoking) }
                            onChange={handleChange}
                            inputProps={{
                              name: "smoking",
                              id: "user_smoking"
                            }}
                            error={errors.smoking}
                            fullWidth
                        >
                          <MenuItem value="">
                            <em></em>
                          </MenuItem>
                          {
                            Object.keys(smokings).map(smoking => <MenuItem value={smoking}>{ smokings[smoking] }</MenuItem>)
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <FormControlLabel
                            control={<Checkbox name="diseased" checked={ !!user.diseased } onChange={ handleChangeChecked } value={ 1 } />}
                            label= { i18next.attr('user', 'diseased') }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <TextField
                            name="disease_name"
                            label={ i18next.attr('user', 'disease_name') }
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.disease_name) }
                            onChange={handleChange}
                            InputLabelProps={{
                              shrink: true
                            }}
                            disabled={!user.diseased}
                            error={errors.disease_name}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.member_info') }
                />
                <CardContent>
                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <FormControlLabel
                          control={<Checkbox name="courtship" checked={ !!user.courtship } onChange={ handleChangeChecked } value={ 1 } />}
                          label= { i18next.attr('user', 'courtship') }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="marital_status">{ i18next.attr('user', 'marital_status') }</InputLabel>
                        <Select
                          value={ str(user.marital_status) }
                          onChange={handleChange}
                          inputProps={{
                            name: "marital_status",
                            id: "user_marital_status"
                          }}
                          error={errors.marital_status}
                          fullWidth
                        >
                          <MenuItem value="">
                            <em></em>
                          </MenuItem>
                          {
                            Object.keys(marital_statuses).map(marital_status => <MenuItem value={marital_status}>{ marital_statuses[marital_status] }</MenuItem>)
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <FormControlLabel
                            control={<Checkbox name="matchmaker" checked={ !!user.matchmaker } onChange={ handleChangeChecked } value={ 1 } />}
                            label= { i18next.attr('user', 'matchmaker') }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <FormControlLabel
                          control={<Checkbox name="married" checked={ !!user.married } onChange={ handleChangeChecked } value={ 1 } />}
                          label= { i18next.attr('user', 'married') }
                          disabled={ !user.matchmaker }
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.religion') }
                />
                <CardContent>
                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField
                            name="sect"
                            label={ i18next.attr('user', 'sect') }
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.sect) }
                            onChange={handleChange}
                            error={errors.sect}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth>
                    <TextField
                        name="church"
                        label={ i18next.attr('user', 'church') }
                        autoComplete="off"
                        defaultValue=""
                        value={ str(user.church) }
                        onChange={handleChange}
                        error={errors.church}
                        fullWidth
                    />
                  </FormControl>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <FormControlLabel
                            control={<Checkbox name="baptized" checked={ !!user.baptized } onChange={ handleChangeChecked } value={ 1 } />}
                            label= { i18next.attr('user', 'baptized') }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField
                            name="baptized_year"
                            label={ i18next.attr('user', 'baptized_year') }
                            type="number"
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.baptized_year) }
                            onChange={handleChange}
                            InputLabelProps={{
                              shrink: true
                            }}
                            disabled={!user.baptized}
                            error={errors.baptized_year}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.location') }
                />
                <CardContent>
                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
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
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth>
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

                  <FormControl fullWidth>
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
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                        name="mobile"
                        label={ i18next.attr('user', 'mobile') }
                        autoComplete="off"
                        defaultValue=""
                        value={ str(user.mobile) }
                        onChange={handleChange}
                        error={errors.mobile}
                        fullWidth
                    />
                  </FormControl>

                  <FormControl fullWidth>
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
                  </FormControl>
                </CardContent>
              </Card>
              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.other_info') }
                />
                <CardContent>
                  <Grid fullWidth container spacing={4} >
                    <Grid item xs={8}>
                      <FormControl fullWidth>
                        <TextField
                            name="job"
                            label={ i18next.attr('user', 'job') }
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.job) }
                            onChange={handleChange}
                            error={errors.job}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <TextField
                            name="income"
                            type="number"
                            label={ i18next.attr('user', 'income') }
                            autoComplete="off"
                            defaultValue=""
                            value={ str(user.income) }
                            onChange={handleChange}
                            error={errors.income}
                            fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth>
                    <TextField
                        name="education"
                        label={ i18next.attr('user', 'education') }
                        autoComplete="off"
                        defaultValue=""
                        value={ str(user.education) }
                        onChange={handleChange}
                        error={errors.education}
                        fullWidth
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                        name="hobby"
                        label={ i18next.attr('user', 'hobby') }
                        autoComplete="off"
                        defaultValue=""
                        value={ str(user.hobby) }
                        onChange={handleChange}
                        error={errors.hobby}
                        fullWidth
                    />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Card className={classes.card}>
                <CardHeader
                    title={ i18next.t('views.user.comment') }
                />
                <CardContent>
                  <FormControl fullWidth>
                    <TextField
                        name="bio"
                        label={ i18next.attr('user', 'bio') }
                        autoComplete="off"
                        multiline
                        rows="5"
                        rowsMax="10"
                        value={ str(user.bio) }
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        error={errors.bio}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                        name="remark"
                        label={ i18next.attr('user', 'remark') }
                        autoComplete="off"
                        multiline
                        rows="30"
                        rowsMax="50"
                        value={ str(user.remark) }
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        error={errors.remark}
                    />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
