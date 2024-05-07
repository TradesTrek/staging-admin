import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import ExportExcel from "../../helpers/ExportExcel";
import ExportPdf from "../../helpers/ExportPdf";
import { userService } from "../../services";
import FormSpinner from "../Spinners/FormSpinner";

const TradeHistory = () => {
  const router = useRouter();
  const tradehistory = useRef();
  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingTrade, setLoadingTrade] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [option, setOption] = useState({ createdAt: -1 });
const [csvDownloading,setCsvDownloading]=useState(false)
const [xlsxDownloading,setXlsxDownloading]=useState(false)
const [pdfDownloading,setPdfDownloading]=useState(false)
  const [tradeHeaders, setTradeHeaders] = useState([
    {
      label: "Username",
      key: "username",
    },
    {
      label: "Competition Name",
      key: "competitionName",
    },
    {
      label: "Order Id",
      key: "orderId",
    },
    { label: "Date", key: "createdAt" },
    { label: "Symbol", key: "symbol" },
    { label: "Trade Type", key: "action" },
    { label: "Quantity", key: "quantity" },
    { label: "Price", key: "rate" },
    { label: "Status", key: "status" },

  ]);
  useEffect(() => {
    if (router?.query?.id) {
      setUserId(router?.query?.id);
      GetAllUserTradeHistoy(router?.query?.id, search, currentPage, option);
    }
  }, [router, option]);

  const GetAllUserTradeHistoy = (id, search, page, option) => {
    userService
      .getUserWatchList(id, search, page, option)
      .then((res) => {
        if (res.success) {
          setHistory(res?.data);
          setCurrentPage(res?.page);
          setTotalPage(res?.totalPage);
        } else {
          setHistory([]);
        }
      })
      .catch((err) => {
        setHistory([]);
        console.log(err);
      });
  };
 
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    GetAllUserTradeHistoy(userId, search, selected + 1, option);

    // getCancelOrder(selected + 1, search, option);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);

    GetAllUserTradeHistoy(userId, e.target.value, 1, option);

    // getCancelOrder(1, e.target.value, option);
  };
  const downloadHistory = async (str) => {
    const { data } = await userService.downloadUserAllTradeHistory(userId,search,option)
    //  orderService.downloadUserAllTradeHistory(search, option);
    setHistory(data);
    if (str == "csv") {
      setTimeout(() => {
        tradehistory.current.link.click();
        setCsvDownloading(false);
      }, 1000);
    } else if (str == "xlsx") {
      ExportExcel(tradeHeaders, data, "userhistory");
      setXlsxDownloading(false);
    } else if (str == "pdf") {
      ExportPdf(tradeHeaders, data, "userhistory");
      setPdfDownloading(false);
    }
  };
  return (
    <div className="table--layout">
      <div className="btnLists manager">
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
                          downloadHistory("csv");
                        }}
                      >
                        Export as CSV
                      </a>
                    </Link>
                  )}
                  <CSVLink
                    style={{ display: "none" }}
                    ref={tradehistory}
                    headers={tradeHeaders}
                    data={history}
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
                          downloadHistory("xlsx");
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
                          downloadHistory("pdf");
                        }}
                      >
                        Export as PDF
                      </a>
                    </Link>
                  )}
                </li>
        </ul>
      </div>
      <table>
        <thead>
          <tr>
            <th className="sorting__disabled">
              {/* <input type="checkbox" name="select--all" /> */}
              Sr. No
            </th>
            <th
              className={
                option.orderId == 1 ? "desc" : option.orderId == -1 ? "asc" : ""
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOption({
                  orderId: option.orderId == 1 ? -1 : 1,
                });
              }}
            >
              Order Id
            </th>
            <th
              className={
                option.symbol == 1 ? "desc" : option.symbol == -1 ? "asc" : ""
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOption({
                  symbol: option.symbol == 1 ? -1 : 1,
                });
              }}
            >
              Stock Symbol
            </th>
            <th
              className={
                option.action == 1 ? "desc" : option.action == -1 ? "asc" : ""
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOption({
                  action: option.action == 1 ? -1 : 1,
                });
              }}
            >
              Action
            </th>
            <th
              className={
                option.quantity == 1
                  ? "desc"
                  : option.quantity == -1
                  ? "asc"
                  : ""
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOption({
                  quantity: option.quantity == 1 ? -1 : 1,
                });
              }}
            >
              Quantity
            </th>
            <th
              className={
                option.rate == 1 ? "desc" : option.rate == -1 ? "asc" : ""
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOption({
                  rate: option.rate == 1 ? -1 : 1,
                });
              }}
            >
              Rate
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
            <th  className={
                option.competitionName == 1
                  ? "desc"
                  : option.competitionName == -1
                  ? "asc"
                  : ""
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOption({
                  competitionName: option.competitionName == 1 ? -1 : 1,
                });
              }}>Competition Name</th>

            <th className={
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
              }}>Created Date</th>
            <th className={
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
              }}>Status</th>

            {/* <th style={{ width: "4rem" }} className="sorting__disabled">
                      Actions
                    </th> */}
          </tr>
        </thead>
        <tbody>
          {history?.length > 0 ? (
            history?.map((item, i) => {
              return (
                <tr key={i}>
                  <td style={{ width: "2rem" }}>
                    {(currentPage - 1) * 10 + i + 1}
                  </td>
                  <td>{item.orderId}</td>

                  <td>{item.symbol}</td>
                  <td>{item.action}</td>
                  <td>{item.quantity}</td>
                  <td>{item.rate?.toFixed(2)}</td>
                  <td>{item?.username}</td>
                  <td>{item?.competitionName}</td>

                  <td>{moment(item.createdAt).format("MMM Do YY")}</td>
                  <td>{item.status}</td>

                  {/* <td
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
                              </span>
                            ) : (
                              " "
                            )}
                          </td> */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td style={{ textAlign: "center" }} colSpan={7}>
                No History Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
  );
};

export default TradeHistory;
