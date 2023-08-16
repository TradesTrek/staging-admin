import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";
import Router from "next/router";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);

function login(email, password) {
  return fetchWrapper
    .post(`${baseUrl}/admin/login`, { email: email, password: password })
    .then((res) => {
      // publish user to subscribers and store in local storage to stay logged in between page refreshes
      if (res.success) {
        userSubject.next(res.token);
        localStorage.setItem("token", res.token);
      }
      return res;
    })
    .catch((error) => {
      return error;
    });
}

function getUsers() {
  return fetchWrapper
    .get(`${baseUrl}/admin/users`)
    .then((res) => {
      if (res.success) {
        return res;
      } else {
        localStorage.removeItem("token");
        userSubject.next(null);
        Router.push("/");
      }
    })
    .catch((error) => {
      return error;
    });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("token");
  userSubject.next(null);
  Router.push("/");
}

//Dashboard Stats
function dashboardStatistics() {
  return fetchWrapper
    .get(`${baseUrl}/admin/dashboard`)
    .then((res) => {
      if (res.success) {
        return res;
      } else {
        localStorage.removeItem("token");
        userSubject.next(null);
        Router.push("/");
      }
    })
    .catch((error) => {
      return error;
    });
}

function updateUser(userId, body) {
  return fetchWrapper
    .put(`${baseUrl}/admin/user/${userId}`, body)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function createUser(body) {
  return fetchWrapper
    .post(`${baseUrl}/admin/users`, body)
    .then((res) => {
      return res;
      // if(res.success){
      //   return res
      // }else{
      //   localStorage.removeItem("token");
      //   userSubject.next(null);
      //   Router.push("/");
      // }
    })
    .catch(function (error) {
      return error;
    });
}
function deleteUser(userId) {
  return fetchWrapper
    .delete(`${baseUrl}/admin/user/${userId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function blockUser(userId) {
  return fetchWrapper
    .put(`${baseUrl}/admin/user/block/${userId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function unblockUser(userId) {
  return fetchWrapper
    .put(`${baseUrl}/admin/user/unblock/${userId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function addHoliday(data) {
  return fetchWrapper
    .post(`${baseUrl}/holiday`, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function deleteHoliday(userId) {
  return fetchWrapper
    .delete(`${baseUrl}/holiday/${userId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function updateHoliday(data) {
  return fetchWrapper
    .put(`${baseUrl}/holiday`, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function getHoliday(search,data,page) {
  return fetchWrapper
    .post(`${baseUrl}/holiday/all/holiday?page=${page}&search=${search}`, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function downloadHoliday(search,data) {
  return fetchWrapper
    .post(`${baseUrl}/holiday/all/holiday-download?search=${search}`, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function getUserPortfolio(id) {
  return fetchWrapper
    .get(`${baseUrl}/admin/user/portfolio/${id}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

// get-single-user-subscription
function getSingleUserSubscription(id) {
  return fetchWrapper
    .get(`${baseUrl}/subscription/get-single-user-subscription?id=${id}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function getUserTradeHistory(id, gameid) {
  return fetchWrapper
    .get(`${baseUrl}/admin/user/trade-history/${id}/${gameid}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
// download-user-trade-history....
function downloadUserTradeHistory(id, gameid) {
  return fetchWrapper
    .get(`${baseUrl}/admin/user/download-user-trade-history/${id}/${gameid}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function downloadUserAllTradeHistory(id,search,option) {
  return fetchWrapper
    .get(`${baseUrl}/admin/user/user-all-trade-history-download/${id}?search=${search}&option=${JSON.stringify(option)}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function downloadAllUser(search,option,filter) {
  return fetchWrapper
    .post(`${baseUrl}/admin/users/download?search=${search}`,{option,filter})
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function downloadAllStock(search,body) {
  return fetchWrapper
    .post(`${baseUrl}/admin/stocks/all-download?str=${search}`,body)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

// download user portfolio ............... .....
function downloadUserPortfolio(id) {
  return fetchWrapper
    .get(`${baseUrl}/admin/user/download-user-portfolio/${id}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

// user-all-trade-history........

function getUserAllTradeHistory(id,search,page,option) {
  return fetchWrapper
    .get(`${baseUrl}/admin/user/user-all-trade-history/${id}?search=${search}&page=${page}&option=${JSON.stringify(option)}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function getUserDayWise() {
  return fetchWrapper
    .get(`${baseUrl}/admin/stats/userGraph/day-wise`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function getAllRequestTransaction(data = {},page,search='') {
  return fetchWrapper
    .post(`${baseUrl}/transaction/admin/all?page=${page}&search=${search}`, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function getAllBank(data = {},page,search='') {
  return fetchWrapper
    .post(`${baseUrl}/transaction/admin/all-bank-details?page=${page}&search=${search}`, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function downloadAllTransaction(search,body) {
  return fetchWrapper
    .post(`${baseUrl}/transaction/admin/all-download?search=${search}`,body)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function downloadAllBankDetails(search,body) {
  return fetchWrapper
    .post(`${baseUrl}/transaction/admin/all-bank-details-download?search=${search}`,body)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function getAllStock(page=10,str='',option) {
  return fetchWrapper
    .post(`${baseUrl}/admin/stocks/all?page=${page}&str=${str}`,option)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function updateRequestTransaction(type, id,reason='') {
  return fetchWrapper
    .put(`${baseUrl}/transaction/admin`, {
      type: type,
      id: id,
      reason:reason
    })
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function changePassword(data){
  return fetchWrapper
  .patch(`${baseUrl}/admin/change-password`, data)
  .then((res) => {
    if (res.success) {
      userSubject.next(res.token);
      localStorage.setItem('token', res.token);
    }
    return res;
  })
  .catch(function (error) {
    return error;
  });
}
export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  getUserDayWise,
  login,
  logout,
  getUsers,
  createUser,
  dashboardStatistics,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  addHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday,
  getUserPortfolio,
  getUserTradeHistory,
  downloadUserTradeHistory,
  downloadUserPortfolio,
  getUserAllTradeHistory,
  downloadUserAllTradeHistory,
  getSingleUserSubscription,
  getAllRequestTransaction,
  updateRequestTransaction,
  downloadAllUser,
  getAllStock,
  downloadAllStock,
  downloadAllTransaction,
  downloadHoliday,
  getAllBank,
  downloadAllBankDetails,
  changePassword
};
