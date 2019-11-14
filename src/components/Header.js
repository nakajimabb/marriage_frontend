import React, {Component, useState} from "react";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import { darken } from "polished";
import { withRouter } from "react-router-dom";

import {
  Badge,
  Grid,
  Hidden,
  InputBase,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar
} from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";

import {
  Bell,
  MessageSquare,
  Search as SearchIcon,
  Power
} from "react-feather";

import { logout } from "../redux/actions/sessionActions";
import Settings from "./Settings";
import NotificationList from "./NotificationList";


const AppBar = styled(MuiAppBar)`
  background: ${props => props.theme.header.background};
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${props => props.theme.header.indicator.background};
    color: ${props => props.theme.palette.common.white};
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${props => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${props => darken(0.05, props.theme.header.background)};
  }

  ${props => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${props => props.theme.header.search.color};
    padding-top: ${props => props.theme.spacing(2.5)}px;
    padding-right: ${props => props.theme.spacing(2.5)}px;
    padding-bottom: ${props => props.theme.spacing(2.5)}px;
    padding-left: ${props => props.theme.spacing(12)}px;
    width: 160px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

class UserMenu extends Component {
  state = {
    anchorMenu: null
  };

  toggleMenu = event => {
    this.setState({ anchorMenu: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorMenu: null });
  };

  signOut = () => {
    const { dispatch, history } = this.props;

    dispatch(logout());
    history.push('/auth/sign-in');
  };

  render() {
    const { anchorMenu } = this.state;
    const open = Boolean(anchorMenu);

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={this.toggleMenu}
          color="inherit"
        >
          <Power />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorMenu}
          open={open}
          onClose={this.closeMenu}
        >
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.signOut();
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

UserMenu = connect(store => ({ session: store.sessionReducer }))(withRouter(UserMenu));

const Header = ({ onDrawerToggle, onMobileToggle, notification }) => {
  const [open_notification, setOpenNotification] = useState(false);

  return (
    <React.Fragment>
      <NotificationList open={open_notification} onClose={() => setOpenNotification(false)} />
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item>
              <Hidden mdUp>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onMobileToggle}
                >
                  <MenuIcon/>
                </IconButton>
              </Hidden>
              <Hidden smDown>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                >
                  <MenuIcon/>
                </IconButton>
              </Hidden>
            </Grid>

            <Grid item>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon/>
                </SearchIconWrapper>
                <Input placeholder="Search projects…"/>
              </Search>
            </Grid>
            <Grid item xs/>
            <Grid item>
              <IconButton color="inherit">
                <Indicator badgeContent={0}>
                  <MessageSquare/>
                </Indicator>
              </IconButton>
              <IconButton color="inherit" onClick={() => setOpenNotification(true)}>
                <Indicator badgeContent={notification.count} >
                  <Bell/>
                </Indicator>
              </IconButton>
              <Settings/>
              <UserMenu/>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

// export default connect()(withTheme(Header));
export default connect(store => (
    { session: store.sessionReducer,
      notification: store.notificationReducer
    }
  )
)(withRouter(Header));
