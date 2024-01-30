import Head from "next/head";
import { Checkbox, Stack } from "@mantine/core";

import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Input } from "@mantine/core";

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
  const [isMessagingLoading, setIsMessagingLoading] = useState(false);

  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectSubscriptionId, setSelectedSubscriptionId] = useState("");

  useEffect(() => {
    getUsers(!globalFilter ? "" : globalFilter, option, currentPage);
  }, [
    globalFilter,
    option,
    pagination.pageIndex, //refetch when page index changes
    pagination.pageSize, //refetch when page size changes
  ]);

  const messageUsers = async () => {
    setIsMessagingLoading(true);
    const emails = Object.keys(rowSelection);
    const data = { title, message, emails };
    try {
      const res = await userService.notifyUsers(data);
      console.log(res)
      // setRowSelection({});
      // handleTitleChange("")
      //  handleMessageChange("");
      close();
      if (res.success) {
        toast.success(res.message);
      }
      setIsMessagingLoading(false);
    } catch (error) {
      console.log(error);
      setIsMessagingLoading(false);
      toast.error("Failed to message selected users");
    }
  };
  const getUsers = (search, option, page) => {
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
    getUsers(!globalFilter ? "" : globalFilter, option, selected + 1);
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Notify users</title>
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
        title="Message"
      >
        <Stack>
          <Input
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />

          <Input
            placeholder="Message"
            value={message}
            onChange={handleMessageChange}
          />
        </Stack>
        <Button
          className="m-4"
          variant="filled"
          disabled={
            isMessagingLoading || title.trim() === "" || message.trim() === ""
          }
          style={{ background: "indigo", margin: "10px", float: "right" }}
          onClick={messageUsers}
        >
          {isMessagingLoading ? "Loading" : "Send message"}
        </Button>
      </Modal>

      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">Notify users</h1>
            <div className="btnLists manager">
              <ul>
                <li>
                  {Object.keys(rowSelection).length > 0 && (
                    <a
                      style={{ cursor: "pointer" }}
                      className="btn"
                      onClick={open}
                    >
                      Send a message
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
