import React, { useState, useContext } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { setAuthToken, loginWithOTP } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  const onFormSubmit = (formData) => {
    setLoading(true);
    if (formData) {
      loginWithOTP({ email:formData.email,password:formData.password},
        apiSuccessRes => {
          // const { data: { meta:{code,message} } } = apiSuccessRes;
          let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InVzZXJJZCI6NSwidXNlck5hbWUiOiJHYXVyYXYiLCJ1c2VyRW1haWwiOiIiLCJ1c2VyTW9iaWxlTnVtYmVyIjoiOTkxMDIyNzIwNSIsInVzZXJSb2xlIjoiQWRtaW4iLCJ1c2VyU3RhdHVzIjoiQWN0aXZlIiwidXNlck9UUFZlcmlmaWVkIjp0cnVlfSwiaWF0IjoxNjc4OTU1NzgyfQ.HhgPCTkycuYZJyNGRNQsTvKQ4N9XbcgW9ft6wvCk9uc"

          // const  token = apiSuccessRes.data.token
          // const code = apiSuccessRes.data.code
          let code = 200
          console.log(token);
          console.log(token);
          if(code==200){
            setAuthToken(token)
            setTimeout(() => {
              window.history.pushState(
                `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/kyc-list"}`,
                "auth-login",
                `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/kyc-list"}`
              );
              window.location.reload();
            }, 1000);
          }
          else{
            setTimeout(() => {
              // setError(message);
              setLoading(false);
            }, 2000);
          }
        
        },
        apiErrorRes => {
          console.log("loginError", apiErrorRes);
          setTimeout(() => {
            setError("Cannot login with credentials");
            setLoading(false);
          }, 2000);
        })

    } else {
      setTimeout(() => {
        setError("Cannot login with credentials");
        setLoading(false);
      }, 2000);
    }
  };

  const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
             
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Access ACME Upload Portal using your Email.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> {errorVal}
                </Alert>
              </div>
            )}
             <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="email"
                      id="default-01"
                      name="email"
                      ref={register({ required: "This field is required" })}
                      // defaultValue="info@softnio.com"
                      placeholder="Enter your registered email"
                      className="form-control-lg form-control"
                    />
                    {errors.email && <span className="invalid">{errors.email.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                  Forgot Code?
                </Link> */}
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setPassState(!passState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    >
                      <Icon name="eye" className="passcode-icon icon-show"></Icon>

                      <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      name="password"
                      defaultValue=""
                      ref={register({ required: "This field is required" })}
                      placeholder="Enter your password"
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    />
                    {errors.password && <span className="invalid">{errors.password.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Button size="lg" className="btn-block" type="submit" color="primary">
                    {loading ? <Spinner size="sm" color="light" /> : "Login"}
                  </Button>
                </FormGroup>
              </Form>
            {/* <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div> */}
            {/* <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div> */}
            {/* <ul className="nav justify-center gx-4">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul> */}
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;