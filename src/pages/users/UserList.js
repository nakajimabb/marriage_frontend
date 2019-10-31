import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios'

import { Grid, Divider as MuiDivider, Typography } from "@material-ui/core";
import { Edit as EditIcon, AddOutlined as AddIcon, DeleteSharp as DeleteIcon } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { spacing } from "@material-ui/system";

import i18next from 'i18n'
import { logout } from "redux/actions/sessionActions";
import env from 'environment';
import { str } from 'helpers';
import EnhancedTable from "pages/components/EnhancedTable";
import UserForm from "./UserForm";


const Divider = styled(MuiDivider)(spacing);

const UserList = props => {
  const { dispatch, session, history } = props;
  const [open, setOpen] = useState(false);
  const [user_id, setUserId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users';
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

  const openUserNewForm = () => {
    setOpen(true);
    setUserId(null);
  };

  const openUserEditForm = (n) => () => {
    setOpen(true);
    setUserId(n.id);
  };

  const destroyUser = (n) => () => {
    if(window.confirm(i18next.t('message.confirm_delete'))) {
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + n.id;
        axios.delete(url, {headers})
          .then((results) => {
            setData(data.filter(user => user.id !== n.id));
          })
          .catch((data) => {
            alert('データの削除に失敗しました。');
          });
      }
    }
  };

  const closeUserForm = () => {
    setOpen(false);
  };

  const columns = [
    { id: "id", numeric: true, disablePadding: true, label: i18next.attr('user', 'id'), sortable: true, f: n => str(n.id, '', '0', 5) },
    { id: "full_name", numeric: false, disablePadding: false, label: i18next.attr('user', 'name'), sortable: true, f: n => str(n.last_name) + ' ' + str(n.first_name) },
    { id: "full_kana", numeric: false, disablePadding: false, label: i18next.attr('user', 'kana'), sortable: true, f: n => str(n.last_name_kana) + ' ' + str(n.first_name_kana) },
    { id: "nickname", numeric: false, disablePadding: false, label: i18next.attr('user', 'nickname'), sortable: true },
    { id: "email", numeric: false, disablePadding: false, label: i18next.attr('user', 'email'), sortable: true },
    { id: "sex", numeric: false, disablePadding: false, label: i18next.attr('user', 'sex'), sortable: true },
    { id: "birthday", numeric: false, disablePadding: false, label: i18next.attr('user', 'birthday'), sortable: true },
    { id: "id", numeric: false, search: false, disablePadding: true, sortable: false,
      component: (<IconButton size="small"><EditIcon fontSize="small" /></IconButton>), props: (n) => ({ onClick: openUserEditForm(n) }) },
    { id: "id", numeric: false, search: false, disablePadding: true, sortable: false,
      component: (<IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>), props: (n) => ({ onClick: destroyUser(n) }) },
  ];

  const submenus = [
    { component: (<Fab size="small"><AddIcon style={{ fontSize: 36 }}/></Fab>), props: ({ onClick: openUserNewForm }) },
  ];

  return (
    <React.Fragment>
      { (() => {
        if (open)
          return (<UserForm user_id={user_id} open={open} onClose={closeUserForm} fullScreen maxWidth="md" />);
        })()
      }
      <Typography variant="h3" gutterBottom display="inline">
        { i18next.t('views.user.list') }
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EnhancedTable columns={columns} data={data} submenus={submenus} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserList));
