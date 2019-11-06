import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios'

import {
  Grid,
  Box,
  Fab,
  Divider as MuiDivider,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  FormControl,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox,
  FormGroup, Select, MenuItem, TextField,
} from "@material-ui/core";
import {
  PersonAdd as AddIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from "@material-ui/system";

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import env from 'environment';
import { str } from 'helpers';
import UserForm from "./UserForm";


const Divider = styled(MuiDivider)(spacing);

const useStyles = makeStyles(theme => ({
  grid: {
    margin: 0,
    padding: 0,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  media: {
    width: '100%',
    height: 200
  },
  card: {
    margin: 0,
    padding: 0,
    border: 'solid 1px rgba(0,0,0,0.1)',
  },
  full_name: {
    marginLeft: 5,
    fontWeight: 500,
    fontSize: '110%',
  },
  prof_item: {
    margin: 5,
  },
  content: {
    padding: 8,
    "&:last-child": {
      paddingBottom: 8,
    },
  },
  control: {
    margin: 5,
  }
}));

const MemberList = props => {
  const { dispatch, session, history } = props;
  const [open, setOpen] = useState(false);
  const [user_id, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({});
  const classes = useStyles();
  const prefectures = i18next.data_list('prefecture');
  const religions = i18next.data_list('enum', 'user', 'religion');
  const keys = ['sex', 'prefecture', 'religion'];
  const ages = [search.min_age, search.max_age];
  const columns = [ (n => str(n.last_name) + str(n.first_name)),
                    (n => str(n.last_name_kana) + str(n.first_name_kana)),
                    (n => n.nickname)];

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/courtships';
      axios.get(url, {headers})
          .then((results) => {
            setData(results.data.users);
          })
          .catch((data) => {
            alert('データの取得に失敗しました。');
          });
    }
    else {
      dispatch(logout());
      history.push('/auth/sign-in');
    }
  }, [session.headers]);

  const handleSearchChange = event => {
    let search2 = Object.assign({}, search);
    search2[event.target.name] = event.target.value;
    setSearch(search2);
  };

  const openUserNewForm = () => {
    setOpen(true);
    setUserId(null);
  };

  const openUserForm = (n) => () => {
    setOpen(true);
    setUserId(n.id);
  };

  const closeUserForm = (user_id) => {
    setOpen(false);
    if(user_id) updateUser(user_id)
  };

  function updateUser(user_id) {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id;
        axios.get(url, {headers})
          .then((results) => {
            let user = results.data.user;
            let data2 = Array.from(data);
            const index = data.findIndex(u => u.id == user.id)
            if(~index) {
              data2[index] = user;
            } else {
              data2.push(user)
            }
            setData(data2);
          })
          .catch((data) => {
            alert('データの取得に失敗しました。');
          });
      }
    }
  }

  function filterUser(array, search, columns, keys, ages) {
    return matchName(equalDate(ageFilter(array, ages[0], ages[1]), search, keys), search.name, columns);
  }

  function ageFilter(array, min_age, max_age) {
    if(min_age || max_age) {
      return array.filter(n => n.age && (!min_age || +n.age >= +min_age) && (!max_age || +n.age <= +max_age));
    } else {
      return array;
    }
  }

  function matchName(array, name, columns) {
    if(name) {
      return array.filter(n => columns.some(c => ~str(c(n)).indexOf(name)));
    } else {
      return array;
    }
  }

  function equalDate(array, search, keys) {
    const options = keys.map(key => [key, search[key]]).filter(a => a[1]);
    if(Object.keys(options).length) {
      return array.filter(n => options.every(option => n[option[0]] == option[1]));
    } else {
      return array;
    }
  }

  function avatar_url(user) {
    if(user.avatar_url) {
      return user.avatar_url;
    }
    else {
      return user.sex == 'male' ? '/static/img/avatars/male.png' : '/static/img/avatars/female.png'
    }
  }

  return (
    <React.Fragment>
      { (() => {
        if (open)
          return (<UserForm user_id={user_id} open={open} onClose={closeUserForm} fullScreen maxWidth="md" />);
        })()
      }
      <Typography variant="h3" gutterBottom display="inline">
        { i18next.t('views.user.members') }
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item>
          <FormControl className={classes.control} >
            <InputLabel htmlFor="search">{ i18next.t('views.app.search') }</InputLabel>
            <Input id="search_name"
                   name="name"
                   defaultValue=""
                   value={search.name}
                   placeholder={ i18next.attr('user', 'name') + '(' + i18next.attr('user', 'kana') + ') or ' + i18next.attr('user', 'nickname') }
                   onChange={handleSearchChange} />
          </FormControl>
          <FormControl className={classes.control} style={{width: 60}} >
            <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
            <Select
              value={search.sex}
              name="sex"
              onChange={handleSearchChange}
              inputProps={{
                name: "sex",
                id: "user_sex"
              }}
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              <MenuItem value='male'>{ i18next.enum('user', 'sex', 'male') }</MenuItem>
              <MenuItem value='female'>{ i18next.enum('user', 'sex', 'female') }</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.control} style={{width: 100}} >
            <InputLabel htmlFor="prefecture">{ i18next.attr('user', 'prefecture') }</InputLabel>
            <Select
              value={ str(search.prefecture) }
              name="prefecture"
              onChange={handleSearchChange}
              inputProps={{
                name: "prefecture",
              }}
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
          <FormControl className={classes.control} style={{width: 50}} >
            <TextField
              name="min_age"
              type="number"
              label={ i18next.attr('user', 'age') + '~' }
              autoComplete="off"
              defaultValue=""
              value={ str(search.min_age) }
              onChange={handleSearchChange}
            />
          </FormControl>
          <FormControl className={classes.control} style={{width: 50}} >
            <TextField
              name="max_age"
              type="number"
              label={ '~' + i18next.attr('user', 'age') }
              autoComplete="off"
              defaultValue=""
              value={ str(search.max_age) }
              onChange={handleSearchChange}
            />
          </FormControl>
          <FormControl className={classes.control} style={{width: 100}} >
            <InputLabel htmlFor="religion">{ i18next.attr('user', 'religion') }</InputLabel>
            <Select
              value={ str(search.religion) }
              onChange={handleSearchChange}
              inputProps={{
                name: "religion",
              }}
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
        <Grid item xs />
        <Grid item>
          <Fab size="medium" onClick={openUserNewForm} ><AddIcon/></Fab>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        {
          filterUser(data, search, columns, keys, ages).map(user => {
            return (
              <Grid item xs={6} md={4} lg={3} xl={2} className={classes.grid} >
                <Card className={classes.card}>
                  <CardActionArea onClick={openUserForm(user)}>
                    <CardMedia
                      className={classes.media}
                      image={ avatar_url(user) }
                      title="Paella dish"
                    />
                  </CardActionArea>
                  <CardContent className={classes.content} >
                    <Box>
                      <Box component="span" display="inline" class={classes.full_name} >
                        { str(user.last_name) + ' ' + str(user.first_name) }
                      </Box>
                      <Box component="span" display="inline" class={classes.prof_item} >
                        ({ str(user.nickname) })
                      </Box>
                    </Box>
                    &nbsp;
                    <Box component="span" display="inline" class={classes.prof_item} >
                      { i18next.age(user.age) }
                    </Box>
                    <Box component="span" display="inline" class={classes.prof_item} >
                      { user.prefecture ? i18next.t('prefecture.' + user.prefecture) : '' }
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        }
      </Grid>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(MemberList));
