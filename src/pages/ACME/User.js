import React, { useContext, useEffect, useState } from "react";
// import Content from "../../../layout/content/Content";
import Content from "../../layout/content/Content";
// import Head from "../../../layout/head/Head";
import Head from "../../layout/head/Head";
import moment from 'moment-timezone';

import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  TooltipComponent,
  RSelect,
  // } from "../../../components/Component";
} from "../../../src/components/Component";
// import { filterRole, filterStatus, userData } from "./UserData";
import { filterRole, filterStatus, userData } from "../../pages/pre-built/user-manage/UserData";
// import { bulkActionOptions, findUpper } from "../../../utils/Utils";
import { bulkActionOptions, findUpper } from "../../../src/utils/Utils";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { UserContext } from "../../../src/pages/pre-built/user-manage/UserContext";
// import { UserContext } from "./UserContext";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
const UserListRegularPage = () => {
  const { contextData, addUser, getUser, updateUser } = useContext(UserContext);
  const { setAuthToken } = useContext(AuthContext);
  console.log("contextData ", contextData)
  const [userData, setUserData] = contextData;

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
    display_name: "",
    emp_code: "",
    email: "",
    // role: "Agent",
    // status: "Active",
    add_group: "",
    user_role: "",
    max_quota: ""
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(1);
  const [sort, setSortState] = useState("");
  const [statusDropdown, setStatusDropDown] = useState([
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
  ]);
  const [roleDropdown, setRolewDropDown] = useState([
    { value: "Agent", label: "Agent" },
    { value: "Admin", label: "Admin" }
  ]);

  // Sorting userData


  const timezones = moment.tz.names().map((zone) => ({
    value: zone,
    label: `(UTC${moment.tz(zone).format('Z')}) ${zone}`,
  }));

  const sortFunc = (params) => {
    let defaultData = userData;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setUserData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setUserData([...sortedData]);
    }
  };

  // unselects the userData on mount
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setUserData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    getUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const getUsers = () => {
    getUser({ pageNumber: currentPage, pageSize: itemPerPage, search: onSearchText },
      (apiRes) => {
        console.log(" get user apiRes apiRes", apiRes);
        // const { data: { data :{data}},status, token }  = apiRes;
        const data = apiRes.data.data
        const code = apiRes.status
        const message = apiRes.data.message
        console.log(" get user apiRes data", data);
        console.log(" get user apiRes message", message);
        // console.log(" get user apiRes token", token);
        console.log(" get user apiRes code", code);

        if (code == 200) {
          setUserData(data);
          // setTotalUsers(total)
        }
        // setAuthToken(token);
      },
      (apiErr) => {
        console.log(" get user apiErr ", apiErr)
      })
  };
  // Changing state value when searching name

  const [timezone, setTimezone] = useState('');
  const timezoneOptions = Intl.DateTimeFormat().resolvedOptions().timeZone
    .split('/')
    .map((zone) => ({ value: zone, label: zone }));
  // console.log(timezoneOptions);
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = userData.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setUserData([...filteredObject]);
    } else {
      setUserData([...userData]);
    }
  }, [onSearchText, setUserData]);

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = userData;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setUserData([...newData]);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      display_name: "",
      emp_code: "",
      email: "",
      // role: "Agent",
      // status: "Active",
      add_group: "",
      user_role: "",
      max_quota: ""

    });
    setEditedId(0)
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = () => {
    // console.log("user submitData ", submitData)
    console.log("user formData ", formData)
    // const { name, email, phone } = submitData;
    if (editId) {
      let submittedData = {
        id:editId,
        display_name: formData.display_name,
        emp_code: formData.emp_code,
        email: formData.email,
        // role: formData.role,
        // status: formData.status,
        add_group: formData.add_group,
        user_role: formData.user_role,
        max_quota: formData.max_quota
      };
      // setUserData([submittedData, ...userData]);

      addUser(submittedData,
        (apiRes) => {
          console.log(apiRes);
          const code = 200
          // const { data: { data: { data, total }, meta: { code, message }, token } } = apiRes;
          // console.log(" add user apiRes data", data);
          // console.log(" add user apiRes message", message);
          // console.log(" add user apiRes token", token);
          if (code == 200) {
            console.log("260");
            resetForm();
            setModal({ edit: false }, { add: false });
            getUsers();
  
          }
          setAuthToken(token);
        },
        (apiErr) => {
          console.log(" add user apiErr ", apiErr)
        });
    } else {
      let submittedData = {
        display_name: formData.display_name,
        emp_code: formData.emp_code,
        email: formData.email,
        // role: formData.role,
        // status: formData.status,
        add_group: formData.add_group,
        user_role: formData.user_role,
        max_quota: formData.max_quota
        
      };
      addUser(submittedData,
        (apiRes) => {
          console.log(apiRes);
          const code = 200
          // const { data: { data: { data, total }, meta: { code, message }, token } } = apiRes;
          // console.log(" add user apiRes data", data);
          // console.log(" add user apiRes message", message);
          // console.log(" add user apiRes token", token);
          if (code == 200) {
            console.log("260");
            resetForm();
            setModal({ edit: false }, { add: false });
            getUsers();
  
          }
          setAuthToken(token);
        },
        (apiErr) => {
          console.log(" add user apiErr ", apiErr)
        });
      // setUserData([submittedData, ...userData]);
    }
   
    // }

  };

  // submit function to update a new item
  // const onEditSubmit = (submitData) => {
  //   debugger
  //   console.log(submitData);
  //   const { display_name, email, emp_code, add_group, user_role } = submitData;
  //   let submittedData;
  //   let newitems = userData;
  //   newitems.forEach((item) => {
  //     if (item.id === editId) {
  //       console.log("2799999", editId);
  //       submittedData = {
  //         id: item.id,
  //         avatarBg: item.avatarBg,
  //         display_name: display_name,
  //         user_role: user_role,
  //         max_quota: max_quota,
  //         add_group: add_group,
  //         image: item.image,
  //         role: item.role,
  //         email: email,
  //         balance: formData.balance,
  //         emp_code: emp_code,
  //         emailStatus: item.emailStatus,
  //         kycStatus: item.kycStatus,
  //         lastLogin: item.lastLogin,
  //         status: formData.status,
  //         country: item.country,
  //       };
  //     }
  //   });
  //   let index = newitems.findIndex((item) => item.id === editId);

  //   newitems[index] = submittedData;
  //   console.log(submittedData);
  //   setModal({ edit: false });
  //   resetForm();
  // };

  // function that loads the want to editted userData
  const onEditClick = (id) => {
    console.log("id........", id)
    console.log("userData........", userData)
    userData.map((item) => {
      if (item.id == id) {
        console.log(item,"sds");
        setFormData({
          id: id,
          display_name: item.display_name,
          user_role: item.user_role,
          max_quota: item.max_quota,
          add_group: item.add_group,
          emp_code: item.emp_code,
          email: item.email,
          // role: item.user_role,
          // status: item.status
        });

       
        setModal({ edit: false, add: true });
        setEditedId(id);
      }

    });
  };

  console.log(formData,"dddsdsdsd");

  // function to change to suspend property for an item
  const suspendUser = (id) => {
    let newData = userData;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Suspend";
    setUserData([...newData]);
  };

  // function to change the check property of an item
  const selectorCheck = (e) => {
    let newData;
    newData = userData.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setUserData([...newData]);
  };

  // function which fires on applying selected action
  const onActionClick = (e) => {
    if (actionText === "suspend") {
      let newData = userData.map((item) => {
        if (item.checked === true) item.status = "Suspend";
        return item;
      });
      setUserData([...newData]);
    } else if (actionText === "delete") {
      let newData;
      newData = userData.filter((item) => item.checked !== true);
      setUserData([...newData]);
    }
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User List - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {userData.length} users.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    {/* <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </Button>
                    </li> */}
                    <li className="nk-block-tools-opt">
                      <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                {/* <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap">
                      <RSelect
                        options={bulkActionOptions}
                        className="w-130px"
                        placeholder="Bulk Action"
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          disabled={actionText !== "" ? false : true}
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={(e) => onActionClick(e)}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText !== "" ? false : true}
                          className="btn-dim btn-icon"
                          onClick={(e) => onActionClick(e)}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div> */}
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    {/* <li className="btn-toolbar-sep"></li> */}
                    <li>
                      <div className="toggle-wrap">
                        {/* <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button> */}
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow>
                  <span className="sub-text">Display Name</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Email</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Employee Code</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Max Quota</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> User Role</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                {/* <DataTableRow className="nk-tb-col-tools text-right"> */}
                <DataTableRow size="md">
                  <span className="sub-text">Action</span>
                </DataTableRow>
                {/* <UncontrolledDropdown>
                    <DropdownToggle
                      color="tranparent"
                      className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                    >
                      <Icon name="plus"></Icon>
                    </DropdownToggle>
                    <DropdownMenu right className="dropdown-menu-xs">
                      <ul className="link-tidy sm no-bdr">
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="bl" />
                            <label className="custom-control-label" htmlFor="bl">
                              Balance
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="ph" />
                            <label className="custom-control-label" htmlFor="ph">
                              Phone
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="vri" />
                            <label className="custom-control-label" htmlFor="vri">
                              Verified
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="st" />
                            <label className="custom-control-label" htmlFor="st">
                              Status
                            </label>
                          </div>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown> */}
                {/* </DataTableRow> */}
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item) => {
                  return (
                    <DataTableItem key={item.user_id}>

                      {/* <DataTableRow> */}
                      {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.user_id}`}> */}
                      {/* <div className="user-card"> */}
                      {/* <UserAvatar
                            theme={item.avatarBg}
                            // text={findUpper(item.user_name)}
                            image={item.image}
                          ></UserAvatar> */}
                      {/* <div className="user-info">
                            <span className="tb-lead">
                              {item.user_name}{" "}
                              <span
                                className={`dot dot-${item.user_status === "Active"
                                  ? "success"
                                  : "danger"
                                  } d-md-none ml-1`}
                              ></span>
                            </span>
                            <span>{item.user_email}</span>
                          </div> */}
                      {/* </div> */}
                      {/* </Link> */}
                      {/* </DataTableRow> */}
                      {/* <DataTableRow size="mb">
                          <span className="tb-amount">
                            {item.balance} <span className="currency">USD</span>
                          </span>
                        </DataTableRow> */}
                      <DataTableRow size="md">
                        <span>{item.display_name}</span>
                      </DataTableRow>

                      <DataTableRow size="lg">
                        <ul className="list-status">
                          <li>
                            <Icon
                              className={`text-success}`}
                              name={`${"check-circle"}`}
                            ></Icon>{" "}
                            <span
                              className={`tb-status text-${item.user_status === "Active" ? "success" : "danger"
                                }`}
                            >
                              {item.email}
                            </span>
                          </li>

                        </ul>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>{item.emp_code}</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>{item.max_quota}</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>{item.user_role}</span>
                      </DataTableRow>

                      {/* <DataTableRow size="lg">
                        <span>{new Date(item.updated_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}</span>
                      </DataTableRow> */}
                      <DataTableRow size="md">
                        <span
                          className={`tb-status text-${item.user_status === "Active" ? "success" : "danger"
                            }`}
                        >
                          {item.user_status}
                        </span>
                      </DataTableRow>
                      <DataTableRow className="nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1">
                          <li className="nk-tb-action-hidden" onClick={() => onEditClick(item.id)}>
                            <TooltipComponent
                              tag="a"
                              containerClassName="btn btn-trigger btn-icon"
                              id={"edit" + item.id}
                              icon="edit-alt-fill"
                              direction="top"
                              text="Edit"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </li>
                          {/* <li className="nk-tb-action-hidden" onClick={() => onEditClick(item.user_id)}>
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"delete" + item.user_id}
                                icon="trash"
                                direction="top"
                                text="Delete"
                              />
                            </li> */}
                          {/* {item.status !== "Suspend" && (
                              <React.Fragment>
                                <li className="nk-tb-action-hidden" onClick={() => suspendUser(item.user_id)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="btn btn-trigger btn-icon"
                                    id={"suspend" + item.user_id}
                                    icon="user-cross-fill"
                                    direction="top"
                                    text="Suspend"
                                  />
                                </li>
                              </React.Fragment>
                            )} */}
                          {/* <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li onClick={() => onEditClick(item.id)}>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                      </DropdownItem>
                                    </li>
                                    {item.status !== "Suspend" && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li onClick={() => suspendUser(item.id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Suspend User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li> */}
                        </ul>
                      </DataTableRow>
                    </DataTableItem>
                  );
                })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={totalUsers}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No userData found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
        <Modal isOpen={modal.add} toggle={() => setModal({ add: true })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">
                {editId ? "Update User" : "Add User"}
              </h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Display Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="display_name"
                        defaultValue={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        placeholder="Enter display_name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.display_name && <span className="invalid">{errors.display_name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Max Quota</label>
                      <input
                        className="form-control"
                        type="text"
                        name="max_quota"
                        defaultValue={formData.max_quota}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        placeholder="Enter Quota"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.max_quota && <span className="invalid">{errors.max_quota.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">User Role</label>
                      <input
                        className="form-control"
                        type="text"
                        name="user_role"
                        defaultValue={formData.user_role}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        placeholder="Enter user_role"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.user_role && <span className="invalid">{errors.user_role.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Employee Code</label>
                      <input
                        className="form-control"
                        name="emp_code"
                        defaultValue={formData.emp_code}
                        ref={register({ required: "This field is required" })}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        placeholder="Enter Employee Code"
                        required
                      />
                      {errors.emp_code && <span className="invalid">{errors.emp_code.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        // ref={register({ required: "This field is required" })}
                        placeholder="Enter Email"
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Add to Groups</label>
                      <input
                        className="form-control"
                        type="text"
                        name="add_group"
                        defaultValue={formData.add_group}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        // ref={register({ required: "This field is required" })}
                        placeholder="Enter Values"
                      />
                      {errors.add_group && <span className="invalid">{errors.add_group.message}</span>}
                    </FormGroup>
                  </Col>

                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label">Language</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={statusDropdown}
                          defaultValue="Please Select Language"
                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6" >

                  <FormGroup>
                      <label className="form-label">Time Zones</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={timezoneOptions}
                          defaultValue="Please Select zone"
                          onChange={(e) => setTimezone(e.target.value)}
                          // onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup> */}
                  {/* <RSelect value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option value="">Select timezone</option>
                      {timezoneOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </RSelect> */}
                  {/* </Col> */}




                  <Col size="12" >
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit"
                        >
                          {editId ? "Update User" : "Add User"}

                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                {/* <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{
                            value: formData.status,
                            label: formData.status,
                          }}
                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Update Usersss
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form> */}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default UserListRegularPage;
