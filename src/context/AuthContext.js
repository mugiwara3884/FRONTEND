import React, { useState, createContext, useEffect } from "react";
export const AuthContext = createContext();
import { AxiosPost, AxiosGet } from './Axios'
var Buffer = require('buffer/').Buffer
import LogoDark2x from "../../src/assets/images/logo_dark.png";
import favicon from "../../src/assets/images/favicon.png";

export const AuthContextProvider = (props) => {
  console.log("here");
  console.log("App Env--->", process.env.REACT_APP_ENV);
  const [authToken, setAuthToken] = useState(false);
  const [userData, setUserData] = useState({});
  const [authMenu, setAuthMenu] = useState([]);
  let tokenFromSessionStorage = localStorage.getItem("token");
  let userDataFromToken = false;
  if (tokenFromSessionStorage) {
    userDataFromToken = parseJwt(tokenFromSessionStorage);
    console.log(tokenFromSessionStorage);
    console.log(userDataFromToken);
    userDataFromToken = userDataFromToken.user;
  };
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      setAuthToken(localStorage.getItem("token"));
    }
    setUserData(userDataFromToken.user ? userDataFromToken.user : false);
    if (userDataFromToken) {
      const { userRole } = userDataFromToken;
      console.log(userDataFromToken);
      if (userDataFromToken) {
        setAuthMenu([
          {
          // icon: "dashlite",
          // iconUrl: favicon,
          // text: "Dashboard",
          // link: "/",
        },
        // {
        //   heading: "Pre-built Pages",
        // },
        {
          icon: "users",
          text: "User List",
          active: false,
        },
        {
          icon: "file-docs",
          text: "Upload Documents",
          active: false,
        }])
      }
      else {
        console.log("here");
        setAuthMenu([{
          icon: "dashlite",
          iconUrl: favicon,
          text: "Dashboard",
          link: "/",
        },
        // {
        //   heading: "Pre-built Pages",
        // },
        {
          icon: "file-docs",
          text: "KYC List",
          active: true,
          link: "/kyc-list",
        }])
      }
    }
  }, [authToken]);
  async function loginWithOTP(data, handleApiRes, handleApiError) {
    await AxiosPost("loginWIthOTP", data,
      (apiRes) => {
        console.log("apiRes",apiRes.data.token);
        handleApiRes(apiRes)
        setAuthToken(apiRes.data.token)
      }, (apiError) => {
        handleApiError(apiError)
      })
  };
  
  const logOut = () => {
    localStorage.removeItem("token");
  }
  function parseJwt(token) {
    if (token) {
      var base64Payload = token.split('.')[1];
      var payload = Buffer.from(base64Payload, 'base64');
      let finalUserPayload = JSON.parse(payload.toString());
      return finalUserPayload;
    } else {
      return false;
    }
  };
  console.log("isUserAuthrized :-> ", authToken ? "Authentiated User :)" : "UnAuthrized :(");

  return <AuthContext.Provider value={{
    userAuthContextData: [userDataFromToken, setUserData],
    setAuthToken: setAuthToken,
    authToken: authToken,
    menuData: authMenu,
    loginWithOTP: loginWithOTP,
    logOut: logOut
  }}>{props.children}</AuthContext.Provider>;
};
