import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Box } from "@material-ui/core";
import { Heart } from "react-feather";
import axios from 'axios'

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import TitleBar from "pages/components/TitleBar";
import UserList from "./UserList";
import env from 'environment';


const PermittedList = props => {
  const { dispatch, session, history } = props;
  const [data, setData] = useState([]);
  const title = i18next.t('views.user.permitted_users');

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/permitted_users';
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

  return (
    <React.Fragment>
      <UserList
        title={title}
        icon={<Heart />}
        data={data}
        all
        profile
        action=""
      />
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(PermittedList));
