import Cookies from "js-cookie";
import * as types from '../constants';
import i18next from '../../i18n'

export function login(payload) {
  Cookies.set('headers', JSON.stringify(payload.headers));

  let roles = [];
  const user = payload.user;
  if(user) {
    if(user.role_courtship) roles.push('courtship');
    if(user.role_matchmaker) roles.push('matchmaker');
    if(user.role_head) roles.push('head');

    if(user.lang) i18next.changeLanguage(payload.user.lang);
  }
  return {
    type: types.SESSION_LOGIN,
    payload: Object.assign({roles: roles}, payload)
  }
}

export function logout() {
  Cookies.remove('headers');
  return {
    type: types.SESSION_LOGOUT,
  }
}
