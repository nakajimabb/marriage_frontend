import * as types from '../constants';


export const initialSession = {
  loggedIn: false,
  headers: null,
  user: {},
  roles: []
};

export default function reducer(state=initialSession, actions) {
  switch (actions.type) {

    case types.SESSION_LOGIN: {
      return {
        ...actions.payload,
        loggedIn: true,
      };
    }

    case types.SESSION_LOGOUT: {
      return {
        loggedIn: false,
        headers: null,
        user: {}
      };
    }

    default: {
      return state;
    }
  }
}
