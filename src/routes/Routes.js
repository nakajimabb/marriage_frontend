import React, { useContext } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import DashboardLayout from 'src/layouts/Dashboard';
import AuthLayout from 'src/layouts/Auth';
import Page404 from 'src/pages/auth/Page404';
import AuthGuard from 'src/components/AuthGuard';
import AppContext from 'src/contexts/AppContext';
import { getRoutes, authRoutes } from './index';


const childRoutes = (Layout, routes) =>
  routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          exact
          render={props => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ))
    ) : (
      // Route item without children
      <Route
        key={index}
        path={path}
        exact
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    )
  );

const Routes = (props) => {
  const {state: {session}} = useContext(AppContext);

  const routes = getRoutes(session.roles);
  return (
    <Router>
      <Switch>
        {childRoutes(AuthLayout, [authRoutes])}
      </Switch>
      <AuthGuard props={props}>
        <Switch>
          {childRoutes(DashboardLayout, routes)}
          <Route
            render={() => (
              <AuthLayout>
                <Page404/>
              </AuthLayout>
            )}
          />
        </Switch>
      </AuthGuard>
    </Router>
  );
};

export default Routes;
