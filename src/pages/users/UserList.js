import React from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import EditIcon from '@material-ui/icons/Edit';

import { logout } from "../../redux/actions/sessionActions";
import env from '../../environment';
import EnhancedTable from "../components/EnhancedTable";
import UserForm from "./UserForm";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.updateList = this.updateList.bind(this);
    this.openUserForm = this.openUserForm.bind(this);

    this.state = {
      columns: [
        { id: "id", numeric: true, disablePadding: true, label: "id", sortable: true },
        { id: "full_name", numeric: false, disablePadding: false, label: "name", sortable: true, f: n => n.last_name + ' ' + n.first_name },
        { id: "full_kana", numeric: false, disablePadding: false, label: "kana", sortable: true, f: n => n.last_name_kana + ' ' + n.first_name_kana },
        { id: "nickname", numeric: false, disablePadding: false, label: "nickname", sortable: true },
        { id: "email", numeric: false, disablePadding: false, label: "email", sortable: true },
        { id: "sex", numeric: false, disablePadding: false, label: "sex", sortable: true },
        { id: "birthday", numeric: false, disablePadding: false, label: "birthday", sortable: true },
        { id: "id", numeric: false, search: false, disablePadding: false, sortable: false, component: (<EditIcon />), props: (n) => ({ onClick: this.openUserForm(n)}) },
      ],
      open: false,
      user_id: null,
      data: [],
    };
  }

  componentDidMount() {
    this.updateList();
  }

  openUserForm = (n) => () => {
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
        console.log(json);
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
            <EnhancedTable columns={this.state.columns} data={this.state.data} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default connect(store => ({ session: store.sessionReducer }))(withRouter(UserList));
