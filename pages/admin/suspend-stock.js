import Head from "next/head";

import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";

import { MultiSelect } from "@mantine/core";
import { Button } from "@mui/material";
import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { stockService } from "../../services/stock.service";
import { toast, ToastContainer } from "react-toastify";

import ReactPaginate from "react-paginate";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function AllTransaction() {
  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [allStock, setAllStock] = useState([]);
  const [suspendedStocks, setSuspendedStocks] = useState([]);

  const pagination = {
    pageIndex: 1,
    pageSize: 1,
  };
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({}); //ts type available

  const [option, setOption] = useState({ createdAt: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [pickedStocks, setPickedStocks] = useState([]);
  const [stckz, setStckz] = useState([]);

  useEffect(() => {
    stockService
      .StocksNotSuspended()
      .then((res) => {
        if (res.success) {
          setStckz(res.data);
          setAllStock(res.data.map((e) => e.Name));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    stockService
      .SuspendedStocks()
      .then((res) => {
        if (res.success) {
          setSuspendedStocks(
            res.data.map((e) => ({ Name: e.Name, Symbol: e.Symbol }))
          );
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const getSymbolFromStock = (name) => {
    return stckz.filter((e) => e.Name === name)[0].Symbol;
  };
  const suspend = async () => {
    setIsToggleLoading(true);

    try {
      const stockNames = pickedStocks;
      const res = await stockService.toggleStocks({ stockNames });
      setPickedStocks([]);

      if (res.success) {
        const filteredUnSuspendedStocks = allStock.filter(
          (item) => !stockNames.includes(item)
        );
        const toBeAdded = stockNames.map((e) => ({
          Name: e,
          Symbol: getSymbolFromStock(e),
        }));

        setSuspendedStocks([...suspendedStocks, ...toBeAdded]);
        setAllStock(filteredUnSuspendedStocks);
        toast.success(res.message);
      }
      setIsToggleLoading(false);
    } catch (error) {
      setIsToggleLoading(false);
      toast.error("Failed to suspend stocks");
    }
  };

  const unSuspend = async () => {
    setIsToggleLoading(true);

    const pickedStocks = Object.keys(rowSelection)
      .map((index) => suspendedStocks[index])
      .filter((item) => item !== undefined);

    const stockNames = pickedStocks.map((e) => e.Name);

    try {
      const res = await stockService.toggleStocks({ stockNames });

      if (res.success) {
        setRowSelection({});
        const filteredArray = suspendedStocks.filter(
          (item) =>
            !pickedStocks.some((filterItem) => filterItem.Name === item.Name)
        );
        setSuspendedStocks(filteredArray);
        setAllStock([...stockNames, ...allStock]);
        toast.success(res.message);
      }
      setIsToggleLoading(false);
    } catch (error) {
      setIsToggleLoading(false);
      toast.error("Failed to unsuspend stocks");
    }
  };
  const getLogs = (search, option, page) => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    userService
      .getAllUsersForGifting(search, option, page)
      .then((res) => {
        if (res.success) {
          setData(res.data?.docs);
          setTotalPage(res.data.pages);
          setRowCount(res.data?.docs.length);
        }
        setIsLoading(false);
        setIsRefetching(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
    getLogs(!globalFilter ? "" : globalFilter, option, selected + 1);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "Name", // Access data directly with key
        header: "Stock Name",
      },
      {
        accessorKey: "Symbol",
        header: "Stock Symbol",
      },
    ],
    []
  );
  const table = useMantineReactTable({
    columns,
    data: suspendedStocks, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    mantineSearchTextInputProps: {
      placeholder: "Search by stock name",
    },
    enableRowSelection: true,
    enableColumnFilters: false,
    initialState: { showColumnFilters: true },
    enableSorting: false,

    getRowId: (row) => row.email,
    onRowSelectionChange: setRowSelection,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    enablePagination: false,
    rowCount,
    onGlobalFilterChange: setGlobalFilter,

    state: {
      globalFilter,
      isLoading,
      pagination,
      showProgressBars: isRefetching,
      rowSelection,
    },
  });

  return (
    <>
      <Head>
        <title>Suspend stocks</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />

      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">Suspend stocks</h1>
            {pickedStocks.length > 0 && (
              <Button
                className=""
                variant="contained"
                disabled={isToggleLoading}
                style={{
                  margin: "10px",
                }}
                onClick={suspend}
              >
                {isToggleLoading ? "Loading" : "Suspend"}
              </Button>
            )}

            <MultiSelect
              label="Pick a stock to suspend"
              placeholder="Search by stock name"
              data={allStock}
              value={pickedStocks}
              onChange={setPickedStocks}
              searchable
              maxDropdownHeight={200}
              clearable
            />

            <br />
            <div className="btnLists manager">
              <ul>
                <li>
                  {Object.keys(rowSelection).length > 0 && (
                    <a
                      style={{ cursor: "pointer" }}
                      className="btn"
                      onClick={unSuspend}
                    >
                      {isToggleLoading
                        ? "Loading"
                        : "Un-suspend selected stock(s)"}
                    </a>
                  )}
                </li>
              </ul>
            </div>

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
            <div className="table--layout">
              {isLoading ? (
                <>Loading....</>
              ) : (
                <MantineReactTable table={table} />
              )}

              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPage}
                forcePage={currentPage - 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
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
