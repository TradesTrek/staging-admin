import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';
import Router from 'next/router';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem('token')
);

// Get All Companies
function getAllCompanies() {
  return fetchWrapper
    .get(`${baseUrl}/admin/company/all`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

// Get All Companies
function getAllPersons() {
  return fetchWrapper
    .get(`${baseUrl}/admin/person/all`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}
// Add Company
function addCompany(...data) {
  return fetchWrapper
    .post(`${baseUrl}/admin/company/create`, { ...data[0] })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}
//Get Company Infomation
function getCompanyInfomation(id) {
  return fetchWrapper
    .get(`${baseUrl}/admin/company/${id}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

//Update Company Details
function updateCompanyDetails(id, data) {
  return fetchWrapper
    .patch(`${baseUrl}/admin/company/${id}`, { ...data })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}
function getAvailableLocks() {
  return fetchWrapper
    .get(`${baseUrl}/admin/locks/available`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

function allocateLocks(iseoLock, chineseLock, managerId) {
  return fetchWrapper
    .post(
      `${baseUrl}/admin/allocate/lock/${iseoLock}/${chineseLock}/${managerId}`
    )
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

// Delete Company
function DeleteCompany(Id) {
   return fetchWrapper
     .delete(`${baseUrl}/company/property/delete//${Id}`)
     .then((res) => {
       return res;
     })
     .catch((error) => {
       return error;
     });
}
export const CompanyPersonService = {
  getAllCompanies,
  addCompany,
  getAvailableLocks,
  allocateLocks,
  getCompanyInfomation,
  updateCompanyDetails,
  getAllPersons,
  DeleteCompany,
};
