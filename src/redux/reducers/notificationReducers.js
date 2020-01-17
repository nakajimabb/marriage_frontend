import * as types from '../constants';


export const initialNotification = {
  count: 0,
};

export default function reducer(state=initialNotification, actions) {
  switch (actions.type) {

    case types.SET_COUNT: {
      return actions.payload;
    }

    default: {
      return state;
    }
  }
}
