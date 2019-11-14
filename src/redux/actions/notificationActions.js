import * as types from '../constants';

export function setNotification(payload) {
  return {
    type: types.SET_COUNT,
    payload
  }
}
