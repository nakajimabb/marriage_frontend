import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Box } from "@material-ui/core";
import { Users } from "react-feather";
import axios from 'axios'

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import UserList from "./UserList";
import env from 'environment';


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
        .catch(({response}) => {
          alert(response.status + ' ' + response.statusText);
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
        icon={<Users />}
        data={data}
        all
        profile
        action=""
        search_items={['name', 'sex', 'prefecture', 'age', 'religion']}
      />
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(ViewableList));
