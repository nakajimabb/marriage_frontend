import React, { useEffect, useState, useContext } from 'react';
import { AllInclusive } from '@material-ui/icons';
import axios from 'axios'

import env from 'src/environment';
import i18next from 'src/i18n'
import AppContext from 'src/contexts/AppContext';
import UserList from './UserList';


const MatchmakerList = props => {
  const {state: {session}} = useContext(AppContext);
  const [data, setData] = useState([]);
  const title = i18next.t('views.user.matchmakers');

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users/matchmakers';
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
        icon={<AllInclusive />}
        data={data}
        all
        profile
        search_items={['name', 'sex', 'prefecture', 'age', 'religion', 'member_sharing', 'friend']}
      />
    </React.Fragment>
  );
};

export default MatchmakerList;
