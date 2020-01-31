import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import {
  Bell,
  MessageSquare,
  Search as SearchIcon,
  Power
} from 'react-feather';
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
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import styled from 'styled-components';
import { darken } from 'polished';

import { logout } from 'src/redux/actions/sessionActions';
import AppContext from 'src/contexts/AppContext';
import NotificationList from './NotificationList';
import Settings from './Settings';


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


const UserMenu = () => {
  const { dispatch } = useContext(AppContext);
  const history = useHistory();
  const [state, setState] = useState(null);
  const open = Boolean(state);

  const toggleMenu = event => {
    setState(event.currentTarget);
  };

  const closeMenu = () => {
    setState(null);
  };

  const signOut = () => {
    dispatch(logout());
    history.push('/auth/sign-in');
  };

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
        >
          <Power />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={state}
          open={open}
          onClose={closeMenu}
        >
          <MenuItem
            onClick={() => {
              closeMenu();
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
};


const Header = ({ onDrawerToggle, onMobileToggle }) => {
  const {state: {notification}} = useContext(AppContext);
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
              <UserMenu />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
