import * as types from '../constants';

export const initialTheme = {
  currentTheme: 0
};

export default function reducer(state=initialTheme, actions) {
  switch (actions.type) {

    case types.SET_THEME:
      return {
        ...state,
        currentTheme: actions.payload
      };

    default:
      return state;
  }
}
