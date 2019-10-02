import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  Grid,
  Divider as MuiDivider,
  Typography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon, AddOutlined as AddIcon, DeleteSharp as DeleteIcon } from '@material-ui/icons';

import i18next from 'i18next'
import axios from 'axios'

import { logout } from "../../redux/actions/sessionActions";
import env from '../../environment';
import { str } from '../../tools/str';
import EnhancedTable from "../components/EnhancedTable";
import UserForm from "./UserForm";

const Divider = styled(MuiDivider)(spacing);


class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      { id: "id", numeric: true, disablePadding: true, label: i18next.attr('user', 'id'), sortable: true, f: n => str(n.id, '', '0', 5) },
      { id: "full_name", numeric: false, disablePadding: false, label: i18next.attr('user', 'name'), sortable: true, f: n => str(n.last_name) + ' ' + str(n.first_name) },
      { id: "full_kana", numeric: false, disablePadding: false, label: i18next.attr('user', 'kana'), sortable: true, f: n => str(n.last_name_kana) + ' ' + str(n.first_name_kana) },
      { id: "nickname", numeric: false, disablePadding: false, label: i18next.attr('user', 'nickname'), sortable: true },
      { id: "email", numeric: false, disablePadding: false, label: i18next.attr('user', 'email'), sortable: true },
      { id: "sex", numeric: false, disablePadding: false, label: i18next.attr('user', 'sex'), sortable: true },
      { id: "birthday", numeric: false, disablePadding: false, label: i18next.attr('user', 'birthday'), sortable: true },
      { id: "id", numeric: false, search: false, disablePadding: true, sortable: false,
        component: (<IconButton size="small"><EditIcon fontSize="small" /></IconButton>), props: (n) => ({ onClick: this.openUserEditForm(n) }) },
      { id: "id", numeric: false, search: false, disablePadding: true, sortable: false,
        component: (<IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>), props: (n) => ({ onClick: this.destroyUser(n) }) },
    ];
    this.submenus = [
      { component: (<Fab size="small"><AddIcon style={{ fontSize: 36 }}/></Fab>), props: ({ onClick: this.openUserNewForm }) },
    ];

    this.state = {
      open: false,
      user_id: null,
      data: [],
    };

    this.updateList = this.updateList.bind(this);
    this.openUserNewForm = this.openUserNewForm.bind(this);
    this.openUserEditForm = this.openUserEditForm.bind(this);
    this.destroyUser = this.destroyUser.bind(this);
  }

  componentDidMount() {
    this.updateList();
  }

  openUserNewForm = () => {
    this.setState({open: true, user_id: null});
  };

  openUserEditForm = (n) => () => {
    this.setState({open: true, user_id: n.id});
  };

  destroyUser = (n) => () => {
    if(window.confirm(i18next.t('message.confirm_delete'))) {
      const { session } = this.props;
      const { data } = this.state;
      const headers  = session.headers;
      if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
        const url = env.API_ORIGIN + 'api/users/' + n.id;
        axios.delete(url, {headers})
          .then((results) => {
            this.setState({ data: data.filter(user => user.id != n.id) });
          })
          .catch((data) => {
            alert('データの削除に失敗しました。');
          });
      }
    }
  };

  closeUserForm = () => {
    this.setState({ open: false });
  };

  updateList = async () =>  {
    const { dispatch, session, history } = this.props;

    const headers  = session.headers;
    if(headers && headers['access-token'] && headers['client'] && headers['uid']) {
      const url = env.API_ORIGIN + 'api/users';
      let response = await fetch(url, {method: 'GET', headers});
      if (response.ok) {
        let json = await response.json();
        this.setState({data: json.users});
      } else {
        alert("データの取得に失敗しました。(" + response.status + ' ' + response.statusText + ')');
      }
    }
    else {
      dispatch(logout());
      history.push('/auth/sign-in');
    }
  };

  render() {
    return (
      <React.Fragment>
        <UserForm user_id={this.state.user_id} open={this.state.open} onClose={this.closeUserForm} />
        <Typography variant="h3" gutterBottom display="inline">
          { i18next.model('user') } { i18next.t('dict.list') }
        </Typography>

        <Divider my={6} />

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <EnhancedTable columns={this.columns} data={this.state.data} submenus={this.submenus} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserList));
