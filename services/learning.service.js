import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import { fetchWrapper } from "../helpers";
import Router from "next/router";
import axios from "axios";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && localStorage.getItem("token")
);
function AddCategory(data,category){
    return axios
      .post(`${baseUrl}/learning/category-create`,{'image':data,category:category},{
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "type": "formData",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((res) => {
        
       
        return res.data;
      })
      .catch(function (error) {
        return error;
      });
  }

  function EditCategory(data,category,id){
    return axios
      .post(`${baseUrl}/learning/category-edit?categoryId=${id}`,{'image':data,category:category},{
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "type": "formData",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((res) => {
        
       
        return res.data;
      })
      .catch(function (error) {
        return error;
      });
  }
function GetAllCategory() {
  return fetchWrapper
    .post(`${baseUrl}/learning/get-all-category`)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}
function DeleteCategory(id) {
  return fetchWrapper
    .delete(`${baseUrl}/learning/delete-category?categoryId=${id}`)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}
function EnableDisableCategory(id) {
  return fetchWrapper
    .put(`${baseUrl}/learning/enable-disable-category?categoryId=${id}`)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}
function AllCategory() {
  return fetchWrapper
    .get(`${baseUrl}/learning/all-category`)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}
function AllLearning(data) {
  return fetchWrapper
    .post(`${baseUrl}/learning/all-learning`,{})
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}

function AddLearning(data) {
  return fetchWrapper
    .post(`${baseUrl}/learning/add-learning`,data)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}

function EditLearning(data,id) {
  return fetchWrapper
    .post(`${baseUrl}/learning/edit-learning?learningId=${id}`,data)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}

function DeleteLearning(id) {
  return fetchWrapper
    .delete(`${baseUrl}/learning/delete-learning?learningId=${id}`)
    .then((res) => {
     return res     
    })
    .catch(function (error) {
      return error;
    });
}


export const learningService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  AddCategory,
  EditCategory,
  GetAllCategory,
  DeleteCategory,
  AllCategory,
  AddLearning,
  AllLearning,
  EditLearning,
  DeleteLearning,
  EnableDisableCategory
};
