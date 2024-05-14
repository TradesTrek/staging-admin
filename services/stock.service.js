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
    .get(`${baseUrl}/stock/sectors-v2`)

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
    .get(`${baseUrl}/stock/sector?stockId=${stock}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }

  function updateExtraDetails(stockSymbol, body){
    return fetchWrapper
    .put(`${baseUrl}/stock/extra-stock-details/${stockSymbol}`, body)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }

  function deleteExchange(exchangeId){
    return fetchWrapper
    .delete(`${baseUrl}/admin/stock/exchange/${exchangeId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }

  function deleteSector(sectorId){
    return fetchWrapper
    .delete(`${baseUrl}/stock/sector?sectorId=${sectorId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }
  function deleteSubSector(subsectorId){
    return fetchWrapper
    .delete(`${baseUrl}/admin/stock/subsector/${subsectorId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }

  function addExtraDetails(stockSymbol, body){
    return fetchWrapper
    .post(`${baseUrl}/stock/extra-stock-details/${stockSymbol}`, body)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
  }

  function getExtraStockDetails(stockId){
    return fetchWrapper
    .get(`${baseUrl}/admin/stock/extra-detail-sector/${stockId}`)
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

  
  function getSubSectors() {
    return fetchWrapper
      .get(`${baseUrl}/admin/stock/subsector`)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  function updateApplySectorToStock(body){
    return fetchWrapper
      .put(`${baseUrl}/stock/applySectorToStock`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  function applySectorToStock(body) {
    return fetchWrapper
      .post(`${baseUrl}/stock/applySectorToStock`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  function updateSectorName(body) {
    return fetchWrapper
      .put(`${baseUrl}/stock/updateSectorName`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }

  function addSector(body) {
    return fetchWrapper
      .post(`${baseUrl}/stock/addSector`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }
  function addSubSectors(body) {
    return fetchWrapper
      .post(`${baseUrl}/admin/stock/subsector`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }
  

  function addExchange(body) {
    return fetchWrapper
      .post(`${baseUrl}/admin/stock/exchange`, body)
      .then((res) => {
        return res;
      })
      .catch(function (error) {
        return error;
      });
  }
  

  function getExchange() {
    return fetchWrapper
      .get(`${baseUrl}/admin/stock/exchange`)
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
    getStockSector,
    addStockToSector,
    updateStockToSector,
    addExtraDetails,
    updateExtraDetails,
    getExtraStockDetails,
    addExchange,
    getExchange,
    getSubSectors,
    addSubSectors,
    addSector,
    applySectorToStock,
    updateApplySectorToStock,
    deleteExchange,
    deleteSubSector,
    deleteSector,
    updateSectorName
  };
  
