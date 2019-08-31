import Cookies from "js-cookie";
import * as types from '../constants';

export function login(payload) {
  Cookies.set('headers', JSON.stringify(payload.headers));
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
