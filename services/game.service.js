import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";
import Router from "next/router";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);

function getAllGame(page,search = "",option) {
  return fetchWrapper
    .post(`${baseUrl}/admin/games/all?search=${search}&page=${page}`,option)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}
function getAllRefferal(page,search = "",option={}) {
  return fetchWrapper
    .post(`${baseUrl}/userrefferal/admin-list?search=${search}&page=${page}`,option)
    .then((res) => {
     return res
    })
    .catch(function (error) {
      return error;
    });
}

function resetGame(gameId) {
  return fetchWrapper
    .get(`${baseUrl}/admin/game/reset?gameId=${gameId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}

function deleteGame(gameId) {
  return fetchWrapper
    .delete(`${baseUrl}/admin/game/delete?gameId=${gameId}`)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error;
    });
}
function updateDefaultGame(gameId) {
  return fetchWrapper
    .get(`${baseUrl}/admin/game/update-default-game?gameId=${gameId}`)
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


function updateGamePoints(data) {
  return fetchWrapper
  .put(`${baseUrl}/admin/game/updateGamePoints`, data)

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

function updateGame(data,gameId) {
  data.dateRange = `${data.startDate} ${data.endDate}`;
  data.startingCash = Number(data.startingCash);
  data.endDate=new Date(data.endDate)

 
  return fetchWrapper
    .put(`${baseUrl}/admin/game/update`, {...data,gameId})

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
function createGame(data) {
  data.dateRange = `${data.startDate} ${data.endDate}`;
  data.startingCash = Number(data.startingCash);

  // console
  return fetchWrapper
    .post(`${baseUrl}/admin/game/create`, data)

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
function getRank(gameId,page,limit=10) {
  return fetchWrapper
    .get(`${baseUrl}/admin/games-rank?gameId=${gameId}&page=${page}&limit=${limit}`)
    .then((res) => {
      return res
    })
    .catch(function (error) {
      return error;
    });
}
function getWinner(gameId,date){
  return fetchWrapper
    .get(`${baseUrl}/admin/winner-list?gameId=${gameId}&date=${date}`)

    .then((res) => {
      
      return res;
    })
    .catch((error) => {
      if (error?.length > 0) {
        return error[0];
      }
      return error;
    });
}
function getSingleGame(gameId){
  return fetchWrapper
    .get(`${baseUrl}/admin/game?gameId=${gameId}`)

    .then((res) => {
      
      return res;
    })
    .catch((error) => {
      if (error?.length > 0) {
        return error[0];
      }
      return error;
    });
}

function Add_PriodicTime(timePriod,gameId) {
 

 
  return fetchWrapper
    .put(`${baseUrl}/admin/game/add-priodit-time`, {timePriod,gameId})

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
function GetRefferalRule() {
 

 
  return fetchWrapper
    .get(`${baseUrl}/adminrefferalper`)

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
function AddRefferalRule(data) {
 

 
  return fetchWrapper
    .post(`${baseUrl}/adminrefferalper`,{per:data})

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
function GetStockRule() {
 

 
  return fetchWrapper
    .get(`${baseUrl}/stockrule`)

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
function AddStockRule(l,p) {
 

 
  return fetchWrapper
    .post(`${baseUrl}/stockrule`,{limit:l,period:p})

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
function AddNewsRule(l) {
 

 
  return fetchWrapper
    .post(`${baseUrl}/news/news-rule`,{minute:l})

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
function GetNewsRule() {
 

 
  return fetchWrapper
    .get(`${baseUrl}/news/news-rule`)

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
function downloadAllCompetition(search,body){
  return fetchWrapper
  .post(`${baseUrl}/admin/games/all-download?search=${search}`,body)
  .then((res) => {
    return res;
  })
  .catch(function (error) {
    return error;
  });
}
function downloadAllRefferal(search,body){
  return fetchWrapper
  .post(`${baseUrl}/userrefferal/admin-list-download?search=${search}`,body)
  .then((res) => {
    return res;
  })
  .catch(function (error) {
    return error;
  });
}

export const gameService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  getAllGame,
  createGame,
  updateSubscription,
  deleteGame,
  resetGame,
  updateGame,
  updateGamePoints,
  getRank,
  getWinner,
  getSingleGame,
  Add_PriodicTime,
  updateDefaultGame,
  getAllRefferal,
  GetRefferalRule,
  AddRefferalRule,
  AddStockRule,
  GetStockRule,
  downloadAllCompetition,
  downloadAllRefferal,
  AddNewsRule,
  GetNewsRule
};
