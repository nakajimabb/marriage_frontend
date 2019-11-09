import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import {spacing} from "@material-ui/system";
import axios from 'axios'

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import env from 'environment';
import UserList from "./UserList";
import {Divider as MuiDivider, Typography} from "@material-ui/core";


const Divider = styled(MuiDivider)(spacing);

const ViewableList = props => {
  const { dispatch, session, history } = props;
  const [data, setData] = useState([]);
  const title = i18next.t('views.user.viewable');

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/viewable';
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

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        { title }
      </Typography>
      <Divider my={6} />
      <UserList data={data} all updateUser={updateUser} />
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(ViewableList));