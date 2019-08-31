import { combineReducers } from 'redux';

import themeReducer from './themeReducers';
import sessionReducer from './sessionReducers';

export default combineReducers({
	themeReducer,
	sessionReducer,
});
