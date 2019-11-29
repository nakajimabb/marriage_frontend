import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Users } from "react-feather";
import axios from 'axios'

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import UserList from "./UserList";
import env from 'environment';


const UserAll = props => {
  const { dispatch, session, history } = props;
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

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserAll));
