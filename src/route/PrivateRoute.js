import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const auth = localStorage.getItem("token");
const PrivateRoute = ({ exact, component: Component, ...rest }) => {
  const { userAuthContextData } = useContext(AuthContext);
  const [authUserData] = userAuthContextData;
  const { userOTPVerified } = authUserData
  console.log("userOTPVerified  ", userOTPVerified);
  return (<Route
    exact={exact ? true : false}
    rest
    render={(props) =>
      authUserData?.userOTPVerified ? (
        <Component {...props} {...rest}></Component>
      ) : (
        <Redirect to={`${process.env.PUBLIC_URL}/auth-login`}></Redirect>
      )
    }
  ></Route>)
};

export default PrivateRoute;
