import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router';
import {
  Avatar,
  Box as MuiBox,
  Collapse,
  Grid,
  Chip,
  ListItem,
  ListItemText,
  Drawer as MuiDrawer,
  List as MuiList,
  Typography
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { spacing } from '@material-ui/system';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { rgba, darken } from 'polished';

import { getRoutes } from 'src/routes';
import i18next from 'src/i18n';
import 'src/vendor/perfect-scrollbar.css';
import AppContext from 'src/contexts/AppContext';


const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Box = styled(MuiBox)(spacing);

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled(PerfectScrollbar)`
  background-color: ${props => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const List = styled(MuiList)`
  background-color: ${props => props.theme.sidebar.background};
`;

const Items = styled.div`
  padding-top: ${props => props.theme.spacing(2.5)}px;
  padding-bottom: ${props => props.theme.spacing(2.5)}px;
`;

const Brand = styled(ListItem)`
  font-size: ${props => props.theme.typography.h5.fontSize};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  color: ${props => props.theme.sidebar.header.color};
  background-color: ${props => props.theme.sidebar.header.background};
  font-family: ${props => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${props => props.theme.spacing(6)}px;
  padding-right: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

// const BrandIcon = styled(Layers)`
//   margin-right: ${props => props.theme.spacing(2)}px;
//   color: ${props => props.theme.sidebar.header.brand.color};
// `;

const Category = styled(ListItem)`
  padding-top: ${props => props.theme.spacing(3)}px;
  padding-bottom: ${props => props.theme.spacing(3)}px;
  padding-left: ${props => props.theme.spacing(6)}px;
  padding-right: ${props => props.theme.spacing(5)}px;
  font-weight: ${props => props.theme.typography.fontWeightRegular};

  svg {
    color: ${props => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.${props => props.activeClassName} {
    background-color: ${props => darken(0.05, props.theme.sidebar.background)};

    span {
      color: ${props => props.theme.sidebar.color};
    }
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${props => props.theme.sidebar.color};
    font-size: ${props => props.theme.typography.body1.fontSize}px;
    font-weight: ${props => props.theme.typography.fontWeightRegular};
    padding: 0 ${props => props.theme.spacing(4)}px;
  }
`;

const CategoryIconLess = styled(ExpandLess)`
  color: ${props => rgba(props.theme.sidebar.color, 0.5)};
`;

const CategoryIconMore = styled(ExpandMore)`
  color: ${props => rgba(props.theme.sidebar.color, 0.5)};
`;

const Link = styled(ListItem)`
  padding-left: ${props => props.theme.spacing(14)}px;
  padding-top: ${props => props.theme.spacing(2)}px;
  padding-bottom: ${props => props.theme.spacing(2)}px;

  span {
    color: ${props => rgba(props.theme.sidebar.color, 0.7)};
  }

  &:hover span {
    color: ${props => rgba(props.theme.sidebar.color, 0.9)};
  }

  &.${props => props.activeClassName} {
    background-color: ${props => darken(0.06, props.theme.sidebar.background)};

    span {
      color: ${props => props.theme.sidebar.color};
    }
  }
`;

const LinkText = styled(ListItemText)`
  color: ${props => props.theme.sidebar.color};
  span {
    font-size: ${props => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
`;

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${props => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 12px;
  top: 8px;
  background: ${props => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${props => props.theme.sidebar.badge.color};
    padding-left: ${props => props.theme.spacing(2)}px;
    padding-right: ${props => props.theme.spacing(2)}px;
  }
`;

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`;

const SidebarSection = styled(Typography)`
  color: ${props => props.theme.sidebar.color};
  padding: ${props => props.theme.spacing(2)}px
    ${props => props.theme.spacing(6)}px ${props => props.theme.spacing(1)}px;
  opacity: 0.9;
  display: block;
`;

const SidebarFooter = styled.div`
  background-color: ${props =>
    props.theme.sidebar.footer.background} !important;
  padding: ${props => props.theme.spacing(3)}px
    ${props => props.theme.spacing(4)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const SidebarFooterText = styled(Typography)`
  color: ${props => props.theme.sidebar.footer.color};
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-color: ${props => props.theme.sidebar.footer.online.background};
  display: inline-block;
  border-radius: 50%;
  margin-bottom: -0.5px;
`;

const SidebarCategory = ({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  ...rest
}) => {
  return (
    <Category {...rest}>
      {icon}
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIconMore />
        ) : (
          <CategoryIconLess />
        )
      ) : null}
      {badge ? <CategoryBadge label={badge} /> : ""}
    </Category>
  );
};

const SidebarLink = ({ name, to, badge }) => {
  return (
    <Link
      button
      dense
      component={NavLink}
      exact
      to={to}
      activeClassName="active"
    >
      <LinkText>{name}</LinkText>
      {badge ? <LinkBadge label={badge} /> : ""}
    </Link>
  );
};

const getState = (pathname, roles) => {
  const index = getRoutes(roles).findIndex(route => {
      if (pathname === '/') {
        return (route.path === pathname);
      } else {
        return (route.path !== '/' && pathname.indexOf(route.path) === 0);
      }
    }
  );
  return ~index ? {[index]: true} : {};
};

const Sidebar = props => {
  const {state: {session}} = useContext(AppContext);
  const { classes, staticContext, ...other } = props;
  const location = useLocation();
  const user = session.user;
  const [state, setState] = useState(getState(location.pathname, session.roles));

  useEffect(() => {
    setState(getState(location.pathname, session.roles));
  }, [location.pathname, session.roles]);

  const toggle = index => {
    setState({[index]: !state[index]});
  };

    return (
      <Drawer variant="permanent" {...other}>
        <Brand>
          <Avatar src="/logo.png" style={{ borderRadius: 0 }} />&nbsp;
          <Box ml={1}>Special4</Box>
        </Brand>
        <Scrollbar>
          <List disablePadding>
            <Items>
              {getRoutes(session.roles).map((category, index) => (
                <React.Fragment key={index}>
                  {category.header ? (
                    <SidebarSection variant="caption">
                      {category.header}
                    </SidebarSection>
                  ) : null}

                  {category.children ? (
                    <React.Fragment key={index}>
                      <SidebarCategory
                        isOpen={!state[index]}
                        isCollapsable={true}
                        name={i18next.t(category.id)}
                        icon={category.icon}
                        button={true}
                        onClick={() => toggle(index)}
                      />

                      <Collapse
                        in={state[index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        {category.children.map((route, index) => (
                          <SidebarLink
                            key={index}
                            name={i18next.t(route.name)}
                            to={route.path}
                            icon={route.icon}
                            badge={route.badge}
                          />
                        ))}
                      </Collapse>
                    </React.Fragment>
                  ) : (
                    <SidebarCategory
                      isCollapsable={false}
                      name={i18next.t(category.id)}
                      to={category.path}
                      activeClassName="active"
                      component={NavLink}
                      icon={category.icon}
                      exact
                      badge={category.badge}
                    />
                  )}
                </React.Fragment>
              ))}
            </Items>
          </List>
        </Scrollbar>
        <SidebarFooter>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                alt={ user.code }
                src={ user.avatar_url }
              />
            </Grid>
            <Grid item>
              <SidebarFooterText variant="body2">
                { user.last_name } { user.first_name }
              </SidebarFooterText>
              <SidebarFooterText variant="body2">
                <Dot />
                { session.loggedIn ? 'Online': 'Offline' }
              </SidebarFooterText>
            </Grid>
          </Grid>
        </SidebarFooter>
      </Drawer>
    );
};

export default Sidebar;
