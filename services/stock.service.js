import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);


function StocksNotSuspended() {
    return fetchWrapper
      .get(`${baseUrl}/stock/suspended?isSuspended=false`)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  function SuspendedStocks() {
    return fetchWrapper
      .get(`${baseUrl}/stock/suspended?isSuspended=true`)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }


  function toggleStocks(body) {
    return fetchWrapper
      .post(`${baseUrl}/stock/suspend`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  export const stockService = {
    user: userSubject.asObservable(),
    get userValue() {
      return userSubject.value;
    },
    StocksNotSuspended,
    toggleStocks,
    SuspendedStocks
  };
  