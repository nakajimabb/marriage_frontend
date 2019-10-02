import React from "react";
import i18next from '../i18n'

import async from "../components/Async";

import {
  BookOpen,
  CheckSquare,
  Grid,
  Heart,
  Key,
  Layout,
  List,
  Users
} from "react-feather";

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));

// Components components
const Avatars = async(() => import("../pages/components/Avatars"));
const Badges = async(() => import("../pages/components/Badges"));
const Buttons = async(() => import("../pages/components/Buttons"));
const Cards = async(() => import("../pages/components/Cards"));
const Chips = async(() => import("../pages/components/Chips"));
const Dialogs = async(() => import("../pages/components/Dialogs"));
const ExpPanels = async(() => import("../pages/components/ExpansionPanels"));
const Lists = async(() => import("../pages/components/Lists"));
const Menus = async(() => import("../pages/components/Menus"));
const Progress = async(() => import("../pages/components/Progress"));
const Snackbars = async(() => import("../pages/components/Snackbars"));
const Tooltips = async(() => import("../pages/components/Tooltips"));

// Forms components
const Pickers = async(() => import("../pages/forms/Pickers"));
const SelectionCtrls = async(() => import("../pages/forms/SelectionControls"));
const Selects = async(() => import("../pages/forms/Selects"));
const TextFields = async(() => import("../pages/forms/TextFields"));

// Icons components
const MaterialIcons = async(() => import("../pages/icons/MaterialIcons"));
const FeatherIcons = async(() => import("../pages/icons/FeatherIcons"));

// Pages components
const Blank = async(() => import("../pages/pages/Blank"));
const Invoice = async(() => import("../pages/pages/Invoice"));
const Pricing = async(() => import("../pages/pages/Pricing"));
const Settings = async(() => import("../pages/pages/Settings"));
const Tasks = async(() => import("../pages/pages/Tasks"));
const Projects = async(() => import("../pages/pages/Projects"));

// Tables components
const SimpleTable = async(() => import("../pages/tables/SimpleTable"));
const AdvancedTable = async(() => import("../pages/tables/AdvancedTable"));

// Documentation
const Docs = async(() => import("../pages/docs/Documentation"));

// Users
const UserList = async(() => import("../pages/users/UserList"));
const UserForm = async(() => import("../pages/users/UserForm"));

const pagesRoutes = {
  id: "Pages",
  path: "/pages",
  icon: <Layout />,
  children: [
    {
      path: "/pages/settings",
      name: "Settings",
      component: Settings
    },
    {
      path: "/pages/projects",
      name: "Projects",
      component: Projects,
      badge: "New"
    },
    {
      path: "/pages/invoice",
      name: "Invoice",
      component: Invoice
    },
    {
      path: "/pages/pricing",
      name: "Pricing",
      component: Pricing
    },
    {
      path: "/pages/tasks",
      name: "Tasks",
      component: Tasks,
      badge: "New"
    },
    {
      path: "/pages/blank",
      name: "Blank Page",
      component: Blank
    }
  ]
};

const documentationRoutes = {
  id: "Documentation",
  path: "/",
  icon: <BookOpen />,
  component: Docs,
  children: null
};

const componentsRoutes = {
  id: "Components",
  path: "/components",
  header: "Elements",
  icon: <Grid />,
  children: [
    {
      path: "/components/avatars",
      name: "Avatars",
      component: Avatars
    },
    {
      path: "/components/badges",
      name: "Badges",
      component: Badges
    },
    {
      path: "/components/buttons",
      name: "Buttons",
      component: Buttons
    },
    {
      path: "/components/cards",
      name: "Cards",
      component: Cards
    },
    {
      path: "/components/chips",
      name: "Chips",
      component: Chips
    },
    {
      path: "/components/dialogs",
      name: "Dialogs",
      component: Dialogs
    },
    {
      path: "/components/expansion-panels",
      name: "Expansion Panels",
      component: ExpPanels
    },
    {
      path: "/components/lists",
      name: "Lists",
      component: Lists
    },
    {
      path: "/components/menus",
      name: "Menus",
      component: Menus
    },
    {
      path: "/components/progress",
      name: "Progress",
      component: Progress
    },
    {
      path: "/components/snackbars",
      name: "Snackbars",
      component: Snackbars
    },
    {
      path: "/components/tooltips",
      name: "Tooltips",
      component: Tooltips
    }
  ]
};

const formsRoutes = {
  id: "Forms",
  path: "/forms",
  icon: <CheckSquare />,
  children: [
    {
      path: "/forms/pickers",
      name: "Pickers",
      component: Pickers
    },
    {
      path: "/forms/selection-controls",
      name: "Selection Controls",
      component: SelectionCtrls
    },
    {
      path: "/forms/selects",
      name: "Selects",
      component: Selects
    },
    {
      path: "/forms/text-fields",
      name: "Text Fields",
      component: TextFields
    }
  ]
};

const tablesRoutes = {
  id: "Tables",
  path: "/tables",
  icon: <List />,
  children: [
    {
      path: "/tables/simple-table",
      name: "Simple Table",
      component: SimpleTable
    },
    {
      path: "/tables/advanced-table",
      name: "Advanced Table",
      component: AdvancedTable
    }
  ]
};

const iconsRoutes = {
  id: "Icons",
  path: "/icons",
  icon: <Heart />,
  children: [
    {
      path: "/icons/material-icons",
      name: "Material Icons",
      component: MaterialIcons
    },
    {
      path: "/icons/feather-icons",
      name: "Feather Icons",
      component: FeatherIcons
    }
  ]
};

// This route is not visisble in the sidebar
const privateRoutes = {
  id: "Private",
  path: "/private",
  component: Blank,
  children: null
};

const adminRoutes = {
  id: i18next.t('dict.admin') + i18next.t('dict.tool'),
  path: "/users",
  icon: <Key />,
  children: [
    {
      path: "/users",
      name: i18next.model('user') + i18next.t('dict.list'),
      component: UserList
    },
  ]
};

export const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    }
  ]
};

export const getRoutes = (roles) => {
  let routes = [documentationRoutes];
  if(roles && ~roles.indexOf('admin'))
    routes.push(adminRoutes);

  return routes;
};

export default (roles) => {
  let routes = [documentationRoutes];
  if(roles && ~roles.indexOf('admin'))
    routes.push(adminRoutes);

  return routes;
};
