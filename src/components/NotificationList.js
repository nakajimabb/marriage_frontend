import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { User } from "react-feather";
import axios from 'axios'

import i18next from 'i18n'
import DialogTitle from "pages/components/DialogTitle";
import { str, createFormData } from 'helpers';
import env from 'environment';
import {setNotification} from "../redux/actions/notificationActions";

const useStyles = makeStyles(theme => ({
  content: {
    backgroundColor: theme.body.background,
  },
  avatar: {
    width: 20,
    height: 20,
    margin: 0,
    padding: 0,
  },
  button: {
    fontSize: 12,
    height: 24,
    margin: 2,
    padding: 0,
    minWidth: 56,
  },
}));

const NotificationList = props => {
  const { open, session, dispatch, onClose } = props;
  const [user_friends, setUserFriends] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/user_friends/waiting_friends';
      axios.get(url, {headers})
        .then((results) => {
          setUserFriends(results.data.user_friends);
        })
        .catch((data) => {
          alert('データの取得に失敗しました。');
        });
    }
  }, [session.headers]);

  const acceptFriend = (id, status) => () => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/user_friends/' + str(id) + '/accept_request';
      let user_friend_params = createFormData({id, status}, 'user_friend');

      axios.post(url, user_friend_params, {headers})
        .then((results) => {
          const user_friends = results.data.user_friends;
          setUserFriends(user_friends);
          dispatch(setNotification({count: user_friends.size}));
        })
        .catch((data) => {
          alert('データの更新に失敗しました。');
        });
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle title={i18next.t('views.app.notification')} icon={<User />} onClose={onClose} />
        <DialogContent className={classes.content}>
          <Table className={classes.table} size="small">
            <TableBody>
              {
                user_friends.length > 0 ? (
                  user_friends.map(uf => {
                    return (<TableRow>
                      <TableCell component="th" scope="row" padding="none">
                        <Avatar src={uf.user_avatar_url} className={classes.avatar} />
                      </TableCell>
                      <TableCell>
                        { i18next.t('views.user_friend.notify', {name: uf.user_name}) }
                      </TableCell>
                      <TableCell align="right" padding="none">
                        <Button onClick={acceptFriend(uf.id, 'accepted')} size="small" variant="contained" color="primary" className={classes.button}>
                          { i18next.t('views.user_friend.accept') }
                        </Button>
                        <Button onClick={acceptFriend(uf.id, 'pending')} size="small" variant="contained" color="secondary" className={classes.button}>
                          { i18next.t('views.user_friend.pending') }
                        </Button>
                        <Button onClick={acceptFriend(uf.id, 'rejected')} size="small" variant="contained" color="inherit" className={classes.button}>
                          { i18next.t('views.user_friend.reject') }
                        </Button>
                      </TableCell>
                    </TableRow>)
                    }
                  )
                ) : <Typography>{ i18next.t('views.user_friend.not_exist') }</Typography>
              }
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            { i18next.t('views.app.close') }
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default connect(store => (
    { session: store.sessionReducer,
      notification: store.notificationReducer
    }
  )
)(withRouter(NotificationList));

