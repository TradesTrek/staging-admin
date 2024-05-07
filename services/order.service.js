import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";
import Router from "next/router";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);

function getAllPendingOrder(page,search = "",body={}) {
  return fetchWrapper
    .post(`${baseUrl}/stock/pending?search=${search}&page=${page}`,body)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllHelpAndSupport(page,search = "",body={}) {
  return fetchWrapper
    .post(`${baseUrl}/support/all?search=${search}&page=${page}`,body)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllHelpAndSupportDownload(search = "",body={}) {
  return fetchWrapper
    .post(`${baseUrl}/support/all-download?search=${search}`,body)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function downloadPendingOrder(search,option) {
  return fetchWrapper
    .post(`${baseUrl}/stock/download/pending?search=${search}`,option)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllFailedOrder(page,search = "",data) {
  return fetchWrapper
    .post(`${baseUrl}/stock/failed?search=${search}&page=${page}`,data)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function downloadFailedOrder(search,option) {
  return fetchWrapper
    .post(`${baseUrl}/stock/download/failed?search=${search}`,option)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllCancelOrder(page,search = "",data) {
  return fetchWrapper
    .post(`${baseUrl}/stock/cancel?search=${search}&page=${page}`,data)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function downloadCancelOrder(search,body) {
  return fetchWrapper
    .post(`${baseUrl}/stock/download/cancel?search=${search}`,body)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllHoldingOrder(page,search = "",data) {
  return fetchWrapper
    .post(`${baseUrl}/stock/holding?search=${search}&page=${page}`,data)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function downloadHoldingOrder(search,option) {
  return fetchWrapper
    .post(`${baseUrl}/stock/download/holding?search=${search}`,option)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllShortOrder(page,search = "",data={}) {
  return fetchWrapper
    .post(`${baseUrl}/stock/short?search=${search}&page=${page}`,data)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function downloadShortOrder(search,option) {
  return fetchWrapper
    .post(`${baseUrl}/stock/download/short?search=${search}`,option)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
// downloadFailedOrder
export const orderService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  getAllPendingOrder,
  downloadPendingOrder,
  getAllFailedOrder,
  downloadFailedOrder,
  getAllCancelOrder,
  downloadCancelOrder,
  getAllHoldingOrder,
  downloadHoldingOrder,
  getAllShortOrder,
  downloadShortOrder,
  getAllHelpAndSupport,
  getAllHelpAndSupportDownload

 
};
