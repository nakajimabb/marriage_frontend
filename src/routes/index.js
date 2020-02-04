import React, { lazy } from 'react';
import { SupervisedUserCircle, AllInclusive, EventNote } from '@material-ui/icons';
import { Heart, UserPlus, Users, Settings } from 'react-feather';


// Auth components
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Page404 = lazy(() => import("../pages/auth/Page404"));
const Page500 = lazy(() => import("../pages/auth/Page500"));

// Users
const MemberList = lazy(() => import("../pages/users/MemberList"));
const ViewableList = lazy(() => import("../pages/users/ViewableList"));
const MatchmakerList = lazy(() => import("../pages/users/MatchmakerList"));
const UserAll = lazy(() => import("../pages/users/UserAll"));
const WaitingList = lazy(() => import("../pages/users/WaitingList"));
const MyProfile = lazy(() => import("../pages/users/MyProfile"));
const PermittedList = lazy(() => import("../pages/users/PermittedList"));
const QuestionAll = lazy(() => import("../pages/questions/QuestionAll"));
const RoomList = lazy(() => import("../pages/rooms/RoomList"));

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
    id: 'views.room.list',
    path: "/rooms/list",
    icon: <EventNote />,
    component: RoomList,
    children: null
  },
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
        path: "/head/user_all",
        name: 'views.user.list',
        component: UserAll
      },
      {
        path: "/head/waiting_list",
        name: 'views.user.waiting_list',
        component: WaitingList
      },
      {
        path: "/head/question_all",
        name: 'views.question.list',
        component: QuestionAll
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
