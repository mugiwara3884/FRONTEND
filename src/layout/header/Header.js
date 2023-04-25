import React from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import acmeLogo from "../../images/acmeLogo.jpeg";
import { Link } from "react-router-dom";
import { BlockHeadContent, BlockTitle } from "../../components/Component";

const Header = ({ fixed, theme, className, setVisibility, ...props }) => {
  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className,
  });
  return (
    <div className={headerClass} style={{ right: "-20px" }}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ml-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ml-n1"
              icon="menu"
              click={props.sidebarToggle}
            />
          </div>
          <div className="nk-header-brand d-xl-none">
            <Logo />
          </div>
          <div className="nk-header-news d-none d-xl-block">
            {/* <News /> */}
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              {/* <p style={{
                fontSize: '25px',
                fontWeight: 'bold',
                paddingLeft:"85px"
              }}> DocuHub </p> */}

              <BlockHeadContent style={{ fontSize: "24.5px" }}>
                <BlockTitle>DocuHub</BlockTitle>
              </BlockHeadContent>
            </ul>
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li
                className="user-dropdown"
                onClick={() => setVisibility(false)}
              >
                <User />
              </li>
              <li
                className="notification-dropdown mr-n1"
                onClick={() => setVisibility(false)}
              >
                {/* <Notification /> */}
              </li>
            </ul>
          </div>

          <div>
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              {/* <img className="logo-light logo-img logo-img-lg" src={acmeLogo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={acmeLogo} alt="logo-dark" /> */}
              <img
                style={{ width: "100px", height: "67px" }}
                src={acmeLogo}
                alt="logo-dark"
              ></img>
              {/* <img className="logo-light w-80 h-80" src={acmeLogo} alt="logo" /> */}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
