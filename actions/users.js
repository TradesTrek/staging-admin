import { fetchWrapper } from '../helpers';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem('token')
);
export const LOGIN_P_SET_LOGIN_SPINNER_STATUS =
  'LOGIN_P_SET_LOGIN_SPINNER_STATUS';
export const SET_USERS = 'SET_USERS';

export function setloginSpinner(flag) {
  return {
    type: LOGIN_P_SET_LOGIN_SPINNER_STATUS,
    payload: flag,
  };
}

export function setUsers(flag) {
  return {
    type: SET_USERS,
    payload: flag,
  };
}

export function getUsers(page = 1,search='',option,filter) {
  return async (dispatch, getState) => {
    fetchWrapper
      .post(`${baseUrl}/admin/users/getAll?page=${page}&search=${search}`,{option,filter})
      .then((res) => {
        if(res.message=='Authorization Failed'){
          localStorage.removeItem("token");
          userSubject.next(null);
          Router.push("/");
        }else{
          dispatch(setUsers(res.users));
        }
       
      })
      .catch((error) => {
        //dispatch(setUsers(res));
      });
  };
}

export const initialState = {
  loginSpinner: false,
  users: [],
};

const ACTION_HANDLERS = {
  [LOGIN_P_SET_LOGIN_SPINNER_STATUS]: (state, action) => {
    return {
      ...state,
      loginSpinner: action.payload,
    };
  },
  [SET_USERS]: (state, action) => {
    return {
      ...state,
      users: action.payload,
    };
  },
};

export default function users(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
