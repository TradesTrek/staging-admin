import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";

import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";
import AddDiscount from "../../components/subscription/AddDiscount";
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
  const [discounts, setDiscounts] = useState();
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
      label: "Discount Code",
      key: "code",
    },
    { label: "expiryDate", key: "expiryDate" },
    {
      label: "isActive",
      key: "isActive",
    },
    { label: "userLimit", key: "userLimit" },
    { label: "discountType", key: "discountType" },
    { label: "discountAmount", key: "discountAmount" },
    { label: "Usage Count", key: "usageCount" },
    { label: "Created Date", key: "createdAt" },
  ];

  useEffect(() => {
    getSubscription(option, search, currentPage);
  }, [option]);
  const getSubscription = (data, str, page) => {
    setIsLoading(true);
    subscriptionService
      .getAllDiscountCode(data, page, str)
      .then((res) => {
        if (res.success) {
          setDiscounts(res.data?.docs);
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
    setTableAction(false);
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
        <title>Create Discount Code</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">All Discount Codes</h1>

            {/* Filter and search box */}

            <div className="btnLists" onClick={() => setTableAction(false)}>
              <ul>
                <li>
                  <form>
                    <input
                      type="text"
                      placeholder="Search by code"
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
                      Create Code
                    </a>
                  </Link>
                </li>
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
                <AddDiscount addUserCloseModal={addUserCloseModal} />
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
                          option.code == 1
                            ? "desc"
                            : option.code == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            code: option.code == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Code
                      </th>
                      <th
                        className={
                          option.expiryDate == 1
                            ? "desc"
                            : option.expiryDate == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            expiryDate: option.expiryDate == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Expiry Date
                      </th>

                      <th
                        className={
                          option.isActive == 1
                            ? "desc"
                            : option.isActive == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            isActive: option.isActive == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Status
                      </th>

                      <th
                        className={
                          option.userLimit == 1
                            ? "desc"
                            : option.userLimit == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            userLimit: option.userLimit == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        User Limit
                      </th>
                      <th
                        className={
                          option.discountType == 1
                            ? "desc"
                            : option.discountType == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            discountType: option.discountType == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Discount Type
                      </th>

                      <th
                        className={
                          option.discountAmount == 1
                            ? "desc"
                            : option.discountAmount == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            discountAmount: option.discountAmount == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Discount Amount
                      </th>
                      <th
                        className={
                          option.usageCount == 1
                            ? "desc"
                            : option.usageCount == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            usageCount: option.usageCount == 1 ? -1 : 1,
                          });
                          setTableAction(false);
                        }}
                      >
                        Usage Count
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
                    {discounts &&
                      discounts.length > 0 &&
                      discounts.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td onClick={() => setTableAction(false)}>
                              {i + 1}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.code}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {moment(item.expiryDate).format("lll")}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.isActive ? "active" : "deactivated"}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {item.userLimit}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {item.discountType}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {item.discountAmount}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {item.usageCount}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {moment(item.createdAt).format("lll")}
                            </td>

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
