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

import { logout } from "../../redux/actions/sessionActions";
import env from '../../environment';
import EnhancedTable from "../components/EnhancedTable";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.updateList = this.updateList.bind(this);

    this.state = {
      columns: [
        { id: "id", numeric: true, disablePadding: true, label: "id" },
        { id: "full_name", numeric: false, disablePadding: false, label: "name", f: n => n.last_name + ' ' + n.first_name },
        { id: "full_kana", numeric: false, disablePadding: false, label: "kana", f: n => n.last_name_kana + ' ' + n.first_name_kana },
        { id: "nickname", numeric: false, disablePadding: false, label: "nickname" },
        { id: "email", numeric: false, disablePadding: false, label: "email" },
        { id: "sex", numeric: false, disablePadding: false, label: "sex" },
        { id: "birthday", numeric: false, disablePadding: false, label: "birthday" },
      ],
      data: [],
    };
  }

  componentDidMount() {
    this.updateList();
  }

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
        <Typography variant="h3" gutterBottom display="inline">
          Advanced Table
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link component={NavLink} exact to="/">
            Dashboard
          </Link>
          <Link component={NavLink} exact to="/">
            Tables
          </Link>
          <Typography>Advanced Table</Typography>
        </Breadcrumbs>

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
