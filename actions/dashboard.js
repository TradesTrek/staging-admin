import { fetchWrapper } from '../helpers';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
export const SET_STATS = 'SET_STATS';
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem('token')
);
export function setStats(flag) {
  return {
    type: SET_STATS,
    payload: flag,
  };
}

export function getStats(page = 1) {
  return async (dispatch, getState) => {
    fetchWrapper
      .get(`${baseUrl}/admin/stats`)
      .then((res) => {
        if(res.message=='Authorization Failed'){
          localStorage.removeItem("token");
          userSubject.next(null);
          Router.push("/");
        }else{
          dispatch(setStats(res));
        }
       
      })
      .catch((error) => {
        //dispatch(setStats(res));
      });
  };
}

export const initialState = {
  stats: [],
};

const ACTION_HANDLERS = {
  [SET_STATS]: (state, action) => {
    return {
      ...state,
      stats: action.payload,
    };
  },
};

export default function dashboard(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
