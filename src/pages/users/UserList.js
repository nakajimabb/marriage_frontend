import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios'

import { Grid, Divider as MuiDivider, Typography } from "@material-ui/core";
import { Edit as EditIcon, PersonAdd as AddIcon } from '@material-ui/icons';
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

  const closeUserForm = () => {
    setOpen(false);
  };

  const columns = [
    { id: "id", numeric: true, disablePadding: true, label: i18next.attr('user', 'id'), sortable: true, f: n => str(n.id, '', '0', 5) },
    { id: "full_name", disablePadding: false, label: i18next.attr('user', 'name'), sortable: true, f: n => str(n.last_name) + ' ' + str(n.first_name) },
    { id: "nickname", disablePadding: false, label: i18next.attr('user', 'nickname'), sortable: true },
    { id: "age", numeric: true, disablePadding: false, label: i18next.attr('user', 'age'), sortable: true },
    { id: "prefecture", disablePadding: false, label: i18next.attr('user', 'prefecture'), sortable: true, f: n => n.prefecture ? i18next.t('prefecture.' + n.prefecture) : '' },
    { id: "religion", disablePadding: false, label: i18next.attr('user', 'religion'), sortable: true, f: n => n.religion ? i18next.enum('user', 'religion', n.religion) : '' },
    { id: "id", search: false, disablePadding: true, sortable: false,
      component: (<IconButton size="small"><EditIcon fontSize="small" /></IconButton>), props: (n) => ({ onClick: openUserEditForm(n) }) },
  ];

  const submenus = [
    { component: (<Fab size="medium"><AddIcon/></Fab>), props: ({ onClick: openUserNewForm }) },
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
