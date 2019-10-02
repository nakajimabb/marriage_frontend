import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { getRoutes, authRoutes } from "./index";
import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import AuthGuard from "../components/AuthGuard";
import {connect} from "react-redux";

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
  const { session } = props;
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

export default connect(store => ({ session: store.sessionReducer  }))(Routes);
