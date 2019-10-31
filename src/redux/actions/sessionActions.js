import Cookies from "js-cookie";
import * as types from '../constants';
import i18next from '../../i18n'

export function login(payload) {
  Cookies.set('headers', JSON.stringify(payload.headers));
  if(payload.user && payload.user.lang) {
    i18next.changeLanguage(payload.user.lang);
  }
  return {
    type: types.SESSION_LOGIN,
    payload
  }
}

export function logout() {
  Cookies.remove('headers');
  return {
    type: types.SESSION_LOGOUT,
  }
}
