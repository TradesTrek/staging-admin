import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);


function getAllStockSectors() {
  return fetchWrapper
    .get(`${baseUrl}/stock/sectors`)

    .then((res) => {
      if (res.success) {
      }
      return res;
    })
    .catch((error) => {
      if (error?.length > 0) {
        return error[0];
      }
      return error;
    });
}

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

  function getStockSector(stock){
    return fetchWrapper
    .get(`${baseUrl}/stock/sector?stockSymbol=${stock}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }

  function getStocksUnderSector(category) {
    return fetchWrapper
      .get(`${baseUrl}/stock/sector-stocks?category=${category}`)
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

  function addStockToSector(body) {
    return fetchWrapper
      .post(`${baseUrl}/stock/addSector`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  function updateStockToSector(body) {
    return fetchWrapper
      .put(`${baseUrl}/stock/sector`, body)
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
    SuspendedStocks,
    getAllStockSectors,
    getStocksUnderSector,
    getStockSector,
    addStockToSector,
    updateStockToSector
  };
  