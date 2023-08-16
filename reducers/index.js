import { combineReducers } from 'redux';
import users from '../actions/users';
import dashboard from '../actions/dashboard';
export const rootReducer = combineReducers({
  userReducer: users,
  dashboardReducer: dashboard,
});

export default rootReducer;
