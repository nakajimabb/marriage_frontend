import { combineReducers } from 'redux';

import themeReducer from './themeReducers';
import sessionReducer from './sessionReducers';
import notificationReducer from './notificationReducers';

export default combineReducers({
	themeReducer,
	sessionReducer,
	notificationReducer,
});
