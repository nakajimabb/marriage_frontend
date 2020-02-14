import React, { lazy } from 'react';
import { SupervisedUserCircle, AllInclusive, EventNote, Group } from '@material-ui/icons';
import { Heart, UserPlus, Users, Settings, Meh } from 'react-feather';
import i18next from 'src/i18n'


// Auth components
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Page404 = lazy(() => import("../pages/auth/Page404"));
const Page500 = lazy(() => import("../pages/auth/Page500"));
const UserAccept = lazy(() => import("../pages/users/UserAccept"));

// Users
const MuiUserAll = lazy(() => import("../pages/users/UserAll"));
const MyProfile = lazy(() => import("../pages/users/MyProfile"));
const QuestionAll = lazy(() => import("../pages/questions/QuestionAll"));
const RoomList = lazy(() => import("../pages/rooms/RoomList"));

const item_labels = [
  (u => (u.last_name + ' ' + u.first_name + ' (' + u.nickname + ')')),
  (u => (i18next.age(u.age) + ' ' + (u.prefecture ? i18next.t('prefecture.' + u.prefecture) : ''))),
];

const UserAll = () => (<MuiUserAll mode={'admin'}
                                   title={i18next.t('views.user.list')}
                                   new_user
                                   icon={<Group />}
                                   api={{get: 'edit'}}
                                   tabs={['form', 'profile', 'requirement', 'partners', 'question']}
                                   item_labels={item_labels}
                                   search_items={['name', 'sex', 'prefecture', 'age', 'religion', 'status', 'role_matchmaker', 'member_sharing']}
                        />);
const WaitingUsers = () => (<MuiUserAll mode={'head'}
                                       title={i18next.t('views.user.waiting_users')}
                                       icon={<Meh />}
                                       api={{get: 'edit'}}
                                       tabs={['form', 'profile', 'question']}
                                       item_labels={item_labels}
                                       params={{status: 'check_head'}}
                            />);

const MemberList = () => (<MuiUserAll mode={'matchmaker'}
                                      title={i18next.t('views.user.members')}
                                      invite_user
                                      icon={<UserPlus />}
                                      api={{list: 'members', get: 'edit'}}
                                      item_labels={item_labels}
                                      tabs={['form', 'profile', 'requirement', 'partners', 'question']}
                                      search_items={['name', 'sex', 'prefecture', 'age', 'religion', 'status']}
                            />);
const WaitingMembers = () => (<MuiUserAll mode={'matchmaker'}
                                      title={i18next.t('views.user.waiting_members')}
                                      icon={<Meh />}
                                      api={{list: 'members', get: 'edit'}}
                                      item_labels={item_labels}
                                      params={{status: 'check_matchmaker'}}
                                      tabs={['form', 'profile', 'requirement', 'partners', 'question']}
                          />);
const ViewableList = () => (<MuiUserAll mode={'matchmaker'}
                                      title={i18next.t('views.user.viewable')}
                                      icon={<Users />}
                                      api={{list: 'viewable'}}
                                      tabs={['profile']}
                          />);

const MatchmakerList = () => (<MuiUserAll mode={'matchmaker'}
                                        title={i18next.t('views.user.matchmakers')}
                                        icon={<AllInclusive />}
                                        api={{list: 'matchmakers'}}
                                        tabs={['profile']}
                                        search_items={['name', 'sex', 'prefecture', 'age', 'religion', 'member_sharing', 'friend']}
                                />);

const PartnerMatches = () => (<MuiUserAll mode={'matchmaker'}
                                        title={i18next.t('views.user.my_partner_matches')}
                                        icon={<Heart />}
                                        api={{list: 'my_partner_matches'}}
                                        tabs={['profile']}
                                        search_items={['name', 'prefecture', 'age', 'religion']}
                            />);


const courtshipRoutes = [
  {
    id: 'views.user.my_partner_matches',
    path: "/courtship/my_partner_matches",
    icon: <Heart />,
    component: PartnerMatches,
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
    id: 'views.user.waiting_members',
    path: "/matchmaker/waiting_members",
    icon: <Meh />,
    component: WaitingMembers,
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
        path: "/head/waiting_users",
        name: 'views.user.waiting_users',
        component: WaitingUsers
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
      path: "/auth/accept/:invitation_token",
      name: "accept",
      component: UserAccept
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
    },
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
