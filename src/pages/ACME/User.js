import React, { useContext, useEffect, useState } from "react";
// import Content from "../../../layout/content/Content";
import Content from "../../layout/content/Content";
// import Head from "../../../layout/head/Head";
import Head from "../../layout/head/Head";
import moment from "moment-timezone";
import Switch from "react-switch";

import { notification } from "antd";

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
} from "../../../src/components/Component";
import {
  filterRole,
  filterStatus,
  userData,
} from "../../pages/pre-built/user-manage/UserData";
import { bulkActionOptions, findUpper } from "../../../src/utils/Utils";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";
const UserListRegularPage = () => {
  const {
    contextData,
    addUser,
    getUser,
    updateUser,
    getGroupsDropdown,
    deleteUser,
    blockUser,
  } = useContext(UserContext);
  const { setAuthToken } = useContext(AuthContext);
  console.log("contextData ", contextData);
  const [userData, setUserData] = contextData;

  const [sm, updateSm] = useState(false);

  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });

  function handleStatusToggle(id, checked) {
    // Your logic to update the status based on the id and checked value
  }
  const [editId, setEditedId] = useState();
  const [deleteId, setDeleteId] = useState(false);
  const [blockId, setBlockId] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    userValidity: "",
    display_name: "",
    emp_code: "",
    email: "",
    add_group: "",
    user_role: "",
    max_quota: "",
    password: "",
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(1);
  const [sort, setSortState] = useState("");
  const [statusDropdown, setStatusDropDown] = useState([
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
  ]);
  const [roleDropdown, setRolewDropDown] = useState([
    { value: "Agent", label: "Agent" },
    { value: "Admin", label: "Admin" },
  ]);

  const [groupsDropdown, setGroupsDropdown] = useState([]);

  const timezones = moment.tz.names().map((zone) => ({
    value: zone,
    label: `(UTC${moment.tz(zone).format("Z")}) ${zone}`,
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
  const getRolesDropdown = () => {
    getGroupsDropdown(
      {},

      (apiRes) => {
        // console.log(" get user apiRes apiRes===============================================", apiRes);
        // const { data: { data :{data}},status, token }  = apiRes;
        const data = apiRes.data;
        const code = apiRes.status;
        const message = apiRes.data.message;
        // console.log(" get user apiRes data", data);
        // console.log(" get user apiRes message", message);
        // console.log(" get user apiRes token", token);

        setGroupsDropdown(
          data.groups.map((gro) => ({
            label: gro.group_name,
            value: gro.id,
          }))
        );

        // setAuthToken(token);
      },
      (apiErr) => {
        console.log(" get user apiErr ", apiErr);
      }
    );
  };

  useEffect(() => {
    getUsers();
  }, [deleteId]);

  useEffect(() => {
    getRolesDropdown();
  }, []);
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setUserData([...newData]);
  }, []);

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  const getUsers = () => {
    getUser(
      { pageNumber: currentPage, pageSize: itemPerPage, search: onSearchText },
      (apiRes) => {
        console.log(" get user apiRes apiRes", apiRes);
        // const { data: { data :{data}},status, token }  = apiRes;
        const data = apiRes.data.data;
        const code = apiRes.status;
        const message = apiRes.data.message;
        const count = apiRes.data.count;
        console.log(" get user apiRes data", data);
        console.log(" get user apiRes message", message);
        // console.log(" get user apiRes token", token);
        console.log(" get user apiRes code", code);
        setTotalUsers(count);

        if (code == 200) {
          setUserData(data);
        }
        // setAuthToken(token);
      },
      (apiErr) => {
        console.log(" get user apiErr ", apiErr);
      }
    );
  };

  const [timezone, setTimezone] = useState("");
  const timezoneOptions = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.split("/")
    .map((zone) => ({ value: zone, label: zone }));

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
      userValidity: "",
      display_name: "",
      emp_code: "",
      email: "",
      add_group: "",
      user_role: "",
      max_quota: "",
      password: "",
    });
    setEditedId(0);
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = () => {
    debugger;
    // console.log("user submitData ", submitData)
    console.log("user formData ", formData);
    // const { name, email, phone } = submitData;
    if (editId) {
      let submittedData = {
        id: editId,
        userValidity: formData.userValidity,
        display_name: formData.display_name,
        emp_code: formData.emp_code,
        email: formData.email,
        add_group: formData.add_group,
        user_role: formData.user_role,
        max_quota: formData.max_quota,
        password: formData.password,
      };
      // setUserData([submittedData, ...userData]);

      addUser(
        submittedData,
        (apiRes) => {
          console.log(apiRes);
          const code = 200;
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
          console.log(" add user apiErr ", apiErr);
        }
      );
    } else {
      let submittedData = {
        userValidity: formData.userValidity,
        display_name: formData.display_name,
        emp_code: formData.emp_code,
        email: formData.email,
        add_group: formData.add_group,
        user_role: formData.user_role,
        max_quota: formData.max_quota,
        password: formData.password,
      };
      addUser(
        submittedData,
        (apiRes) => {
          console.log(apiRes);
          const code = 200;
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
          console.log(" add user apiErr ", apiErr);
        }
      );
      // setUserData([submittedData, ...userData]);
    }

    // }
  };

  // function that loads the want to editted userData
  const onEditClick = (id) => {
    console.log("id........", id);
    console.log("userData........", userData);
    userData.map((item) => {
      if (item.id == id) {
        console.log(item, "sds");
        setFormData({
          id: id,
          userValidity: formData.userValidity,
          display_name: item.display_name,
          user_role: item.user_role,
          max_quota: item.max_quota,
          add_group: item.add_group,
          emp_code: item.emp_code,
          email: item.email,
          password: item.password,
          // role: item.user_role,
          // status: item.status
        });

        setModal({ edit: false, add: true });
        setEditedId(id);
      }
    });
  };

  const onDeleteClick = (id) => {
    notification["warning"]({
      placement: "bottomRight",
      description: "",
      message: "User Deleted",
    });
    setDeleteId(true);
    console.log("id........", id);
    console.log("userData........", userData);
    let deleteId = { id: id };
    deleteUser(
      deleteId,
      (apiRes) => {
        console.log(apiRes);
        const code = 200;
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
        console.log(" add user apiErr ", apiErr);
      }
    );
  };

  const onBlockClick = (id) => {
    notification["warning"]({
      placement: "bottomRight",
      description: "",
      message: "User Blocked",
    });
    setBlockId(true);
    console.log("id........", id);
    console.log("userData........", userData);
    let blockId = { id: id };
    blockUser(
      blockId,
      (apiRes) => {
        console.log(apiRes);
        const code = 200;
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
        console.log(" add user apiErr ", apiErr);
      }
    );
  };

  useEffect(() => {
    // onBlockClick()
  }, [blockId]);
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
  const paginate = (pageNumber) => {
    debugger;
    console.log(pageNumber);
    setCurrentPage(pageNumber);
  };

  const { errors, register, handleSubmit, watch, triggerValidation } =
    useForm();

  // useEffect(() => {
  //   if (watch("password")) {
  //     triggerValidation("confirmPassword");
  //   }
  // }, [watch, triggerValidation]);

  return (
    <React.Fragment>
      <Head title="User List - Regular"></Head>
      <Content>
        <Stack style={{ marginTop: "-19px" }}>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <Typography style={{ fontSize: "24.5px", fontWeight: "bold" }}>
                  Users Lists
                </Typography>
                <BlockDes className="text-soft">
                  <p>You have total {totalUsers} users.</p>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <div className="toggle-wrap nk-block-tools-toggle">
                  <Button
                    className={`btn-icon btn-trigger toggle-expand mr-n1 ${
                      sm ? "active" : ""
                    }`}
                    onClick={() => updateSm(!sm)}
                  >
                    <Icon name="menu-alt-r"></Icon>
                  </Button>
                  <div
                    className="toggle-expand-content"
                    style={{ display: sm ? "block" : "none" }}
                  >
                    <ul className="nk-block-tools g-3">
                      {/* <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </Button>
                    </li> */}
                      <li className="nk-block-tools-opt">
                        <Button
                          color="primary"
                          className="btn-icon"
                          onClick={() => setModal({ add: true })}
                        >
                          <Icon name="plus"></Icon>
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
        </Stack>
        <Block>
          <DataTable className="card-stretch">
            <div
              className="card-inner position-relative card-tools-toggle"
              style={{ height: "2px" }}
            >
              <div className="card-title-group">
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
                        <Icon
                          name="search"
                          style={{ marginTop: "-25px" }}
                        ></Icon>
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
                        <div
                          className={`toggle-content ${
                            tablesm ? "content-active" : ""
                          }`}
                        >
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button
                                className="btn-icon btn-trigger toggle"
                                onClick={() => updateTableSm(false)}
                              >
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
              <div
                className={`card-search search-wrap ${!onSearch && "active"}`}
              >
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
                  <span className="sub-text" style={{ fontWeight: "bold" }}>
                    Display Name
                  </span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text" style={{ fontWeight: "bold" }}>
                    Email
                  </span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text" style={{ fontWeight: "bold" }}>
                    Employee Code
                  </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text" style={{ fontWeight: "bold" }}>
                    Max Quota
                  </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text" style={{ fontWeight: "bold" }}>
                    {" "}
                    User Role
                  </span>
                </DataTableRow>
                {/* <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow> */}
                {/* <DataTableRow className="nk-tb-col-tools text-right"> */}
                <DataTableRow size="lg">
                  <span
                    className="sub-text"
                    style={{ marginLeft: "30px", fontWeight: "bold" }}
                  >
                    Action
                  </span>
                </DataTableRow>
              </DataTableHead>

              {userData.length > 0
                ? userData.map((item) => {
                    return (
                      <DataTableItem key={item.user_id}>
                        <DataTableRow size="md" style={{ innerHeight: "10px" }}>
                          <span>{item.display_name}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.email}</span>
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

                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions">
                            <li
                              className=""
                              onClick={() => onEditClick(item.id)}
                            >
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"edit" + item.id}
                                icon="edit-alt-fill"
                                direction="top"
                                text="Edit"
                                style={{
                                  backgroundColor: "transparent",
                                  boxShadow: "none",
                                  color: "inherit",
                                }}
                              />
                              &nbsp;&nbsp;
                            </li>

                            <li
                              className=""
                              // onClick={() => onDeleteClick(item.id)}
                              onClick={handleClickOpen}

                            >
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"edit" + item.id}
                                icon="icon ni ni-trash-alt"
                                direction="top"
                                text="Edit"
                                style={{
                                  backgroundColor: "transparent",
                                  boxShadow: "none",
                                  color: "inherit",
                                }}
                              />
                              &nbsp;&nbsp;
                            </li>

                            <div>
                            
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{backgroundColor: "transparent"}}


                              >
                                <DialogTitle id="alert-dialog-title">
                                  {"User Delete?Are You Sure!"}
                                </DialogTitle>
                             
                                <DialogActions>
                                  <Button onClick={handleClose}>
                                    No
                                  </Button>
                                  <Button onClick={handleClose} autoFocus>
                                    Yes
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </div>
                            {/* <li className="" onClick={() => onBlockClick(item.id)}>
                            <TooltipComponent
                              tag="a"
                              containerClassName="btn btn-trigger btn-icon"
                              id={"edit" + item.id}
                              icon="icon ni ni-stop-circle-fill"
                              direction="top"
                              text="Edit"
                              style={{ backgroundColor: "transparent", boxShadow: "none", color: "inherit" }}

                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                          </li> */}
                            <li>
                              <Switch
                                onChange={(checked) =>
                                  handleStatusToggle(item.id, checked)
                                }
                                checked={item.user_status === "Active"}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                onColor="#28a745"
                                offColor="#3B3B3B"
                                height={17}
                                width={30}
                                handleDiameter={14}
                                // style={{marginTop:"10px"}}
                              />
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {userData.length > 0 ? (
                <div className="chat-user-pagination">
                  <PaginationComponent
                    size="sm"
                    totalItems={totalUsers}
                    itemPerPage={itemPerPage}
                    paginate={paginate}
                    // maxPaginationNumbers={20}
                    currentPage={currentPage}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-silent">No userData found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <Modal
          isOpen={modal.add}
          toggle={() => setModal({ add: true })}
          className="modal-dialog-centered"
          size="lg"
        >
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
              <h5 className="title">{editId ? "Update User" : "Add User"}</h5>
              <div className="mt-4">
                <Form
                  className="row gy-4"
                  noValidate
                  onSubmit={handleSubmit(onFormSubmit)}
                >
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Display Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="display_name"
                        defaultValue={formData.display_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        placeholder="Enter display_name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.display_name && (
                        <span className="invalid">
                          {errors.display_name.message}
                        </span>
                      )}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        placeholder="Enter Quota"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.max_quota && (
                        <span className="invalid">
                          {errors.max_quota.message}
                        </span>
                      )}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        placeholder="Enter User Role"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.user_role && (
                        <span className="invalid">
                          {errors.user_role.message}
                        </span>
                      )}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        placeholder="Enter Employee Code"
                        required
                      />
                      {errors.emp_code && (
                        <span className="invalid">
                          {errors.emp_code.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="text"
                        name="password"
                        defaultValue={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        // ref={register({ required: "This field is required" })}
                        placeholder="Enter Password"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.password && (
                        <span className="invalid">
                          {errors.password.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Confirm Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name="confirmPassword"
                        defaultValue=""
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        placeholder="Confirm Password"
                        ref={register({
                          required: "This field is required",
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords don't match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <span className="invalid">
                          {errors.confirmPassword.message}
                        </span>
                      )}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        // ref={register({ required: "This field is required" })}
                        placeholder="Enter Email"
                      />
                      {errors.email && (
                        <span className="invalid">{errors.email.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Add to Groups</label>
                      <RSelect
                        options={groupsDropdown}
                        name="add_group"
                        defaultValue="Please Select Groups"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            add_group: e.label,
                            [e.label]: e.value,
                          })
                        }
                      />
                      {/* <input
                        className="form-control"
                        type="text"
                        name="add_group"
                        defaultValue={formData.add_group}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        // ref={register({ required: "This field is required" })}
                        placeholder="Add Group"
                      /> */}
                      {errors.add_group && (
                        <span className="invalid">
                          {errors.add_group.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup label="Validity" className="form-label">
                      <label className="form-label">Validity</label>

                      <DatePicker
                        name="userValidity"
                        selected={formData.userValidity}
                        onChange={(e) =>
                          setFormData({ ...formData, userValidity: e })
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Validity"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                      />

                      {/* {errors.confirmPassword && <span className="invalid">{errors.confirmPassword.message}</span>} */}
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
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
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

        <Modal
          isOpen={modal.edit}
          toggle={() => setModal({ edit: false })}
          className="modal-dialog-centered"
          size="lg"
        >
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
