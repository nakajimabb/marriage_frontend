import React from 'react';
import { spacing } from '@material-ui/system';
import {
  Hidden,
  CssBaseline,
  Paper as MuiPaper,
  withWidth
} from '@material-ui/core';
import styled, { createGlobalStyle } from 'styled-components';

import Sidebar from 'src/components/Sidebar';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

const drawerWidth = 260;

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${props => props.theme.body.background};
  }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${props => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${props => props.theme.body.background};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    drawerOpen: true,
  };

  handleMobileToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ drawerOpen: !state.drawerOpen }));
  };

  render() {
    const { children, routes } = this.props;

    return (
      <Root>
        <CssBaseline />
        <GlobalStyle />
        <Drawer hidden={!this.state.drawerOpen}>
          <Hidden mdUp implementation="js">
            <Sidebar
              routes={routes}
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={this.state.mobileOpen}
              onClose={this.handleMobileToggle}
            />
          </Hidden>
          <Hidden smDown implementation="css">
            <Sidebar
              routes={routes}
              PaperProps={{ style: { width: drawerWidth } }}
            />
          </Hidden>
        </Drawer>
        <AppContent>
          <Header onDrawerToggle={this.handleDrawerToggle} onMobileToggle={this.handleMobileToggle} />
          <MainContent>
            {children}
          </MainContent>
          <Footer />
        </AppContent>
      </Root>
    );
  }
}

export default withWidth()(Dashboard);
