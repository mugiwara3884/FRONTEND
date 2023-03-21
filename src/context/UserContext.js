import React, { useState, createContext, useEffect } from "react";
export const UserContext = createContext();
import { AxiosPost, AxiosGet } from './Axios'

export const UserContextProvider = (props) => {
  const [userData, setUserData] = useState([]);

  async function addUser(userSubmittedData, handleApiRes, handleApiError) {
    await AxiosPost("addUser", userSubmittedData,
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
  }}>{props.children}</UserContext.Provider>;
};
