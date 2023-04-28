import React, { useState, createContext, useEffect } from "react";
export const UserContext = createContext();
import { AxiosPost, AxiosGet } from './Axios'

export const UserContextProvider = (props) => {
  const [userData, setUserData] = useState([]);

  async function addUser(userSubmittedData, handleApiRes, handleApiError) {
    console.log("--------------------------",handleApiRes)
    await AxiosPost("addUser", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)               
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function addPermission(userSubmittedData, handleApiRes, handleApiError) {
    console.log("--------------------------",handleApiRes)
    await AxiosPost("wauth", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)               
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function add_group(userSubmittedData, handleApiRes, handleApiError) {
    await AxiosPost("add_group", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function addCabinet(userSubmittedData, handleApiRes, handleApiError) {
    await AxiosPost("add_cabinet", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function addWorkspace(userSubmittedData, handleApiRes, handleApiError) {
    await AxiosPost("addWorkspace", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function addFolderWork(userSubmittedData, handleApiRes, handleApiError) {
    await AxiosPost("addFolder", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function addFolderWork(userSubmittedData, handleApiRes, handleApiError) {
    await AxiosPost("addFolder", userSubmittedData,
      (apiRes) => {
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function getUser(data, handleApiRes, handleApiError) {
    console.log(data);
    await AxiosPost("getUsers", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function getCabinet(data, handleApiRes, handleApiError) {
    console.log(data);
    await AxiosPost("getCabinet", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function getWorkspace(data, handleApiRes, handleApiError) {
    console.log(data);
    await AxiosPost("getworkspace", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function deleteUser(data, handleApiRes, handleApiError) {
    await AxiosPost("deleteuser", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function deletegroup(data, handleApiRes, handleApiError) {
    await AxiosPost("deletegroup", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function deletecabinet(data, handleApiRes, handleApiError) {
    await AxiosPost("deletecabinet", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };
  
  async function deleteworkspace(data, handleApiRes, handleApiError) {
    await AxiosPost("deleteworkspace", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function blockUser(data, handleApiRes, handleApiError) {
    await AxiosPost("blockuser", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };


  async function getGroupsDropdown(data, handleSuccess, handleApiError) {
    console.log(data);
    await AxiosPost("dropdown_groups",data,
      (apiRes) => {
        console.log(apiRes);
        handleSuccess(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function cabinetDropdown(data, handleSuccess, handleApiError) {
    console.log(data);
    await AxiosPost("cabinetdropdown",data,
      (apiRes) => {
        console.log(apiRes);
        handleSuccess(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function userDropdownU(data, handleApiRes, handleApiError) {
    console.log(data);
    await AxiosPost("userDropdownU", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function getGroups(data, handleApiRes, handleApiError) {
    console.log(data);
    await AxiosPost("get_groups", data,
      (apiRes) => {
        // console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };

  async function updateUser(data, handleApiRes, handleApiError) {
    console.log(data);
    await AxiosPost("verifyOTP", data,
      (apiRes) => {
        console.log(apiRes);
        handleApiRes(apiRes)
      }, (apiError) => {
        console.log(apiError);
        handleApiError(apiError)
      })
  };

  return <UserContext.Provider value={{
    contextData: [userData, setUserData],
    addUser: addUser,
    getUser: getUser,
    updateUser: updateUser,
    getGroupsDropdown: getGroupsDropdown,
    getGroups: getGroups,
    add_group:add_group,
    userDropdownU:userDropdownU,
    getCabinet:getCabinet,
    addCabinet:addCabinet,
    deleteUser:deleteUser,
    deletegroup:deletegroup,
    deletecabinet:deletecabinet,
    deleteworkspace:deleteworkspace,
    blockUser:blockUser,
    getWorkspace:getWorkspace,
    addWorkspace:addWorkspace,
    cabinetDropdown:cabinetDropdown,
    addFolderWork:addFolderWork,
    addPermission:addPermission
  }}>{props.children}</UserContext.Provider>;
};
