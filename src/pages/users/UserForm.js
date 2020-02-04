import React, {useContext, useRef, useState} from 'react';
import {
  AppBar,
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
  Box,
  Card,
  CardHeader,
  CardContent,
  Toolbar,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import axios from 'axios';

import env from 'src/environment';
import i18next from 'src/i18n'
import { str, collectErrors, createFormData } from 'src/helpers';
import CustomizedSnackbar from 'src/pages/components/CustomizedSnackbar';
import AppContext from 'src/contexts/AppContext';
import UserSelf from "./UserSelf";


const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 10,
    marginBottom: 10,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    minHeight: 'initial',
    padding: theme.spacing(2),
  },
  check_self: {
    color: 'red',
    fontWeight: 'bold',
  },
  check_matchmaker: {
    color: 'green',
    fontWeight: 'bold',
  },
  check_head: {
    color: 'blue',
    fontWeight: 'bold',
  },
}));


const enableSubmit = (mode, status) => {
  let prev_status = null, next_status = null;
  switch(status) {
    case 'check_self':
      if(mode === 'self') next_status = 'check_matchmaker';
      break;
    case 'check_matchmaker':
      if(mode === 'matchmaker') {
        prev_status = 'check_self';
        next_status = 'check_head';
      }
      break;
    case 'check_head':
      if(mode === 'head') {
        prev_status = 'check_matchmaker';
        next_status = 'active';
      }
      break;
    default:
      break;
  }
  return [prev_status, next_status];
};

const UserBasic = props => {
  const { user, errors, OnChange } = props;
  const classes = useStyles();
  const avatar = useRef();
  const statuses = i18next.data_list('enum', 'user', 'status');

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.basic') } />
      <CardContent>
        <Grid container justify="center">
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

        <Grid container>
          <Box mb={3}>
            <Typography className={classes[user.status]} variant="subtitle1">
              { i18next.attr('user', 'status') }: { statuses[user.status] }
            </Typography>
          </Box>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <TextField
                name="last_name"
                label={ i18next.attr('user', 'last_name') }
                autoComplete="off"
                value={ str(user.last_name) }
                onChange={OnChange}
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
                value={ str(user.first_name) }
                onChange={OnChange}
                error={errors.first_name}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <TextField
                name="last_name_kana"
                label={ i18next.attr('user', 'last_name_kana') }
                autoComplete="off"
                value={ str(user.last_name_kana) }
                onChange={OnChange}
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
                value={ str(user.first_name_kana) }
                onChange={OnChange}
                error={!!errors.first_name_kana}
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
            value={ str(user.email) }
            onChange={OnChange}
            error={!!errors.email}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
          <Select
            value={ str(user.sex) }
            onChange={OnChange}
            inputProps={{
              name: "sex",
              id: "user_sex"
            }}
            error={!!errors.sex}
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
            value={ str(user.birthday) }
            onChange={OnChange}
            InputLabelProps={{
              shrink: true
            }}
            error={!!errors.birthday}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            name="nickname"
            label={ i18next.attr('user', 'nickname') }
            autoComplete="off"
            value={ str(user.nickname) }
            onChange={OnChange}
            error={!!errors.nickname}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="lang">{ i18next.attr('user', 'lang') }</InputLabel>
          <Select
            value={ str(user.lang) }
            onChange={OnChange}
            inputProps={{
              name: "lang",
              id: "user_lang"
            }}
            error={!!errors.lang}
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
            onChange={OnChange}
            error={!!errors.password}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="password_confirmation">{ i18next.attr('user', 'password_confirmation') }</InputLabel>
          <Input
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={ str(user.password_confirmation) }
            onChange={OnChange}
            error={!!errors.password_confirmation}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};


const UserPhysical = props => {
  const { user, errors, OnChange } = props;
  const classes = useStyles();
  const bloods = i18next.data_list('enum', 'user', 'blood');
  const drinkings = i18next.data_list('enum', 'user', 'drinking');
  const smokings = i18next.data_list('enum', 'user', 'smoking');

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.physical') } />
      <CardContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="blood">{ i18next.attr('user', 'blood') }</InputLabel>
          <Select
            value={ str(user.blood) }
            onChange={OnChange}
            inputProps={{
              name: "blood",
              id: "user_blood"
            }}
            error={!!errors.blood}
            fullWidth
          >
            <MenuItem value="">
              <em></em>
            </MenuItem>
            {
              Object.keys(bloods).map((blood, i) => (
                <MenuItem key={i} value={blood}>{ bloods[blood] }</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <TextField
                name="height"
                type="number"
                label={ i18next.attr('user', 'height') }
                autoComplete="off"
                value={ str(user.height) }
                onChange={OnChange}
                error={!!errors.height}
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
                value={ str(user.weight) }
                onChange={OnChange}
                error={!!errors.weight}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="drinking">{ i18next.attr('user', 'drinking') }</InputLabel>
              <Select
                value={ str(user.drinking) }
                onChange={OnChange}
                inputProps={{
                  name: "drinking",
                  id: "user_drinking"
                }}
                error={!!errors.drinking}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {
                  Object.keys(drinkings).map((drinking, i) => (
                    <MenuItem key={i} value={drinking}>{ drinkings[drinking] }</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="smoking">{ i18next.attr('user', 'smoking') }</InputLabel>
              <Select
                value={ str(user.smoking) }
                onChange={OnChange}
                inputProps={{
                  name: "smoking",
                  id: "user_smoking"
                }}
                error={!!errors.smoking}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {
                  Object.keys(smokings).map((smoking, i) => (
                    <MenuItem key={i} value={smoking}>{ smokings[smoking] }</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={4}>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox name="diseased" checked={ !!user.diseased } onChange={ OnChange } value={ 1 } />}
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
                value={ str(user.disease_name) }
                onChange={OnChange}
                InputLabelProps={{
                  shrink: true
                }}
                disabled={!user.diseased}
                error={!!errors.disease_name}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};


const UserMarital = props => {
  const {user, errors, matchmakers, is_head, OnChange} = props;
  const classes = useStyles();
  const member_sharings = i18next.data_list('enum', 'user', 'member_sharing');
  const marital_statuses = i18next.data_list('enum', 'user', 'marital_status');

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.marital') } />
      <CardContent>
        <Grid container spacing={2} >
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="marital_status">{ i18next.attr('user', 'marital_status') }</InputLabel>
              <Select
                value={ str(user.marital_status) }
                onChange={OnChange}
                inputProps={{
                  name: "marital_status",
                  id: "user_marital_status"
                }}
                error={!!errors.marital_status}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {
                  Object.keys(marital_statuses).map((marital_status, i) => (
                    <MenuItem key={i} value={marital_status}>{ marital_statuses[marital_status] }</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          </Grid>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox name="role_courtship" checked={ !!user.role_courtship } onChange={ OnChange } value={ 1 } />}
                label= { i18next.attr('user', 'role_courtship') }
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {
              matchmakers.length > 0 ?
                <FormControl fullWidth>
                  <InputLabel htmlFor="matchmaker_id">{i18next.attr('user', 'matchmaker_id')}</InputLabel>
                  <Select
                    value={str(user.matchmaker_id)}
                    onChange={OnChange}
                    inputProps={{
                      name: "matchmaker_id",
                      id: "user_matchmaker_id"
                    }}
                    disabled={!is_head}
                    error={!!errors.matchmaker_id}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    {
                      matchmakers.map((matchmaker, i) => (
                        <MenuItem key={i} value={matchmaker.id}>{matchmaker.full_name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl> : null
            }
          </Grid>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox name="role_matchmaker" checked={ !!user.role_matchmaker } disabled={!is_head} onChange={ OnChange } value={ 1 } />}
                label= { i18next.attr('user', 'role_matchmaker') }
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="member_sharing">{ i18next.attr('user', 'member_sharing') }</InputLabel>
              <Select
                value={ str(user.member_sharing) }
                onChange={OnChange}
                inputProps={{
                  name: "member_sharing",
                  id: "user_member_sharing"
                }}
                error={!!errors.member_sharing}
                disabled={!user.role_matchmaker}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {
                  Object.keys(member_sharings).map((member_sharing, i) => (
                    <MenuItem key={i} value={member_sharing}>{ member_sharings[member_sharing] }</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


const UserReligion = props => {
  const {user, errors, OnChange} = props;
  const classes = useStyles();
  const religions = i18next.data_list('enum', 'user', 'religion');

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.religion') } />
      <CardContent>
        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="religion">{ i18next.attr('user', 'religion') }</InputLabel>
              <Select
                value={ str(user.religion) }
                onChange={OnChange}
                inputProps={{
                  name: "religion",
                  id: "user_religion"
                }}
                error={!!errors.religion}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {
                  Object.keys(religions).map((religion, i) => (
                    <MenuItem key={i} value={religion}>{ religions[religion] }</MenuItem>
                  ))
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
                value={ str(user.sect) }
                onChange={OnChange}
                error={!!errors.sect}
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
            value={ str(user.church) }
            onChange={OnChange}
            error={!!errors.church}
            fullWidth
          />
        </FormControl>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox name="baptized" checked={ !!user.baptized } onChange={ OnChange } value={ 1 } />}
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
                value={ str(user.baptized_year) }
                onChange={OnChange}
                InputLabelProps={{
                  shrink: true
                }}
                disabled={!user.baptized}
                error={!!errors.baptized_year}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


const UserLocation = props => {
  const {user, errors, OnChange} = props;
  const classes = useStyles();
  const prefectures = i18next.data_list('prefecture');

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.location') } />
      <CardContent>
        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="country">{ i18next.attr('user', 'country') }</InputLabel>
              <Select
                value={ str(user.country) }
                onChange={OnChange}
                inputProps={{
                  name: "country",
                  id: "user_country"
                }}
                error={!!errors.lang}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value='jpn'>{ i18next.t('country.jpn') }</MenuItem>
                <MenuItem value='kor'>{ i18next.t('country.kor') }</MenuItem>
                <MenuItem value='usa'>{ i18next.t('country.usa') }</MenuItem>
                <MenuItem value='che'>{ i18next.t('country.che') }</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <TextField
                name="zip"
                label={ i18next.attr('user', 'zip') }
                autoComplete="off"
                value={ str(user.zip) }
                onChange={OnChange}
                error={!!errors.zip}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} >
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="prefecture">{ i18next.attr('user', 'prefecture') }</InputLabel>
              <Select
                value={ str(user.prefecture) }
                onChange={OnChange}
                inputProps={{
                  name: "prefecture",
                  id: "user_prefecture"
                }}
                error={!!errors.prefecture}
                fullWidth
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {
                  Object.keys(prefectures).map((prefecture, i) => (
                    <MenuItem key={i} value={prefecture}>{ prefectures[prefecture] }</MenuItem>
                  ))
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
                value={ str(user.city) }
                onChange={OnChange}
                error={!!errors.city}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth>
          <TextField
            name="street"
            label={ i18next.attr('user', 'street') }
            autoComplete="off"
            value={ str(user.street) }
            onChange={OnChange}
            error={!!errors.street}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            name="building"
            label={ i18next.attr('user', 'building') }
            autoComplete="off"
            value={ str(user.building) }
            onChange={OnChange}
            error={!!errors.building}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            name="tel"
            label={ i18next.attr('user', 'tel') }
            autoComplete="off"
            value={ str(user.tel) }
            onChange={OnChange}
            error={!!errors.tel}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            name="mobile"
            label={ i18next.attr('user', 'mobile') }
            autoComplete="off"
            value={ str(user.mobile) }
            onChange={OnChange}
            error={!!errors.mobile}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            name="fax"
            label={ i18next.attr('user', 'fax') }
            autoComplete="off"
            value={ str(user.fax) }
            onChange={OnChange}
            error={!!errors.fax}
            fullWidth
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};


const UserMisc = props => {
  const {user, errors, OnChange} = props;
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.misc') } />
      <CardContent>
        <Grid container spacing={4} >
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField
                name="job"
                label={ i18next.attr('user', 'job') }
                autoComplete="off"
                value={ str(user.job) }
                onChange={OnChange}
                error={!!errors.job}
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
                value={ str(user.income) }
                onChange={OnChange}
                error={!!errors.income}
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
            value={ str(user.education) }
            onChange={OnChange}
            error={!!errors.education}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            name="hobby"
            label={ i18next.attr('user', 'hobby') }
            autoComplete="off"
            value={ str(user.hobby) }
            onChange={OnChange}
            error={!!errors.hobby}
            fullWidth
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};


const UserComment = props => {
  const {user, errors, OnChange} = props;
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.comment') } />
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
            onChange={OnChange}
            variant="outlined"
            margin="normal"
            error={!!errors.bio}
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
            onChange={OnChange}
            variant="outlined"
            margin="normal"
            error={!!errors.remark}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};


const UserForm = props => {
  const {state: {session}} = useContext(AppContext);
  const { user, setUser, matchmakers, mode, onClose } = props;
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const is_head = ~session.roles.indexOf('head');
  const classes = useStyles();
  const user_id = user.id;
  const [prev_status, next_status] = enableSubmit(mode, user.status);

  const onSendMail = () => {
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + `api/users/${user_id}/send_invitation`;
      axios.post(url, {}, { headers })
        .then((results) => {
          setMessage(i18next.t('views.user.sent_invitation'));
        })
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
        });

    }
  };

  const onSubmit = (status, message) => () => {
    if(window.confirm(message)) {
      console.log({status});
      onSave(status)();
    }
  };

  const onSave = status => () => {
    const headers  = session.headers;

    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      let url = env.API_ORIGIN + 'api/users/';
      if(user_id) url += user_id;

      let promise;
      let user_params = createFormData(status ? {...user, status} : user, 'user');

      const avatar = document.getElementById('avatar');
      if(avatar && avatar.files.length > 0) {
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
          setMessage(i18next.t('views.app.save_done'));
          setUser(results.data.user);
        })
        .catch(({response}) => {
          setErrors(collectErrors(response, 'user'));
        });
    }
  };

  const handleChange = event => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    setUser({...user, [event.target.name]: value});
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
        open={ message }
        variant="info"
        message={ message }
        onClose={() => setMessage(null)}
      />

      {
        (mode === 'self' && user.status !== 'check_self') ? (
          <UserSelf user={user} errors={errors} OnChange={handleChange}/>
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} lg={4}>
              <UserBasic user={user} errors={errors} is_head={is_head} OnChange={handleChange}/>
              <UserPhysical user={user} errors={errors} OnChange={handleChange}/>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {
                (mode !== 'self') ? (
                  <UserMarital user={user} errors={errors} matchmakers={matchmakers} is_head={is_head}
                               OnChange={handleChange}/>
                ) : null
              }
              <UserReligion user={user} errors={errors} OnChange={handleChange}/>
              <UserLocation user={user} errors={errors} OnChange={handleChange}/>
              <UserMisc user={user} errors={errors} OnChange={handleChange}/>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <UserComment user={user} errors={errors} OnChange={handleChange}/>
            </Grid>
          </Grid>
        )
      }

      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            <Grid item>
              {
                (user_id && user.status === 'check_self') ? (
                  <Button onClick={onSendMail} color="primary">
                    { i18next.t('views.user.send_invitation') }
                  </Button>
                ): null
              }
              {
                onClose ? (
                  <Button onClick={() => onClose(null)} color="primary">
                    { i18next.t('views.user.back') }
                  </Button>
                ): null
              }
              <Button onClick={onSave(null)} color="primary">
                {i18next.t('views.app.save')}
              </Button>
              {
                prev_status ? (
                  <Button onClick={onSubmit(prev_status, i18next.t('views.user.confirm_retract'))} color="primary">
                    {i18next.t('views.user.retract')}
                  </Button>
                ) : null
              }
              {
                next_status ? (
                  <Button onClick={onSubmit(next_status, i18next.t('views.user.confirm_submit'))} color="primary">
                    {i18next.t('views.user.submit')}
                  </Button>
                ) : null
              }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default UserForm;
