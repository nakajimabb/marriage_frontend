import React, { useEffect, useContext } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Grid,
  Chip,
  Tab,
  Tabs,
  Typography,
  Tooltip,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import { EventNote, AddCircleOutline } from '@material-ui/icons';
import { Edit } from 'react-feather';
import axios from 'axios';

import env from 'src/environment';
import i18next from 'src/i18n'
import TitleBar from 'src/pages/components/TitleBar';
import { str } from 'src/helpers';
import AppContext from 'src/contexts/AppContext';
import RoomForm from './RoomForm';
import RoomPage from './RoomPage';


const useStyles = makeStyles(theme => ({
  card: {
    margin: 0,
    padding: 0,
    border: 'solid 1px rgba(0,0,0,0.1)',
  },
  content: {
    height: 230,
    overflow: 'hidden',
    borderBottom: '1px solid lightgray',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    }
  },
  sub_title: {
    borderBottom: '1px solid lightgray',
    marginBottom: 5,
  },
  male: {
    color: 'white',
    backgroundColor: 'dodgerblue',
    marginRight: 10,
  },
  female: {
    color: 'white',
    backgroundColor: 'hotpink',
  },
  tea: {
    height: 24,
    color: 'white',
    marginRight: 5,
    backgroundColor: 'darkorange',
  },
  meal: {
    height: 24,
    color: 'white',
    marginRight: 5,
    backgroundColor: 'green',
  },
  study: {
    height: 24,
    color: 'white',
    marginRight: 5,
    backgroundColor: 'dodgerblue',
  },
  prefecture: {
    height: 24,
    color: 'white',
    marginRight: 5,
    backgroundColor: 'tomato',
  },
  p: {
    margin: 0,
    padding: 0,
  },
  remark: {
    whiteSpace: 'pre-wrap',
  },
}));

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const RoomAction = props => {
  const { room, onJoin, onLeft, onEdit } = props;
  const availability = room.availability;

  if(availability === 'created') {
    return (
      <IconButton size="small" onClick={onEdit} >
        <Edit fontSize="small" />
      </IconButton>
    );
  }

  if(availability === 'registrable') {
    return (
      <Button variant="outlined" size="small" color="primary" onClick={onJoin}>
        { i18next.t('views.room.join') }
      </Button>
    );
  }

  if(availability === 'joined') {
    return (
      <Button variant="outlined" size="small" color="secondary" onClick={onLeft}>
        { i18next.t('views.room.left') }
      </Button>
    );
  }

  return null;
};


const Room = props => {
  const { room, onPage } = props;
  const sex_texts = { male: i18next.enum('user', 'sex', 'male'),
                      female: i18next.enum('user', 'sex', 'female')};
  const classes = useStyles();
  const dated_on = str(room.dated_on).substr(5).replace('-', '/');
  const fixed_on = str(room.fixed_on).substr(5).replace('-', '/');
  const prefecture = (room.prefecture ? i18next.t('prefecture.' + room.prefecture) : '');

  return (
    <Card mb={6} className={classes.card}>
      <CardContent className={classes.content}  onClick={onPage} >
        <Grid container spacing={0} className={classes.sub_title}>
          <Grid item >
            <Typography gutterBottom variant="h6" component="h4">
              {dated_on} {room.name}
            </Typography>
          </Grid>
          <Grid item xs />
          <Grid item >
            { prefecture ? <Chip className={classes.prefecture} label={prefecture} /> : null }
          </Grid>
        </Grid>
        <Grid container spacing={0} >
          <Grid item >
            <Chip className={classes[room.room_type]} label={i18next.enum('room', 'room_type', room.room_type)} />
            {room.min_age}~{room.max_age} {i18next.t('views.app.age_year')}
          </Grid>
          <Grid item xs />
          <Grid item >
            <b>{i18next.attr('room', 'fixed_on')} {fixed_on}</b>
          </Grid>
        </Grid>
        <Typography className={classes.remark}>
          { room.remark }
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container spacing={3}>
          <Grid item >
            <RoomAction {...props} />
          </Grid>
          <Grid item xs />
          <Grid item >
            <Chip className={classes.male} label={`${sex_texts.male} ${room.male_users_size}/${room.male_count}`} />
            <Chip className={classes.female} label={`${sex_texts.female} ${room.female_users_size}/${room.female_count}`} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

const RoomList = () => {
  const {state: {session}} = useContext(AppContext);
  const title = i18next.t('views.room.list');
  const [tab, setTab] = React.useState(0);
  const [room_id, setRoomId] = React.useState(null);
  const [rooms, setRooms] = React.useState([]);
  const [open, setOpen] = React.useState(null);
  const user = session.user;
  const page_title = i18next.model('room');

  let index = 0, tab_indexes = {};
  if(user.role_matchmaker) tab_indexes.all = index++;
  if(user.role_courtship) tab_indexes.available = index++;
  tab_indexes.mylist = index++;

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/rooms';
      axios.get(url, {headers})
        .then((results) => {
          if(results.data) setRooms(results.data.rooms);
        })
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
        });
    }
  }, [session.headers]);

  const tabChange = (event, newValue) => {
    setTab(newValue);
  };

  const join_or_leftRoom = (room, action) => () => {
    const message = (action === 'join') ? i18next.t('views.room.confirm_join') : i18next.t('views.room.confirm_left');
    if(window.confirm(message)) {
      const headers = session.headers;
      if (headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + `api/rooms/${room.id}/${action}`;
        axios.post(url, {}, {headers})
          .then((results) => {
            updateRoom(results.data.room);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  };

  const openRoomPage = (room) => () => {
    setRoomId(room.id);
    setOpen('page');
  };

  const openNewRoomForm = () => {
    setRoomId(null);
    setOpen('form');
  };

  const openRoomForm = (room) => () => {
    setRoomId(room.id);
    setOpen('form');
  };

  const closeRoomForm = () => {
    setOpen(null);
    setRoomId(null);
  };

  const roomFilter = (array) => {
    const accepted = ['registrable', 'joined', 'created'];
    return array.filter(n => ~accepted.indexOf(n.availability));
  };

  const joinedFilter = (array) => {
    const accepted = ['joined', 'created'];
    return array.filter(n => ~accepted.indexOf(n.availability));
  };

  const updateRoom = (room, add=false) => {
    let rooms2 = Array.from(rooms);
    const index = rooms2.findIndex(r => r.id === room.id);
    if(~index) {
      rooms2[index] = room;
    } else if(add) {
      rooms2.push(room)
    }
    setRooms(rooms2);
  };

  if(open === 'page') {
    return (
      <React.Fragment>
        <RoomPage
          room_id={room_id}
          onClose={closeRoomForm}
        />
      </React.Fragment>
    );
  }

  if(open === 'form') {
    return (
      <React.Fragment>
        <TitleBar title={page_title} variant="dense" />
        <RoomForm
          room_id={room_id}
          onUpdate={updateRoom}
          onClose={closeRoomForm}
        />
      </React.Fragment>
    );
  }

  const sub_menu = user.role_matchmaker ? (
    <Box pt={1} >
      <Tooltip title={i18next.t('views.room.add_room')}>
        <IconButton size="small" onClick={openNewRoomForm} >
          <AddCircleOutline fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  ) : null;

  return (
    <React.Fragment>
      <TitleBar title={title} icon={<EventNote />} variant="dense" sub_menu={sub_menu} >
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={tabChange}
          aria-label="simple tabs example"
        >
          { ~Object.keys(tab_indexes).indexOf('all') ? <Tab label={i18next.t('views.room.all')} {...a11yProps(tab_indexes.all)} /> : null }
          { ~Object.keys(tab_indexes).indexOf('available') ? <Tab label={i18next.t('views.room.available')} {...a11yProps(tab_indexes.available)} /> : null }
          { ~Object.keys(tab_indexes).indexOf('mylist') ? <Tab label={i18next.t('views.room.mylist')} {...a11yProps(tab_indexes.mylist)} /> : null }
        </Tabs>
      </TitleBar>
      <Box>
        { ~Object.keys(tab_indexes).indexOf('all') ?
          (<TabPanel value={tab} index={tab_indexes.all}>
            <Grid container spacing={6}>
              { rooms.map((room, i) => {
                return (
                  <Grid key={i} item xs={6} lg={4} xl={3}>
                    <Room
                      room={room}
                      user={user}
                      onJoin={join_or_leftRoom(room, 'join')}
                      onLeft={join_or_leftRoom(room, 'left')}
                      onPage={openRoomPage(room)}
                      onEdit={openRoomForm(room)}
                    />
                  </Grid>
                  );
                })
              }
            </Grid>
          </TabPanel>) : null
        }
        { ~Object.keys(tab_indexes).indexOf('available') ?
          (<TabPanel value={tab} index={tab_indexes.available}>
            <Grid container spacing={6}>
              { roomFilter(rooms).map((room, i) => {
                return (
                  <Grid key={i} item xs={6} lg={4} xl={3}>
                    <Room
                      room={room}
                      user={user}
                      onJoin={join_or_leftRoom(room, 'join')}
                      onLeft={join_or_leftRoom(room, 'left')}
                      onPage={openRoomPage(room)}
                      onEdit={openRoomForm(room)}
                    />
                  </Grid>
                );
              })
              }
            </Grid>
          </TabPanel>) : null
        }
        { ~Object.keys(tab_indexes).indexOf('mylist') ?
          (<TabPanel value={tab} index={tab_indexes.mylist}>
            <Grid container spacing={6}>
              { joinedFilter(rooms).map((room, i) => {
                return (
                  <Grid key={i} item xs={6} lg={4} xl={3}>
                    <Room
                      room={room}
                      user={user}
                      onJoin={join_or_leftRoom(room, 'join')}
                      onLeft={join_or_leftRoom(room, 'left')}
                      onPage={openRoomPage(room)}
                      onEdit={openRoomForm(room)}
                    />
                  </Grid>
                );
              })
              }
            </Grid>
          </TabPanel>) : null
        }
      </Box>
    </React.Fragment>
  );
};

export default RoomList;
