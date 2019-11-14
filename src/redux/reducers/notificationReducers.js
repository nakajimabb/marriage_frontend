import * as types from '../constants';


const initialState = {
  count: 0,
};

export default function reducer(state=initialState, actions) {
  switch (actions.type) {

    case types.SET_COUNT: {
      return actions.payload;
    }

    default: {
      return state;
    }
  }
}
