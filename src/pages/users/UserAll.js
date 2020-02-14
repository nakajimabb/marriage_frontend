import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios'

import env from 'src/environment';
import i18next from 'src/i18n'
import AppContext from 'src/contexts/AppContext';
import UserList from "./UserList";


const UserAll = props => {
  const {state: {session}} = useContext(AppContext);
  const {title, mode, new_user, invite_user, params, icon, item_labels, tabs, api} = props;
  const api_list = (api || {}).list || '';
  const api_get = (api || {}).get || '';
  const search_items = props.search_items || ['name', 'sex', 'prefecture', 'age', 'religion'];
  const [data, setData] = useState([]);

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + `api/users/${api_list}`;
      axios.get(url, {headers, params})
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

  const updateUser = user_id => {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + `api/users/${user_id}/${api_get}`;
        axios.get(url, {headers})
          .then((results) => {
            let user = results.data.user;
            let data2 = Array.from(data);
            const index = data.findIndex(u => u.id === user.id);
            if(~index) {
              data2[index] = user;
            } else {
              data2.push(user)
            }
            setData(data2);
          })
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  };

  return (
    <React.Fragment>
      <UserList
        mode={mode}
        title={title}
        icon={icon}
        data={data}
        item_labels={item_labels}
        new_user={new_user}
        invite_user={invite_user}
        tabs={tabs}
        api_get={api_get}
        updateUser={updateUser}
        search_items={search_items}
      />
    </React.Fragment>
  );
};

export default UserAll;
