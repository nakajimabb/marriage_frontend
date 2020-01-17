import React, {useContext, useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import { Users } from 'react-feather';
import axios from 'axios'

import env from 'src/environment';
import i18next from 'src/i18n'
import { logout } from 'src/redux/actions/sessionActions';
import AppContext from 'src/contexts/AppContext';
import UserList from "./UserList";


const UserAll = props => {
  const {state: {session}, dispatch} = useContext(AppContext);
  const { history } = props;
  const [data, setData] = useState([]);
  const title = i18next.t('views.user.list');
  const item_labels = [
                        (u => (u.last_name + ' ' + u.first_name + ' (' + u.nickname + ')')),
                        (u => (i18next.age(u.age) + ' ' + (u.prefecture ? i18next.t('prefecture.' + u.prefecture) : ''))),
                      ];

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users';
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

  function updateUser(user_id) {
    if(user_id) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + user_id + '/get';
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
          .catch(({response}) => {
            alert(response.status + ' ' + response.statusText);
          });
      }
    }
  }

  return (
    <React.Fragment>
      <UserList
        title={title}
        icon={<Users />}
        data={data}
        item_labels={item_labels}
        new_user
        form
        profile
        requirement
        partners
        question
        action="edit"
        updateUser={updateUser}
        search_items={['name', 'sex', 'prefecture', 'age', 'religion', 'role_matchmaker', 'member_sharing']}
      />
    </React.Fragment>
  );
};

export default withRouter(UserAll);
