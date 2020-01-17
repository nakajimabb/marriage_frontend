import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  TextField,
  TablePagination,
  makeStyles,
} from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import axios from 'axios';

import env from 'src/environment';
import i18next from 'src/i18n'
import { str } from 'src/helpers';
import AppContext from 'src/contexts/AppContext';
import Compatibility from './Compatibility';


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


const PartnerList = props => {
  const {state: {session}} = useContext(AppContext);
  const { item_labels, user, all, onClose } = props;
  const [data, setData] = React.useState([]);
  const [search, setSearch] = useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(all ? -1 : 12);
  const [partner_id, setPartnerId] = React.useState(null);
  const classes = useStyles();
  const prefectures = i18next.data_list('prefecture');
  const religions = i18next.data_list('enum', 'user', 'religion');
  const keys = ['sex', 'prefecture', 'religion'];
  const ages = [search.min_age, search.max_age];
  const user_id = user.id;

  const default_labels = [
    (u => u.nickname),
    (u => (i18next.age(u.age) + ' ' + (u.prefecture ? i18next.t('prefecture.' + u.prefecture) : ''))),
  ];

  const columns = [ (n => str(n.last_name) + str(n.first_name)),
    (n => str(n.last_name_kana) + str(n.first_name_kana)),
    (n => n.nickname)];

  const array = filterUser(data, search, columns, keys, ages);
  let target_array;
  if(rowsPerPage <= 0) {
    target_array = array;
  } else {
    const index = page * rowsPerPage;
    target_array = array.slice(index, index + rowsPerPage)
  }

  useEffect(() => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id + '/partner_matches';
        axios.get(url, {headers})
          .then((results) => {
            setData(results.data.users || []);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  }, [user_id, session.headers]);

  const onPermit = (partner, permitted) => () => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/eval_partners/permit';
        let form_data = new FormData();
        form_data.append('user_id', user_id);
        form_data.append('partner_id', partner.id);
        form_data.append('permitted', permitted);
        axios.post(url, form_data, {headers})
          .then((results) => {
            const eval_partner = results.data.eval_partner
            let data2 = Array.from(data);
            const index = data.findIndex(u => u.id == eval_partner.partner_id)
            if(~index) {
              data2[index].permitted = eval_partner.permitted;
              data2[index].requirement_score = eval_partner.requirement_score;
              setData(data2);
            }
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  };

  const onCloseCompatibility = () => {
    setPartnerId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = event => {
    let search2 = Object.assign({}, search);
    search2[event.target.name] = event.target.value;
    setSearch(search2);
    setPage(0);
  };

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

  if(partner_id) {
    return (
      <Compatibility
        user={user}
        partner_id={partner_id}
        onClose={onCloseCompatibility}
      />
    );
  }

  return (
    <React.Fragment>
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
      </Grid>

      <Grid container spacing={6}>
        {
          target_array.map(user => {
            return (
              <Grid item xs={6} md={4} lg={3} xl={2} className={classes.grid} >
                <Card className={classes.card}>
                  <CardActionArea onClick={() => setPartnerId(user.id)} >
                    <CardMedia
                      className={classes.media}
                      image={ avatar_url(user) }
                      title={user.nickname}
                    />
                  </CardActionArea>
                  <CardContent className={classes.content} >
                    <Grid container spacing={6}>
                      <Grid item>
                        {
                          (item_labels || default_labels).map(f => (<Box>{ f(user) }</Box>))
                        }
                      </Grid>
                      <Grid item xs />
                      <Grid item>
                        {
                          user.permitted ? <Favorite color="primary" onClick={onPermit(user, false)} /> : <FavoriteBorder color="primary"  onClick={onPermit(user, true)} />
                        }
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        }
      </Grid>

      {
        (() => {
          if(!all) {
            return (
              <Grid container spacing={6}>
                <Grid item xs />
                <Grid item>
                  <TablePagination
                    component="div"
                    rowsPerPageOptions={[6, 12, 24, 48, 120]}
                    colSpan={3}
                    count={array.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelRowsPerPage={i18next.t('views.app.rows_per_page')}
                  />
                </Grid>
              </Grid>
            );
          }
        })()
      }
      <AppBar position="fixed" color="default" className={classes.appBar} >
        <Toolbar className={classes.toolbar} >
          <Grid container spacing={6}>
            <Grid item xs />
            {
              onClose ? (
                <Grid item>
                  <Button onClick={() => onClose(null)} color="primary">
                    { i18next.t('views.user.back') }
                  </Button>
                </Grid>
              ) : null
            }
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withRouter(PartnerList);
