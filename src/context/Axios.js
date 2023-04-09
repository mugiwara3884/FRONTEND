import axios from "axios";
import ApiPaths from "./ApiPaths.json"; //json file containing ApiPaths data
import { AuthContext } from "../context/AuthContext";
import React, { useState, useContext } from "react";


const url = "http://localhost:4001/"; //! local
// const url = "http://10.10.0.105:3000/"; //! live



console.log("Token From local storage:", localStorage.getItem("token"))




const axiosInstance = axios.create({
  baseURL: url
});


const setAuthToken = (token) => {

  axios.defaults.headers.common = {
    Authorization: localStorage.getItem(
      "token"),
  };
  axiosInstance.defaults.headers.common = {
    Authorization: localStorage.getItem(
      "token"),
  };
}
const setCustomerAuthToken = (token) => {

  axios.defaults.headers.common = {
    Authorization: localStorage.getItem(
      "customerToken"),
  };
  axiosInstance.defaults.headers.common = {
    Authorization: localStorage.getItem(
      "customerToken"),
  };
}


function AxiosPost(key, body, handleSuccess, handleError, config = {}) {

  console.log(config);
  // if (key != 'loginWIthOTP') {
    if(key =='updateCustomerBySelf'){
      setCustomerAuthToken()
    }else{

      setAuthToken();
    }
  // }
  let req = { ...body }
  let finalApiUrl = url + ApiPaths.endPoints[key];
  console.log("finalApiUrl  ", finalApiUrl)
  console.log("req  ", req)
  axios.post(finalApiUrl, req, config)
    .then(res => {
      if (handleSuccess) handleSuccess(res);
    })
    .catch(err => {
      if (handleError) handleError(err);
    });
}
function AxiosPostURL(url, body, handleSuccess, handleError) {

  let req = { ...body }

  axios.post(url, req)
    .then(res => {
      if (handleSuccess) handleSuccess(res);
    })
    .catch(err => {
      if (handleError) handleError(err);
    });
}

function AxiosPostForFileUpload(file, type, handleSuccess, handleError) {
  if(type =='customer'){
    setCustomerAuthToken()
  }else{
    setAuthToken();
  }
  const formData = new FormData();
  formData.append("uploaded_file", file);
  let fileUploadApiURl = url + ApiPaths.endPoints["uploadFile"];
  console.log("fileUploadApiURl  ", fileUploadApiURl)
  axios.post(fileUploadApiURl, formData, 
  //   {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     // "Authorization": sessionStorage.getItem("token"),
  //   }
  // }
  )
    .then(res => {
      if (handleSuccess) handleSuccess(res);
    })
    .catch(err => {
      if (handleError) handleError(err);
    });
}
function AxiosPostForFileUploadByCustomer(file, type, handleSuccess, handleError) {
    setCustomerAuthToken()
  const formData = new FormData();
  formData.append("uploaded_file", file);
  let fileUploadApiURl = url + ApiPaths.endPoints["uploadByCustomer"];
  console.log("fileUploadApiURl  ", fileUploadApiURl)
  axios.post(fileUploadApiURl, formData, 
  //   {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     // "Authorization": sessionStorage.getItem("token"),
  //   }
  // }
  )
    .then(res => {
      if (handleSuccess) handleSuccess(res);
    })
    .catch(err => {
      if (handleError) handleError(err);
    });
}

// function AxiosPatch(key, body, handleSuccess, handleError, config = {}) {
//   setAuthToken();
//   console.log("Token From storage :", sessionStorage.getItem("token"));
//   let fk_id_org = parseInt(sessionStorage.getItem("orgId"))
//   axios
//     .patch(url + ApiPaths.endPoints[key], { fk_id_org, ...body }, config)
//     .then(res => {
//       if (handleSuccess) handleSuccess(res);
//     })
//     .catch(err => {
//       if (handleError) handleError(err);
//     });
// }

// function AxiosPut(key, body, handleSuccess, handleError, config = {}) {
//   setAuthToken();
//   console.log("Token From storage :", sessionStorage.getItem("token"))
//   let fk_id_org = parseInt(sessionStorage.getItem("orgId"))
//   axios
//     .put(url + ApiPaths.endPoints[key], { fk_id_org, ...body }, config)
//     .then(res => {
//       if (handleSuccess) handleSuccess(res);
//     })
//     .catch(err => {
//       if (handleError) handleError(err);
//     });
// }

function AxiosGet(key, handleSuccess, handleError, config = {}) {
  setAuthToken();
  console.log("Token From storage :", sessionStorage.getItem("token"))
  axios
    .get(url + ApiPaths.endPoints[key], config)
    .then(res => {
      if (handleSuccess) handleSuccess(res);
    })
    .catch(err => {
      if (handleError) handleError(err);
    });
}

function AxiosGetWithParams(key, data, handleSuccess, handleError, config = {}) {
  const { authToken } = data;
  axios.defaults.headers.common = {
    Authorization: authToken
  };
  axios
    .get(url + ApiPaths.endPoints[key], {})
    .then(res => {
      if (handleSuccess) handleSuccess(res);
    })
    .catch(err => {
      if (handleError) handleError(err);
    });
}

export {
  url,
  axiosInstance,
  AxiosPost,
  AxiosGet,
  AxiosGetWithParams,
  AxiosPostForFileUpload,
  AxiosPostForFileUploadByCustomer,
  AxiosPostURL
};
