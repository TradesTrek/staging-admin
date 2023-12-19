import Head from "next/head";
import { Checkbox, Stack } from "@mantine/core";

import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { toast, ToastContainer } from "react-toastify";

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

  const [subscriptionData, setSubscriptionData] = useState([]);

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
  const [selectSubscriptionId, setSelectedSubscriptionId] = useState("");

  useEffect(() => {
    getLogs(!globalFilter ? "" : globalFilter, option, currentPage);
  }, [
    globalFilter,
    option,
    pagination.pageIndex, //refetch when page index changes
    pagination.pageSize, //refetch when page size changes
  ]);

  useEffect(() => {
    userService
      .getGiftableSubscription()
      .then((res) => {
        if (res.success) {
          setSubscriptionData(res.data);
        }
      })
      .catch((err) => {});
  }, []);

  const giftUsers = async () => {
    setIsGiftingLoading(true);
    const emails = Object.keys(rowSelection);
    const data = { subscriptionId: selectSubscriptionId, emails };
    try {
      const res = await userService.giftUsers(data);
      setRowSelection({});
      setSelectedSubscriptionId("");
      close();
      if (res.success) {
        toast.success(res.message);
      }
      setIsGiftingLoading(false);
    } catch (error) {
      setIsGiftingLoading(false);
      toast.error("Failed to gift users");
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
        accessorKey: "firstName", // Access data directly with key
        header: "First Name",
      },
      {
        accessorKey: "lastName", // Access data directly with key
        header: "Last Name",
      },
      {
        accessorKey: "email", // Access data directly with key
        header: "Email",
      },
      {
        accessorKey: "username", // Access data directly with key
        header: "Username",
      },
    ],
    []
  );
  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    mantineSearchTextInputProps: {
      placeholder: "Search by username or email",
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
        <title>All Request Transaction</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />

      <Modal
        opened={opened}
        onClose={() => {
          setSelectedSubscriptionId("");
          close();
        }}
        title="Subscriptions"
      >
        <Stack>
          {subscriptionData.map((e, i) => (
            <Checkbox
              checked={e._id === selectSubscriptionId}
              key={i}
              onChange={() => {
                if (e._id === selectSubscriptionId) {
                  setSelectedSubscriptionId("");
                } else {
                  setSelectedSubscriptionId(e._id);
                }
              }}
              label={e.packageName}
            />
          ))}
        </Stack>
        <Button
          className="m-4"
          variant="filled"
          disabled={isGiftingLoading || !selectSubscriptionId}
          style={{ background: "indigo", margin: "10px", float: "right" }}
          onClick={giftUsers}
        >
          {isGiftingLoading ? "Loading" : "Gift selected users"}
        </Button>
      </Modal>

      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">Gift users</h1>
            <div className="btnLists manager">
              <ul>
                <li>
                  {Object.keys(rowSelection).length > 0 && (
                    <a
                      style={{ cursor: "pointer" }}
                      className="btn"
                      onClick={open}
                    >
                      Select a gitfable subscription
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
