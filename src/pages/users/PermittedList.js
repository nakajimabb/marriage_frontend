import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Heart } from 'react-feather';
import axios from 'axios'

import env from 'src/environment';
import i18next from 'src/i18n'
import { logout } from 'src/redux/actions/sessionActions';
import AppContext from 'src/contexts/AppContext';
import UserList from './UserList';


const PermittedList = props => {
  const {state: {session}, dispatch} = useContext(AppContext);
  const { history } = props;
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
        icon={<Heart />}
        data={data}
        all
        profile
        action=""
      />
    </React.Fragment>
  );
};

export default withRouter(PermittedList);
