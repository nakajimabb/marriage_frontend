import * as types from '../constants';


const initialState = {
  loggedIn: false,
  headers: null,
  user: {}
};

export default function reducer(state=initialState, actions) {
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
