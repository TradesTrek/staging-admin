/** @format */

import { combineReducers } from 'redux';
import locks from './components/locks/lock-reducer';
import companiesAndPerson from './reducers/company-person-reducer';
import AllPersons from "./components/property-manager/person/person-reducer"
export const rootReducer = combineReducers({
  userLocks: locks,
  companiesAndPerson: companiesAndPerson,
  allPersons : AllPersons,
});

export default rootReducer;
