import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../actions/users";
import EditUser from "./EditUser";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import { userService } from "../../services";
import { toast, ToastContainer } from "react-toastify";
import AddUser from "./AddUser";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CSVLink } from "react-csv";
import FormSpinner from "../Spinners/FormSpinner";
import ExportExcel from "../../helpers/ExportExcel";
import ExportPdf from "../../helpers/ExportPdf";
export default function UsersList() {
  const notificationRef = useRef();
  const dispatch = useDispatch();
  const [tableAction, setTableAction] = useState(false);
  const [isUserToggle, setIsUserToggle] = useState();
  const [editUserForm, setEditUserForm] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [userData, setUserData] = useState("");
  const [page, setPage] = useState(1);
  const toastId = useRef(null);
  const [search, setSearch] = useState("");
  const [option, setOption] = useState({ createdAt: -1 });
  const [filterAction, setFilterAction] = useState(false);
  const [fileterOption, setFilterOption] = useState({});
  const [userStatus, setUserStatus] = useState("All");
  const [userBlockStatus, setUserBlockStatus] = useState("All");
  const [subDuration, setSubDuration] = useState("All");
  const [device, setDevice] = useState("All");
  const [downloadUser, setDownloadUser] = useState([]);
  const [csvDownloading,setCsvDownloading]=useState(false)
  const [xlsxDownloading,setXlsxDownloading]=useState(false)
  const [pdfDownloading,setPdfDownloading]=useState(false)
 
  const allUserRef = useRef();
  let { users } = useSelector((state) => state.userReducer);
  const userHeaders = [
    {
      label: "Username",
      key: "username",
    },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Phone Number", key: "phone" },
    { label: "Wallet Amount", key: "walletAmount" },

    { label: "Withdraw Amount", key: "withdrawAmount" },
    { label: "Request Amount", key: "requestAmount" },

    { label: "Refferal", key: "yourRefferal" },
    { label: "Joined Refferal", key: "joinedRefferal" },
    { label: "Join Date", key: "createdAt" },
    { label: "Subscription Expired Date", key: "currentSubscriptionExpiryDate" },
  ];
  useEffect(() => {
    dispatch(getUsers(page, search, option, fileterOption));
    const closeNotificationPopup = (event) => {
      if (
        event.target.innerText != "View Lock" &&
        event.target.innerText != "Assign Lock" &&
        event.target.innerText != "Delete Lock" &&
        !event.target.classList.contains("tableActions") &&
        !event.target.classList.contains("three--vertical--dots")
      ) {
        setIsUserToggle(false);
      }
    };
    document.body.addEventListener("click", closeNotificationPopup, false);
    return () =>
      document.body.addEventListener("click", closeNotificationPopup, false);
  }, [option]);

  const editUserCloseModal = () => {
    setEditUserForm(false);
    setUserData("");
    dispatch(getUsers(page, search, option, fileterOption));
  };
  const addUserCloseModal = () => {
    setAddUserForm(false);
    dispatch(getUsers(page, search, option, fileterOption));
  };

  const handlePageClick = async (e) => {
    // console.log( e );
    let pageNo = e.selected + 1;
    await setPage(pageNo);
    dispatch(getUsers(pageNo, search, option, fileterOption));
  };

  const confirmDelete = (userId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteUser(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const confirmBlock = (userId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => blockUser(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const confirmUnBlock = (userId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => unblockUser(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const deleteUser = async (userId) => {
    let response = await userService.deleteUser(userId);
    if (response.success) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      dispatch(getUsers(page, search, option, fileterOption));
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const blockUser = async (userId) => {
    let response = await userService.blockUser(userId);
    if (response.success) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      dispatch(getUsers(page, search, option, fileterOption));
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const unblockUser = async (userId) => {
    let response = await userService.unblockUser(userId);
    if (response.success) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      dispatch(getUsers(page, search, option, fileterOption));
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const searchUsers = async (value) => {
    setPage(1);
    setSearch(value);
    // alert(value)
    dispatch(getUsers(1, value, option, fileterOption));
  };
  const handleFilterSubmit = () => {
    let tempdata = {};
    if (userStatus == "All") {
    } else {
      tempdata.status = userStatus == "true" ? true : false;
    }
    if (userBlockStatus == "All") {
    } else {
      tempdata.block = userBlockStatus == "true" ? true : false;
    }
    if (subDuration == "All") {
    } else {
      tempdata.subscriptionDuration = subDuration;
    }
    if (device == "All") {
    } else {
      tempdata.device = device;
    }

    dispatch(getUsers(1, search, option, tempdata));
    setFilterOption(tempdata);
    setFilterAction(false);
  };

  const downloadUsers = async (str) => {
   
    const { data } = await userService.downloadAllUser(search,option,fileterOption);
    setDownloadUser(data);
    if (str == "csv") {
      setTimeout(() => {
        allUserRef.current.link.click();
        setCsvDownloading(false);
      }, 1000);
    } else if (str == "xlsx") {
      ExportExcel(userHeaders, data, "user");
      setXlsxDownloading(false)
    } else if (str == "pdf") {
      ExportPdf(userHeaders, data, "user");
      setPdfDownloading(false)

    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="btnLists manager">
        <div className="addButton" onClick={() => setAddUserForm(true)}>
          <span>+</span> Add
        </div>
        <ul>
          <li>
            <form>
              <input
                type="text"
                placeholder="Search by Name..."
                onChange={(e) => searchUsers(e.target.value)}
              />
            </form>
          </li>

          <div className=" addButton1">
            <span
              className="filter--options"
              onClick={() => setFilterAction(!filterAction)}
            >
              Filter
            </span>

            {/* <li
                    className="filter--options"
                    title="Filter"
                    onClick={() => setFilterAction(!filterAction)}
                  >
                    Filter
                  </li> */}
          </div>
          <li>
            {csvDownloading ? (
              <Link href="javascript:void(0)">
                <a className="btn spinnerBtn">
                  <FormSpinner />
                </a>
              </Link>
            ) : (
              <Link href="javascript:void(0)">
                <a className="btn" onClick={() => {
                  setCsvDownloading(true)
                  downloadUsers("csv")}}>
                  Export as CSV
                </a>
              </Link>
            )}
               <CSVLink
              style={{ display: "none" }}
              ref={allUserRef}
              headers={userHeaders}
              data={downloadUser}
            >
              Download me
            </CSVLink>
          </li>
          <li>
            {xlsxDownloading ? (
              <Link href="javascript:void(0)">
                <a className="btn spinnerBtn">
                  <FormSpinner />
                </a>
              </Link>
            ) : (
              <Link href="javascript:void(0)">
                <a className="btn" onClick={() => {
                  setXlsxDownloading(true)
                  downloadUsers("xlsx")
                }}>
                  Export as xlsx
                </a>
              </Link>
            )}

         
          </li>
          <li>
            {" "}
            {pdfDownloading ? (
              <Link href="javascript:void(0)">
                <a className="btn spinnerBtn">
                  <FormSpinner />
                </a>
              </Link>
            ) : (
              <Link href="javascript:void(0)">
                <a className="btn" onClick={() => {
                  setPdfDownloading(true)
                  downloadUsers("pdf")
                }}>
                  Export as PDF
                </a>
              </Link>
            )}
          </li>
        </ul>
      </div>

      <div className="table--layout">
        {users && users.docs && users.docs.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th  className={
                    option.userId == 1
                      ? "desc"
                      : option.userId == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      userId: option.userId == 1 ? -1 : 1,
                    });
                  }} >
                  {/* <input type="checkbox" name="select--all" /> */}
                  UserId
                </th>
                <th
                  className={
                    option.username == 1
                      ? "desc"
                      : option.username == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      username: option.username == 1 ? -1 : 1,
                    });
                  }}
                >
                  Username
                </th>
                <th
                  className={
                    option.email == 1 ? "desc" : option.email == -1 ? "asc" : ""
                  }
                  style={{ cursor: "pointer", width: "4rem" }}
                  onClick={() => {
                    setOption({ email: option.email == 1 ? -1 : 1 });
                  }}
                >
                  Email
                </th>
                {/* <th
                className={
                  option.firstName == 1
                    ? "desc"
                    : option.firstName == -1
                    ? "asc"
                    : ""
                }
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOption({
                    firstName: option.firstName == 1 ? -1 : 1,
                    lastName: option.lastName == 1 ? -1 : 1,
                  });
                }}
              >
                FullName
              </th> */}
                <th
                  className={
                    option.phone == 1 ? "desc" : option.phone == -1 ? "asc" : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({ phone: option.phone == 1 ? -1 : 1 });
                  }}
                >
                  Phone
                </th>
                <th
                  className={
                    option.createdAt == 1
                      ? "desc"
                      : option.createdAt == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      createdAt: option.createdAt == 1 ? -1 : 1,
                    });
                  }}
                >
                  Join Date
                </th>
                <th
                  className={
                    option.subscription == 1
                      ? "desc"
                      : option.subscription == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      subscription: option.subscription == 1 ? -1 : 1,
                    });
                  }}
                >
                  Subscription
                </th>

                <th
                  className={
                    option.status == 1
                      ? "desc"
                      : option.status == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      status: option.status == 1 ? -1 : 1,
                    });
                  }}
                >
                  Status
                </th>
                <th
                  className={
                    option.subscriptionDuration == 1
                      ? "desc"
                      : option.subscriptionDuration == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      subscriptionDuration:
                        option.subscriptionDuration == 1 ? -1 : 1,
                    });
                  }}
                >
                  Subscription Duration
                </th>
                <th
                  className={
                    option.block == 1 ? "desc" : option.block == -1 ? "asc" : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      block: option.block == 1 ? -1 : 1,
                    });
                  }}
                >
                  Block
                </th>
               
                <th
                  className={
                    option.lastSeen == 1
                      ? "desc"
                      : option.lastSeen == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      lastSeen: option.lastSeen == 1 ? -1 : 1,
                    });
                  }}
                >
                  Last Seen
                </th>
                <th
                  className={
                    option.device == 1
                      ? "desc"
                      : option.device == -1
                      ? "asc"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOption({
                      device: option.device == 1 ? -1 : 1,
                    });
                  }}
                >
                  Joined Device
                </th>
                <th style={{ width: "4rem" }} className="sorting__disabled">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users?.docs &&
                users.docs.length > 0 &&
                users.docs.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        {/* <input type="checkbox" /> */}
                        {(page - 1) * 10 + i + 1}
                      </td>
                      <td>
                      {item.userId}

                      </td>
                      <td>{item.username}</td>
                      <td className="emailWidth">{item.email}</td>
                      {/* <td>{`${item?.firstName || ""} ${
                      item?.lastName || ""
                    }`}</td> */}
                      <td>
                        {" "}
                        <PhoneInput
                          className="PhonNumber"
                          placeholder="Enter phone number"
                          value={item.phone}
                          country={"ng"}
                          enableSearch={true}
                          disabled={true}
                          // defaultCountry="NG"
                        />
                      </td>
                      <td>{moment(item.createdAt).format("ll")}</td>
                      <td>{item.subscription ? "Active" : "Deactivate"}</td>

                      <td>
                        {item.status === 1 ? (
                          <span className="status--active user--status">
                            Active
                          </span>
                        ) : (
                          <span className="status--in-active user--status">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td>{item?.subscriptionDuration}</td>
                      <td>
                        {item.block ? (
                          <span className="status--in-active user--status">
                            Yes
                          </span>
                        ) : (
                          <span className="status--active user--status">
                            No
                          </span>
                        )}
                      </td>
                      <td>
                        
                        {item?.lastSeen? moment(item?.lastSeen).format('lll'):"N/A"}
                          </td>
                      <td className="deviceDiv">
                        {item?.device == "Mobile" ? (
                          <img
                            className="deviceImage"
                            src="/images/mobile-phone.png"
                          />
                        ) : item?.device == "Tablet" ? (
                          <img
                            className="deviceImage"
                            src="/images/tablet.png"
                          />
                        ) : (
                          <img
                            className="deviceImage"
                            src="/images/monitor.png"
                          />
                        )}
                      </td>
                     
                      <td
                        onClick={() => {
                          setTableAction(!tableAction),
                            setIsUserToggle(item._id);
                        }}
                        ref={notificationRef}
                      >
                        <span className="three--vertical--dots">
                          <span></span>
                          <span></span>
                          <span
                            onClick={() => {
                              // setTableAction(!tableAction),
                              setIsUserToggle(item._id);
                            }}
                          ></span>
                        </span>
                        
                      </td>
                      <div className="actionData">
                      {tableAction && isUserToggle === item._id ? (
                          <span className="tableActions" key={isUserToggle}>
                            <Link href="javascript:void(0)">
                              <a
                                className="edit__detail"
                                onClick={() => {
                                  setEditUserForm(true), setUserData(item);
                                }}
                              >
                                Edit User
                              </a>
                            </Link>
                            <Link href="javascript:void(0)">
                              <a
                                className="delete__lock"
                                onClick={() => {
                                  confirmDelete(item._id);
                                }}
                              >
                                Delete User
                              </a>
                            </Link>
                            {item?.block ? (
                              <Link href="javascript:void(0)">
                                <a
                                  className="user__lock"
                                  onClick={() => {
                                    confirmUnBlock(item._id);
                                  }}
                                >
                                  Unblock User
                                </a>
                              </Link>
                            ) : (
                              <Link href="javascript:void(0)">
                                <a
                                  className="user__lock"
                                  onClick={() => {
                                    confirmBlock(item._id);
                                  }}
                                >
                                  Block User
                                </a>
                              </Link>
                            )}
                            <Link href={`user-portfolio?id=${item._id}`}>
                              <a
                                className="view__lock"
                                // onClick={() => {
                                //   confirmDelete(item._id);
                                // }}
                              >
                                View Portfolio
                              </a>
                            </Link>
                          </span>
                        ) : (
                          " "
                        )}
                      </div>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0px" }}>
            <h1>No User Found!</h1>
          </div>
        )}
      </div>
      {Math.ceil(users?.total / users?.limit) > 0 && (
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(users?.total / users?.limit)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      )}

      <div
        className={
          filterAction ? "filter__actions filter__smooth" : "filter__actions"
        }
      >
        <div className="filter__title">Filter</div>
        <div
          className="filter__close"
          onClick={() => setFilterAction(!filterAction)}
        >
          X
        </div>
        <form>
          <div className="form--item">
            <label className="form--label">Status</label>
            <select
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="form--control"
            >
              <option value="All">All</option>

              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
          <div className="form--item">
            <label className="form--label">Block Status</label>
            <select
              value={userBlockStatus}
              onChange={(e) => setUserBlockStatus(e.target.value)}
              className="form--control"
            >
              <option value="All">All</option>

              <option value={true}>Block</option>
              <option value={false}>Unblock</option>
            </select>
          </div>
          <div className="form--item">
            <label className="form--label">Subscription Duration</label>
            <select
              value={subDuration}
              onChange={(e) => setSubDuration(e.target.value)}
              className="form--control"
            >
              <option value="All">All</option>
              <option value="free-lifetime">Basic</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="form--item">
            <label className="form--label">Device</label>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="form--control"
            >
              <option value="All">All</option>
              <option value="Browser">Desktop</option>
              {/* <option value="hourly">Hourly</option> */}
              <option value="Tablet">Tablet</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
          <div onClick={handleFilterSubmit}>
            <span
              style={{
                border: "1px solid #004577",
                padding: "8px 23px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Submit
            </span>
          </div>
        </form>
      </div>
      {/* add page ........ */}
      {addUserForm && <div className="layout--overlay--bg"></div>}
      <div
        className={addUserForm ? "form--layout form--active" : "form--layout"}
      >
        <div
          className="form__close"
          onClick={() => setAddUserForm(!addUserForm)}
        >
          X
        </div>
        {addUserForm && <AddUser addUserCloseModal={addUserCloseModal} />}
      </div>
      {/* edit page ..............  */}
      {editUserForm && <div className="layout--overlay--bg"></div>}
      <div
        className={editUserForm ? "form--layout form--active" : "form--layout"}
      >
        <div
          className="form__close"
          onClick={() => setEditUserForm(!editUserForm)}
        >
          X
        </div>
        {editUserForm && (
          <EditUser data={userData} editUserCloseModal={editUserCloseModal} />
        )}
      </div>
    </>
  );
}
