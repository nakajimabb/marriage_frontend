import React, { useEffect, useState, useContext } from 'react';
import { Heart } from 'react-feather';
import axios from 'axios'

import env from 'src/environment';
import i18next from 'src/i18n'
import AppContext from 'src/contexts/AppContext';
import UserList from './UserList';


const PermittedList = () => {
  const {state: {session}} = useContext(AppContext);
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
      alert(i18next.t('errors.app.occurred'));
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

export default PermittedList;
