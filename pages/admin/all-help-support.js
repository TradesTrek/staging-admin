import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";

import SideBar from "../../components/side-bar/SideBar";

import moment from "moment";
import FormSpinner from "../../components/Spinners/FormSpinner";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import { orderService } from "../../services/order.service";
import ExportExcel from "../../helpers/ExportExcel";
import ExportPdf from "../../helpers/ExportPdf";


export default function AllHelpAndSupport() {
  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });

  const [allPendingOrder, setAllPendingOrder] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [option, setOption] = useState({ createdAt: -1 });
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [xlsxDownloading, setXlsxDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const allPendingRef = useRef();
  const [downloadPendingData, setDownloadPendingData] = useState([]);
  const PendingHeaders = [
    {
      label: "Title",
      key: "title",
    },
    {
      label: "Description",
      key: "description",
    },
   
    { label: "Username", key: "username" },

    { label: "Order Date", key: "createdAt" },
  ];
  useEffect(() => {
    getPendingOrder(1, search, option);
  }, [option]);
  const getPendingOrder = (page, str, op) => {
    setIsLoading(true);
    orderService
      .getAllHelpAndSupport(page, str, op)
      .then((res) => {
        if (res.success) {
          setAllPendingOrder(res.data);
          setTotalPage(res.totalPage);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    getPendingOrder(selected + 1, search, option);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    getPendingOrder(1, e.target.value, option);
  };

  const downloadPending = async (str) => {
    const { data } = await orderService.getAllHelpAndSupportDownload(search, option);
    setDownloadPendingData(data);
    if (str == "csv") {
      setTimeout(() => {
        allPendingRef.current.link.click();
        setCsvDownloading(false);
      }, 1000);
    } else if (str == "xlsx") {
      ExportExcel(PendingHeaders, data, "helpandsupport");
      setXlsxDownloading(false);
    } else if (str == "pdf") {
      ExportPdf(PendingHeaders, data, "helpandsupport");
      setPdfDownloading(false);
    }
  };

  return (
    <>
      <Head>
        <title>All Help & Support</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">All Help & Support</h1>
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
                          downloadPending("csv");
                        }}
                      >
                        Export as CSV
                      </a>
                    </Link>
                  )}
                  <CSVLink
                    style={{ display: "none" }}
                    ref={allPendingRef}
                    headers={PendingHeaders}
                    data={downloadPendingData}
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
                          downloadPending("xlsx");
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
                          downloadPending("pdf");
                        }}
                      >
                        Export as PDF
                      </a>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <div className="table--layout">
              {isLoading ? (
                <FormSpinner />
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th
                        style={{ width: "3rem" }}
                        className="sorting__disabled"
                      >
                        Sr. No
                      </th>
                      <th
                        className={
                          option.title == 1
                            ? "desc"
                            : option.title == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                              title: option.title == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Title
                      </th>
                      <th
                        className={
                          option.description == 1
                            ? "desc"
                            : option.description == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                              description: option.description == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Description
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
                            username:
                              option.username== 1 ? -1 : 1,
                          });
                        }}
                      >
                        Username
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
                        Created Date
                      </th>
                     

                      {/* <th style={{ width: "4rem" }} className="sorting__disabled">
                      Actions
                    </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {allPendingOrder &&
                      allPendingOrder.length > 0 &&
                      allPendingOrder.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              {/* <input type="checkbox" /> */}
                              {(currentPage - 1) * 10 + i + 1}
                            </td>
                            <td>{item?.title}</td>
                            
                            <td>{item.description}</td>
                            <td>{item?.username}</td>


                            <td>{moment(item.createdAt).format("ll")}</td>
                            {/* item.packageDuration == "trial" && */}
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
