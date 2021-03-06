import React, {useState} from 'react';
import {
  Grid,
  Box,
  Checkbox,
  Fab,
  Tooltip,
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
  Breadcrumbs,
  Typography,
  Link,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import { PersonAdd as AddIcon } from '@material-ui/icons';
import { UserPlus } from 'react-feather';

import i18next from 'src/i18n'
import { str } from 'src/helpers';
import TitleBar from 'src/pages/components/TitleBar';
import UserPage from './UserPage';
import UserInvitation from 'src/pages/auth/UserInvitation';


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
    height: 200,
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
  link: {
    cursor: 'pointer',
  },
}));


const ageFilter = (array, min_age, max_age) => {
  if(min_age || max_age) {
    return array.filter(n => n.age && (!min_age || +n.age >= +min_age) && (!max_age || +n.age <= +max_age));
  } else {
    return array;
  }
};

const matchName = (array, name, columns) => {
  if(name) {
    return array.filter(n => columns.some(c => ~str(c(n)).indexOf(name)));
  } else {
    return array;
  }
};

const equalData = (array, search, keys) => {
  const options = keys.map(key => [key, search[key]]).filter(a => a[1]);
  if(Object.keys(options).length) {
    return array.filter(n => options.every(option => n[option[0]] === option[1]));
  } else {
    return array;
  }
};

const filterUser = (array, search, columns, keys, ages) => {
  return matchName(equalData(ageFilter(array, ages[0], ages[1]), search, keys), search.name, columns);
};

const UserBreadcrumbs = props => {
  const { items } = props;
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      {
        (items || []).map(
          (item, i) => {
            if(item[1]) {
              return (
                <Link key={i} to="#" onClick={ item[1] } className={classes.link} >
                  { item[0] }
                </Link>
              );
            } else {
              return (<Typography key={i}>{ item[0] }</Typography>);
            }
          }
        )
      }
    </Breadcrumbs>
  );
};


const UserList = props => {
  const { mode, title, icon, data, new_user, invite_courtship, invite_matchmaker, updateUser, all, api_get, search_items, tabs } = props;
  const [open, setOpen] = useState(false);
  const [user_id, setUserId] = useState(null);
  const [open_invitation, setOpenInvitation] = useState({courtship: false, matchmaker: false});
  const [search, setSearch] = useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(all ? -1 : 12);
  const [page_title, setPageTitle] = useState(false);
  const classes = useStyles();
  const prefectures = i18next.data_list('prefecture');
  const religions = i18next.data_list('enum', 'user', 'religion');
  const member_sharings = i18next.data_list('enum', 'user', 'member_sharing');
  const statuses = i18next.data_list('enum', 'user', 'status');
  const keys = ['sex', 'prefecture', 'religion', 'role_matchmaker', 'member_sharing', 'status', 'friend'];
  const ages = [search.min_age, search.max_age];
  const items =[[title, (() => setOpen(false))],
                [page_title, null]];

  const item_labels = props.item_labels ||
    [
      (u => u.code),
      (u => (i18next.age(u.age) + ' ' + (u.prefecture ? i18next.t('prefecture.' + u.prefecture) : ''))),
    ];

  const columns = [ (n => str(n.last_name) + str(n.first_name)),
    (n => str(n.last_name_kana) + str(n.first_name_kana)),
    (n => n.code)
  ];

  const array = filterUser(data, search, columns, keys, ages);
  let target_array;
  if(rowsPerPage <= 0) {
    target_array = array;
  } else {
    const index = page * rowsPerPage;
    target_array = array.slice(index, index + rowsPerPage)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = event => {
    let search2 = Object.assign({}, search);
    if(event.target.type === 'checkbox') {
      search2[event.target.name] = event.target.checked;
    } else {
      search2[event.target.name] = event.target.value;
    }
    setSearch(search2);
    setPage(0);
  };

  const openUserNewForm = () => {
    setOpen(true);
    setUserId(null);
  };

  const openInvitation = user_type => () => {
    setOpenInvitation({...open_invitation, [user_type]: true});
  };

  const closeInvitation = user_type => () => {
    setOpenInvitation({...open_invitation, [user_type]: false});
  };

  const openUserPage = (n) => () => {
    setOpen(true);
    setUserId(n.id);
  };

  const closeUserPage = (user_id) => {
    setOpen(false);
    setPageTitle(null);
    if(user_id) updateUser(user_id)
  };

  const avatarUrl = user => {
    if(user.avatar_url) {
      return user.avatar_url;
    }
    else {
      return user.sex === 'male' ? '/static/img/avatars/male.png' : '/static/img/avatars/female.png'
    }
  };

  if(open) {
    return (
      <React.Fragment>
        <TitleBar title={page_title} variant="dense" sub_menu={ <UserBreadcrumbs items={items} /> } />
        <UserPage
          mode={mode}
          user_id={user_id}
          open={open}
          fullScreen
          tabs={tabs}
          api_get={api_get}
          maxWidth="md"
          onClose={closeUserPage}
          setTitle={setPageTitle}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <UserInvitation
        open={open_invitation['courtship']}
        role_courtship
        title={i18next.t('views.user.invite_courtship')}
        handleClose={closeInvitation('courtship')}
      />
      <UserInvitation
        open={open_invitation['matchmaker']}
        role_matchmaker
        title={i18next.t('views.user.invite_matchmaker')}
        handleClose={closeInvitation('matchmaker')}
      />
      <TitleBar title={title} icon={icon} variant="dense" />
      <Box px={5} py={2} >
        <Grid container spacing={6} >
          <Grid item>
            {
              (search_items || []).includes('name') ? (
                <FormControl className={classes.control} >
                  <InputLabel htmlFor="search">{ i18next.t('views.app.search') }</InputLabel>
                  <Input id="search_name"
                         name="name"
                         value={search.name}
                         placeholder={ i18next.attr('user', 'name') + '(' + i18next.attr('user', 'kana') + ') or ' + i18next.attr('user', 'code') }
                         onChange={handleSearchChange} />
                </FormControl>
              ) : null
            }
            {
              (search_items || []).includes('sex') ? (
                <FormControl className={classes.control} style={{width: 60}} >
                  <InputLabel htmlFor="sex">{ i18next.attr('user', 'sex') }</InputLabel>
                  <Select
                    value={str(search.sex)}
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
              ) : null
            }
            {
              (search_items || []).includes('prefecture') ? (
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
                      Object.keys(prefectures).map((prefecture, i) => (
                        <MenuItem key={i} value={prefecture}>{ prefectures[prefecture] }</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              ) : null
            }
            {
              (search_items || []).includes('age') ? (
                <React.Fragment>
                  <FormControl className={classes.control} style={{width: 50}}>
                    <TextField
                      name="min_age"
                      type="number"
                      label={i18next.attr('user', 'age') + '~'}
                      autoComplete="off"
                      value={str(search.min_age)}
                      onChange={handleSearchChange}
                    />
                  </FormControl>
                  <FormControl className={classes.control} style={{width: 50}} >
                    <TextField
                      name="max_age"
                      type="number"
                      label={ '~' + i18next.attr('user', 'age') }
                      autoComplete="off"
                      value={ str(search.max_age) }
                      onChange={handleSearchChange}
                    />
                  </FormControl>
                </React.Fragment>
              ) : null
            }
            {
              (search_items || []).includes('religion') ? (
                <FormControl className={classes.control} style={{width: 100}}>
                  <InputLabel htmlFor="religion">{i18next.attr('user', 'religion')}</InputLabel>
                  <Select
                    value={str(search.religion)}
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
                      Object.keys(religions).map((religion,i) => (
                        <MenuItem
                          key={i}
                          value={religion}>{religions[religion]}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              ) : null
            }
            {
              (search_items || []).includes('status') ? (
                <FormControl className={classes.control} style={{width: 100}}>
                  <InputLabel htmlFor="status">{i18next.attr('user', 'status')}</InputLabel>
                  <Select
                    value={str(search.status)}
                    onChange={handleSearchChange}
                    inputProps={{
                      name: "status",
                    }}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    {
                      Object.keys(statuses).map((status,i) => (
                        <MenuItem
                          key={i}
                          value={status}>{statuses[status]}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              ) : null
            }
            {
              (search_items || []).includes('role_matchmaker') ? (
                <FormControl className={classes.control} style={{width: 75, marginTop: 15}}>
                  <FormControlLabel
                    control={<Checkbox name="role_matchmaker" checked={!!search.role_matchmaker}
                                       onChange={handleSearchChange} value={1}/>}
                    label={i18next.t('views.user.matchmaker')}
                  />
                </FormControl>
              ) : null
            }
            {
              (search_items || []).includes('member_sharing') ? (
                <FormControl className={classes.control} style={{width: 100}}>
                  <InputLabel htmlFor="member_sharing">{i18next.attr('user', 'member_sharing')}</InputLabel>
                  <Select
                    value={str(search.member_sharing)}
                    onChange={handleSearchChange}
                    inputProps={{
                      name: "member_sharing",
                      id: "search_member_sharing"
                    }}
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    {
                      Object.keys(member_sharings).map((member_sharing, i) => (
                        <MenuItem
                          key={i}
                          value={member_sharing}>{member_sharings[member_sharing]}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              ) : null
            }
            {
              (search_items || []).includes('friend') ? (
                <FormControl className={classes.control} style={{width: 120, marginTop: 15}}>
                  <FormControlLabel
                    control={<Checkbox name="friend" checked={!!search.friend} onChange={handleSearchChange}
                                       value={1}/>}
                    label={i18next.t('views.user.matchmaker_friend')}
                  />
                </FormControl>
              ) : null
            }
          </Grid>
          <Grid item xs />
          {
              new_user ? (
                <Grid item>
                  <Tooltip title={i18next.t('views.user.add_user')}>
                    <Fab size="medium" onClick={openUserNewForm} ><UserPlus/></Fab>
                  </Tooltip>
                </Grid>
              ) : null
          }
          {
            invite_courtship ? (
              <Grid item>
                <Tooltip title={i18next.t('views.user.invite_courtship')}>
                  <Fab size="medium" onClick={openInvitation('courtship')} ><AddIcon/></Fab>
                </Tooltip>
              </Grid>
            ) : null
          }
          {
            invite_matchmaker ? (
              <Grid item>
                <Tooltip title={i18next.t('views.user.invite_matchmaker')}>
                  <Fab size="medium" onClick={openInvitation('matchmaker')} ><AddIcon/></Fab>
                </Tooltip>
              </Grid>
            ) : null
          }
        </Grid>

        <Grid container spacing={6} className={classes.main} >
          {
            target_array.map((user, i) => {
              return (
                <Grid key={i} item xs={6} md={4} lg={3} xl={2} className={classes.grid} >
                  <Card className={classes.card}>
                    <CardActionArea onClick={openUserPage(user)}>
                      <CardMedia
                        className={classes.media}
                        image={ avatarUrl(user) }
                        title={user.code}
                      />
                    </CardActionArea>
                    <CardContent className={classes.content} >
                      {
                        item_labels.map((f, i) => (<Box key={i}>{ f(user) }</Box>))
                      }
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          }
        </Grid>

        {
          all ? null : (
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
            )
        }
      </Box>
    </React.Fragment>
  );
};

export default UserList;
