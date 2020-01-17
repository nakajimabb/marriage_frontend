import Cookies from "js-cookie";
import * as types from '../constants';

export function setTheme(value) {
  Cookies.set('theme', value, { expires: 365 });

  return {
    type: types.SET_THEME,
    payload: value
  }
}
