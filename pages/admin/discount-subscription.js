import Head from "next/head";
import { Checkbox, Stack } from "@mantine/core";
import { subscriptionService } from "../../services/subscription.service";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { Box } from "@mantine/core";
import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { toast, ToastContainer } from "react-toastify";
import { Text, List } from "@mantine/core";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";

import Link from "next/link";

import ExportExcel from "../../helpers/ExportExcel";

import getConfig from "next/config";
import axios from "axios";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function AllTransaction() {
  const { publicRuntimeConfig } = getConfig();
  const [opened, { open, close }] = useDisclosure(false);

  const baseUrl = `${publicRuntimeConfig.apiUrl}`;

  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const [discountData, setDiscountData] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 1,
  });
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({}); //ts type available

  const [option, setOption] = useState({ createdAt: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isGiftingLoading, setIsGiftingLoading] = useState(false);

  const [error, setError] = useState("");
  const [selectDiscountId, setSelectedDiscountId] = useState("");

  useEffect(() => {
    getLogs(!globalFilter ? "" : globalFilter, option, currentPage);
  }, [
    globalFilter,
    option,
    pagination.pageIndex, //refetch when page index changes
    pagination.pageSize, //refetch when page size changes
  ]);

  useEffect(() => {
    subscriptionService
      .getAllDiscountCode({}, 1, "")
      .then((res) => {
        if (res.success) {
          setDiscountData(res.data?.docs);
        }
      })
      .catch((err) => {});
  }, []);

  const applyDiscountToSubscription = async () => {
    setIsGiftingLoading(true);

    const data = {
      discountId: selectDiscountId,
      subscriptionId: Object.keys(rowSelection),
    };

    try {
      const res = await subscriptionService.applyDiscountToSubscription(data);
      setRowSelection({});
      setSelectedDiscountId("");
      close();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setIsGiftingLoading(false);
    } catch (error) {
      setIsGiftingLoading(false);
      toast.error(error.message || "Failed to apply discount");
    }
  };
  const getLogs = (search, option, page) => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    userService
      .getAllPaidSubscriptions(search, option, page)
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setTotalPage(1);
          setRowCount(res.data.length);
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
        accessorKey: "packageName", // Access data directly with key
        header: "Package Name",
      },
      {
        accessorKey: "packageAmount", // Access data directly with key
        header: "Package Amount",
      },
      {
        accessorKey: "packageDuration", // Access data directly with key
        header: "Package Duration",
      },
    ],
    []
  );
  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    renderDetailPanel: ({ row }) => {
      return (
        <List type="ordered" withPadding>
          {row.original.discountCodes.map(e => <List.Item>{e.code}</List.Item>)}
        </List>
      );
    },
    mantineSearchTextInputProps: {
      placeholder: "Search by package name",
    },
    enableRowSelection: true,
    enableColumnFilters: false,
    initialState: { showColumnFilters: true, expanded: true },
    enableSorting: false,
    enableExpanding: true,
    enableExpandAll: true,
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    initialState: { showColumnFilters: true,  expanded: true },
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
        <title>Discount Subscription</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />

      <Modal
        opened={opened}
        onClose={() => {
          setSelectedDiscountId("");
          close();
        }}
        title="Discount Codes"
      >
        <Stack>
          {discountData.map((e, i) => (
            <Checkbox
              checked={e._id === selectDiscountId}
              key={i}
              onChange={() => {
                if (e._id === selectDiscountId) {
                  setSelectedDiscountId("");
                } else {
                  setSelectedDiscountId(e._id);
                }
              }}
              label={e.code}
            />
          ))}
        </Stack>
        <Button
          className="m-4"
          variant="filled"
          disabled={isGiftingLoading || !selectDiscountId}
          style={{ background: "indigo", margin: "10px", float: "right" }}
          onClick={applyDiscountToSubscription}
        >
          {isGiftingLoading ? "Loading" : "Apply discount code"}
        </Button>
      </Modal>

      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">Add Discount To Subscriptions</h1>
            <div className="btnLists manager">
              <ul>
                <li>
                  {Object.keys(rowSelection).length > 0 && (
                    <a
                      style={{ cursor: "pointer" }}
                      className="btn"
                      onClick={open}
                    >
                      Apply discount to selected subscription(s)
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
