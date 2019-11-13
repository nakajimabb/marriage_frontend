import * as types from '../constants';
import Cookies from "js-cookie";

export function setTheme(value) {
  Cookies.set('theme', value, { expires: 365 });

  return {
    type: types.SET_THEME,
    payload: value
  }
}
