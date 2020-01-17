import { combineReducers } from 'redux';

import themeReducer, { initialTheme } from './themeReducers';
import sessionReducer, { initialSession } from './sessionReducers';
import notificationReducer, { initialNotification } from './notificationReducers';

export const initialState = {
	theme: initialTheme,
	session: initialSession,
	notification: initialNotification,
};

export default combineReducers({
	theme: themeReducer,
	session: sessionReducer,
	notification: notificationReducer,
});
