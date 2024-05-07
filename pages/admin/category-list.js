import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import SideBar from "../../components/side-bar/SideBar";
import { confirmAlert } from "react-confirm-alert";
import moment from "moment";
import FormSpinner from "../../components/Spinners/FormSpinner";
import ReactPaginate from "react-paginate";
import AddCategory from "../../components/category/AddCategory";
import EditCategory from "../../components/category/EditCategory";
import { learningService } from "../../services/learning.service";
import { toast, ToastContainer } from "react-toastify";
import getConfig from "next/config";

export default function CategoryList() {
  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });
  const toastId = useRef(null);
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const [tableAction, setTableAction] = useState(false);
  const [filterAction, setFilterAction] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [isUserToggle, setIsUserToggle] = useState();
  const [holiday, setHoliday] = useState();
  const [editUserForm, setEditUserForm] = useState(false);
  const [userData, setUserData] = useState("");
  const [option, setOption] = useState({ createdAt: -1 });
  const [isLoading,setIsLoading]=useState(false)
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPage,setTotalPage]=useState(1)
  const [search,setSearch]=useState('')
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [xlsxDownloading, setXlsxDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const allHolidayRef = useRef();
  const [downloadHolidayData, setDownloadHolidayData] = useState([]);
  const HolidayHeaders = [
    {
      label: "Holiday",
      key: "holidayName",
    },
    { label: "Date", key: "holidayDate" },
    { label: "Message", key: "holidayMessage" },
    { label: "Created Date", key: "createdAt" },


   
  ];

  useEffect(() => {
    getHoliday(search,option,currentPage);
  }, [search,option]);
  const getHoliday = (search,data,page) => {
    setIsLoading(true)
    learningService
      .GetAllCategory(search,data,page)
      .then((res) => {
        if (res.success) {
          setHoliday(res.data?.docs);
          setTotalPage(res.data.pages)
        }
        setIsLoading(false)
      })
      .catch((err) => {setIsLoading(false); console.log(err)});
  };

  const addUserCloseModal = () => {
    setAddUserForm(false);
    getHoliday(search,option,currentPage);
  };

  const editUserCloseModal = () => {
    setEditUserForm(false);
    setTableAction(false)
    setUserData("");
    getHoliday(search,option,currentPage)
  };

  const confirmDelete = (userId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteCategory(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const confirmDisable = (userId) => {
    confirmAlert({
      title: "Confirm to disable category",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => enableDisableCategory(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const confirmEnable = (userId) => {
    confirmAlert({
      title: "Confirm to enable category",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => enableDisableCategory(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  
  const deleteCategory = async (userId) => {
    let response = await learningService.DeleteCategory(userId);
    if (response.success) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setTableAction(false)

      getHoliday(search,option,currentPage);
    } else {
      setTableAction(false)

      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const enableDisableCategory = async (userId) => {
    let response = await learningService.EnableDisableCategory(userId);
    if (response.success) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setTableAction(false)
      getHoliday(search,option,currentPage);
    } else {
      setTableAction(false)

      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleSearch=(e)=>{
    setSearch(e.target.value)
    setCurrentPage(1)
  }
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    getHoliday(search,option,selected+1);
    
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
        <title>All Category List</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">All Category</h1>

            {/* Filter and search box */}
            

            <div onClick={()=>setTableAction(false)} className="btnLists">
              <ul>
              {/* <li>
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
                          downloadHoliday("csv");
                        }}
                      >
                        Export as CSV
                      </a>
                    </Link>
                  )}
                  <CSVLink
                    style={{ display: "none" }}
                    ref={allHolidayRef}
                    headers={HolidayHeaders}
                    data={downloadHolidayData}
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
                          downloadHoliday("xlsx");
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
                          downloadHoliday("pdf");
                        }}
                      >
                        Export as PDF
                      </a>
                    </Link>
                  )}
                </li> */}
                <li>
                  <Link href="javascript:void(0)">
                    <a
                      className="add__lock"
                      onClick={() => setAddUserForm(!addUserForm)}
                    >
                      Add Category
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
            <div onClick={()=>setTableAction(false)}
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
              <form >
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
                <AddCategory addUserCloseModal={addUserCloseModal} />
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
                <EditCategory
                  data={userData}
                  editUserCloseModal={editUserCloseModal}
                />
              )}
            </div>

            <div className="table--layout" >
             {isLoading?<FormSpinner />: <table>
                <thead>
                  <tr>
                        
                    <th onClick={()=>setTableAction(false)} style={{ width: "3rem" }} className="sorting__disabled">
                      {/* <input type="checkbox" name="select--all" /> */}
                      Sr. No
                    </th>
                    <th
                      className={
                        option.categoryName == 1
                          ? "desc"
                          : option.holidayName == -1
                          ? "asc"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setOption({
                          categoryName: option.categoryName == 1 ? -1 : 1,
                        });
                        setTableAction(false)

                      }}
                    >
                      Category Name
                    </th>
                    <th
                      className={
                        option.categoryName == 1
                          ? "desc"
                          : option.holidayName == -1
                          ? "asc"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setOption({
                          categoryName: option.categoryName == 1 ? -1 : 1,
                        });
                        setTableAction(false)

                      }}
                    >
                      Enable/Disable
                    </th>
                    <th
                      className={
                        option.holidayDate == 1
                          ? "desc"
                          : option.holidayDate == -1
                          ? "asc"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setOption({
                          holidayDate: option.holidayDate == 1 ? -1 : 1,
                        });
                        setTableAction(false)

                      }}
                    >
                      Category Image
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
                        setTableAction(false)
                      }}
                    >
                      Created At
                    </th>

                    <th onClick={()=>setTableAction(false)} style={{ width: "4rem" }} className="sorting__disabled">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holiday &&
                    holiday.length > 0 &&
                    holiday.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td onClick={()=>setTableAction(false)}>
                            {i+1}
                            {/* <input type="checkbox" /> */}
                          </td>
                          <td onClick={()=>setTableAction(false)}>{item.categoryName}</td>
                          <td onClick={()=>setTableAction(false)}>{item.status?"Enable":"Disable"}</td>

                          <td onClick={()=>setTableAction(false)}><img width={110} src={`${item.imageUrl}`} /> </td>
                          <td onClick={()=>setTableAction(false)}>{moment(item.createdAt).format("lll")}</td>

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
                                    Edit Category
                                  </a>
                                </Link>
                                {item.status?<Link href="javascript:void(0)">
                                  <a
                                    className="assign__lock"
                                    onClick={() => {
                                      confirmDisable(item._id);
                                    }}
                                  >
                                    Disable Category
                                  </a>
                                </Link>:<Link href="javascript:void(0)">
                                  <a
                                    className="assign__lock"
                                    onClick={() => {
                                      confirmEnable(item._id);
                                    }}
                                  >
                                    Enable Category
                                  </a>
                                </Link>}
                                <Link href="javascript:void(0)">
                                  <a
                                    className="delete__lock"
                                    onClick={() => {
                                      confirmDelete(item._id);
                                    }}
                                  >
                                    Delete Category
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
              </table>}
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
