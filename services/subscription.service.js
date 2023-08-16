import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";
import Router from "next/router";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);

function AddSubscription(data) {
  return fetchWrapper
    .post(`${baseUrl}/subscription/createSubscription`, data)
    .then((res) => {
      if(res.message=='Authorization Failed'){
        localStorage.removeItem("token");
        userSubject.next(null);
        Router.push("/");
      }else{
        return res;
      }
     
    })
    .catch(function (error) {
      return error;
    });
}
function unableDisableSub(id) {
  return fetchWrapper
    .put(`${baseUrl}/subscription/enable-disable-subscription?subId=${id}`)
    .then((res) => {
     return res
     
    })
    .catch(function (error) {
      return error;
    });
}
function getAllSubscription(data,page,search) {
  return fetchWrapper
    .post(`${baseUrl}/subscription/all?search=${search}&page=${page}`,data)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function downloadSubscription(search,data) {
  return fetchWrapper
    .post(`${baseUrl}/subscription/all-download?search=${search}`,data)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}

function deleteHoliday(userId) {
  return fetchWrapper
    .delete(`${baseUrl}/holiday/${userId}`)
    .then((res) => {
      return res
    })
    .catch(function (error) {
      return error;
    });
}
function updateSubscription(data) {
  return fetchWrapper
    .put(`${baseUrl}/subscription/updateSubscription`, data)
    .then((res) => {
      return res
    })
    .catch(function (error) {
      return error;
    });
}

export const subscriptionService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  AddSubscription,
  getAllSubscription,
  updateSubscription,
  downloadSubscription,
  unableDisableSub
};
