import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";

import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";
import AddSubscription from "../../components/subscription/AddSubscription";
import EditSubscription from "../../components/subscription/EditSubscription";
import { subscriptionService } from "../../services/subscription.service";
import moment from "moment";
import FormSpinner from "../../components/Spinners/FormSpinner";
import { CSVLink } from "react-csv";
import ExportExcel from "../../helpers/ExportExcel";
import ExportPdf from "../../helpers/ExportPdf";
import ReactPaginate from "react-paginate";

export default function AllSubscription() {
  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });

  const [tableAction, setTableAction] = useState(false);
  const [filterAction, setFilterAction] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [isUserToggle, setIsUserToggle] = useState();
  const [holiday, setSubscription] = useState();
  const [editUserForm, setEditUserForm] = useState(false);
  const [userData, setUserData] = useState("");
  const [option, setOption] = useState({ createdAt: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [xlsxDownloading, setXlsxDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const allSubscriptionRef = useRef();

  const [downloadSubscriptionData, setDownloadSubscriptionData] = useState([]);
  const SubscriptionHeaders = [
    {
      label: "Subscription Name",
      key: "packageName",
    },
    { label: "Subscription Duration", key: "packageDuration" },
    { label: "Package Amount", key: "packageAmount" },
    { label: "Package Day", key: "day" },
    { label: "Package Description", key: "packageDesc" },
    { label: "Created Date", key: "createdAt" },
  ];

  useEffect(() => {
    getSubscription(option, search, currentPage);
  }, [option]);
  const getSubscription = (data, str, page) => {
    setIsLoading(true);
    subscriptionService
      .getAllSubscription(data, page, str)
      .then((res) => {
        if (res.success) {
          setSubscription(res.data?.docs);
          setTotalPage(res.data?.pages);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const addUserCloseModal = () => {
    setAddUserForm(false);
    getSubscription(option, search, currentPage);
  };

  const editUserCloseModal = () => {
    setEditUserForm(false);
    setUserData("");
    setTableAction(false)
    getSubscription(option, search, currentPage);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    getSubscription(option, e.target.value, currentPage);
  };
  const downloadSubscription = async (str) => {
    const { data } = await subscriptionService.downloadSubscription(
      search,
      option
    );
    setDownloadSubscriptionData(data);
    if (str == "csv") {
      setTimeout(() => {
        allSubscriptionRef.current.link.click();
        setCsvDownloading(false);
      }, 1000);
    } else if (str == "xlsx") {
      ExportExcel(SubscriptionHeaders, data, "holiday");
      setXlsxDownloading(false);
    } else if (str == "pdf") {
      ExportPdf(SubscriptionHeaders, data, "holiday");
      setPdfDownloading(false);
    }
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    getSubscription(option, search, selected + 1);
  };
  const unableDisablePopup = (subId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => unableDisableSubscription(subId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const unableDisableSubscription = (subscriptionId) => {
    subscriptionService
      .unableDisableSub(subscriptionId)
      .then((res) => {
    getSubscription(option, search, currentPage);

        toast.success(res.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
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
      <Head>
        <title>Subscription Lists</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">All Subscriptions</h1>

            {/* Filter and search box */}

            <div className="btnLists" onClick={() => setTableAction(false)}>
              <ul>
                <li>
                  <form>
                    <input
                      type="text"
                      placeholder="Search by symbol, username and game name..."
                      onChange={(e) => handleSearch(e)}
                    />
                  </form>
                </li>
                <li>
                  {csvDownloading ? (
                    <Link href="javascript:void(0)">
                      <a className="btn spinnerBtn">
                        <FormSpinner />
                      </a>
                    </Link>
                  ) : (
                    <Link href="javascript:void(0)">
                      <a
                        className="btn"
                        onClick={() => {
                          setCsvDownloading(true);
                          downloadSubscription("csv");
                        }}
                      >
                        Export as CSV
                      </a>
                    </Link>
                  )}
                  <CSVLink
                    style={{ display: "none" }}
                    ref={allSubscriptionRef}
                    headers={SubscriptionHeaders}
                    data={downloadSubscriptionData}
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
                      <a
                        className="btn"
                        onClick={() => {
                          setXlsxDownloading(true);
                          downloadSubscription("xlsx");
                        }}
                      >
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
                      <a
                        className="btn"
                        onClick={() => {
                          setPdfDownloading(true);
                          downloadSubscription("pdf");
                        }}
                      >
                        Export as PDF
                      </a>
                    </Link>
                  )}
                </li>
                <li>
                  <Link href="javascript:void(0)">
                    <a
                      className="add__lock"
                      onClick={() => setAddUserForm(!addUserForm)}
                    >
                      Add Subscription
                    </a>
                  </Link>
                </li>

                {/* <li>
                  <form>
                    <input type="text" placeholder="Search by User Name..." />
                  </form>
                </li> */}
              </ul>
            </div>

            {/* Filter Options Form */}
            <div
              onClick={() => setTableAction(false)}
              className={
                filterAction
                  ? "filter__actions filter__smooth"
                  : "filter__actions"
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
                  <label className="form--label">Lock Brand Name</label>
                  <select className="form--control">
                    <option>Brand 1</option>
                    <option>Brand 2</option>
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label">Comapny Name</label>
                  <select className="form--control">
                    <optgroup label="Dubai">
                      <option>Company 1</option>
                      <option>Company 2</option>
                      <option>Company 3</option>
                      <option>Company 4</option>
                    </optgroup>
                    <optgroup label="UAE">
                      <option>Company 1</option>
                      <option>Company 2</option>
                      <option>Company 3</option>
                      <option>Company 4</option>
                    </optgroup>
                  </select>
                </div>
                {/* <div className="form--item">
                  <label className="form--label">Lock Status</label>
                  <select className="form--control">
                    <option>Assigned Locks</option>
                    <option>Active Locks</option>
                    <option>In Active Locks</option>
                  </select>
                </div> */}
              </form>
            </div>

            {/* Add Lock Form */}
            {addUserForm && <div className="layout--overlay--bg"></div>}
            <div
              className={
                addUserForm ? "form--layout form--active" : "form--layout"
              }
            >
              <div
                className="form__close"
                onClick={() => setAddUserForm(!addUserForm)}
              >
                X
              </div>
              {addUserForm && (
                <AddSubscription addUserCloseModal={addUserCloseModal} />
              )}
            </div>

            {/* Edit lock Form ........ */}
            {/* edit page ..............  */}
            {editUserForm && <div className="layout--overlay--bg"></div>}
            <div
              className={
                editUserForm ? "form--layout form--active" : "form--layout"
              }
            >
              <div
                className="form__close"
                onClick={() => setEditUserForm(!editUserForm)}
              >
                X
              </div>
              {editUserForm && (
                <EditSubscription
                  data={userData}
                  editUserCloseModal={editUserCloseModal}
                />
              )}
            </div>

            <div className="table--layout">
              {isLoading ? (
                <FormSpinner />
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th
                        onClick={() => setTableAction(false)}
                        style={{ width: "3rem" }}
                        className="sorting__disabled"
                      >
                        {/* <input type="checkbox" name="select--all" /> */}
                        Sr. No
                      </th>
                      <th
                        className={
                          option.packageName == 1
                            ? "desc"
                            : option.packageName == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            packageName: option.packageName == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Subscription Name
                      </th>
                      <th
                        className={
                          option.packageDuration == 1
                            ? "desc"
                            : option.packageDuration == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            packageDuration:
                              option.packageDuration == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Subscription Duration
                      </th>
                      <th
                        className={
                          option.packageAmount == 1
                            ? "desc"
                            : option.packageAmount == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            packageAmount: option.packageAmount == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Package Amount
                      </th>
                      <th
                        className={
                          option.day == 1
                            ? "desc"
                            : option.day == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            day: option.day == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Package Day
                      </th>

                      <th
                        className={
                          option.packageDesc == 1
                            ? "desc"
                            : option.packageDesc == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            packageDesc: option.packageDesc == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Package Desc
                      </th>
                      <th
                        className={
                          option.disable == 1
                            ? "desc"
                            : option.disable == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            disable: option.disable == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Package Status
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
                          setTableAction(false);
                        }}
                      >
                        Created Date
                      </th>

                      <th
                        onClick={() => setTableAction(false)}
                        className="asc desc sorting__disabled"
                      >
                        Action
                      </th>

                      {/* <th style={{ width: "4rem" }} className="sorting__disabled">
                      Actions
                    </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {holiday &&
                      holiday.length > 0 &&
                      holiday.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td onClick={() => setTableAction(false)}>
                              {/* <input type="checkbox" /> */}
                              {i + 1}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.packageName}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.packageDuration}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.packageAmount}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.packageDuration == "free-lifetime"
                                ? "free-lifetime"
                                : item.packageDuration}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {item.packageDesc}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.disable ? "Disable" : "Enable"}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {moment(item.createdAt).format("lll")}
                            </td>
                            {/* item.packageDuration == "trial" && */}
                            {
                              <td
                                onClick={() => {
                                  setTableAction(!tableAction),
                                    setIsUserToggle(item._id);
                                }}
                                // ref={notificationRef}
                              >
                                <span className="three--vertical--dots">
                                  <span></span>
                                  <span></span>
                                  <span
                                    onClick={() => {
                                      setTableAction(!tableAction),
                                        setIsUserToggle(item._id);
                                    }}
                                  ></span>
                                </span>
                               
                              </td>
                            }
                          <div className="actionData">
                          {tableAction && isUserToggle === item._id ? (
                                  <span
                                    className="tableActions"
                                    key={isUserToggle}
                                  >
                                    <Link href="javascript:void(0)">
                                      <a
                                        className="edit__detail"
                                        onClick={() => {
                                          setEditUserForm(true),
                                            setUserData(item);
                                        }}
                                      >
                                        Edit Subscription
                                      </a>
                                    </Link>
                                    <Link href="javascript:void(0)">
                                      <a
                                        className="edit__detail"
                                        onClick={() => {
                                          unableDisablePopup(item._id);
                                        }}
                                      >
                                        {item.disable == false
                                          ? "Disable"
                                          : "Enable"}
                                      </a>
                                    </Link>
                                    {/* <Link href={`subscription-details?id=${item._id}`}>
                                    <a
                                      className="view__lock"
                                      // onClick={() => {
                                      //   confirmDelete(item._id);
                                      // }}
                                    >
                                      Subscription Details
                                    </a>
                                  </Link> */}
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
              )}
              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPage}
                forcePage={currentPage - 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={1}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
