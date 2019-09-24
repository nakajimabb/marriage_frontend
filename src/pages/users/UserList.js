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

import { Edit as EditIcon, AddCircleOutlineSharp as AddIcon } from '@material-ui/icons';

import i18next from 'i18next'

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
      { id: "full_name", numeric: false, disablePadding: false, label: i18next.attr('user', 'name'), sortable: true, f: n => n.last_name + ' ' + n.first_name },
      { id: "full_kana", numeric: false, disablePadding: false, label: i18next.attr('user', 'kana'), sortable: true, f: n => n.last_name_kana + ' ' + n.first_name_kana },
      { id: "nickname", numeric: false, disablePadding: false, label: i18next.attr('user', 'nickname'), sortable: true },
      { id: "email", numeric: false, disablePadding: false, label: i18next.attr('user', 'email'), sortable: true },
      { id: "sex", numeric: false, disablePadding: false, label: i18next.attr('user', 'sex'), sortable: true },
      { id: "birthday", numeric: false, disablePadding: false, label: i18next.attr('user', 'birthday'), sortable: true },
      { id: "id", numeric: false, search: false, disablePadding: false, sortable: false,
        component: (<EditIcon className="fa fa-plus-circle" />), props: (n) => ({ onClick: this.openUserEditForm(n) }) },
    ];
    this.submenus = [
      { component: (<AddIcon style={{ fontSize: 36 }} />), props: ({ onClick: this.openUserNewForm }) },
    ];

    this.state = {
      open: false,
      user_id: null,
      data: [],
    };

    this.updateList = this.updateList.bind(this);
    this.openUserNewForm = this.openUserNewForm.bind(this);
    this.openUserEditForm = this.openUserEditForm.bind(this);
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
          User List
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
