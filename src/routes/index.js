import React from "react";
import { SupervisedUserCircle, PeopleOutline, AllInclusive } from "@material-ui/icons";
import { Heart, UserPlus, Users, Settings } from "react-feather";

import async from "../components/Async";


// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));

// Users
const MemberList = async(() => import("../pages/users/MemberList"));
const ViewableList = async(() => import("../pages/users/ViewableList"));
const MatchmakerList = async(() => import("../pages/users/MatchmakerList"));
const UserAll = async(() => import("../pages/users/UserAll"));
const MyProfile = async(() => import("../pages/users/MyProfile"));
const PermittedList = async(() => import("../pages/users/PermittedList"));

const courtshipRoutes = [
  {
    id: 'views.user.permitted_users',
    path: "/courtship/permitted_users",
    icon: <Heart />,
    component: PermittedList,
    children: null
  },
];


const commonRoutes = [
  {
    id: 'views.user.account',
    path: "/",
    icon: <Settings />,
    component: MyProfile,
    children: null
  },
];

const matchmakerRoutes = [
  {
    id: 'views.user.members',
    path: "/matchmaker/members",
    icon: <UserPlus />,
    component: MemberList,
    children: null,
  },
  {
    id: 'views.user.viewable',
    path: "/matchmaker/viewable",
    icon: <Users />,
    component: ViewableList,
    children: null,
  },
  {
    id: 'views.user.matchmakers',
    path: "/matchmaker/matchmakers",
    icon: <AllInclusive />,
    component: MatchmakerList,
    children: null,
  },
];

const headRoutes = [
  {
    id: 'views.user.head_menu',
    path: "/head",
    icon: <SupervisedUserCircle />,
    children: [
      {
        path: "/head/all",
        name: 'views.user.list',
        icon: <PeopleOutline />,
        component: UserAll
      },
    ]
  },
];

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
  let routes = [];
  if(roles && ~roles.indexOf('courtship'))
    routes = routes.concat(courtshipRoutes);
  if(roles && ~roles.indexOf('matchmaker'))
    routes = routes.concat(matchmakerRoutes);
  routes = routes.concat(commonRoutes);
  if(roles && ~roles.indexOf('head'))
    routes = routes.concat(headRoutes);

  return routes;
};

export default (roles, lang) => {
  let routes = [];
  if(roles && ~roles.indexOf('courtship'))
    routes = routes.concat(courtshipRoutes);
  if(roles && ~roles.indexOf('matchmaker'))
    routes = routes.concat(matchmakerRoutes);
  routes = routes.concat(commonRoutes);
  if(roles && ~roles.indexOf('head'))
    routes = routes.concat(headRoutes);

  return routes;
};
