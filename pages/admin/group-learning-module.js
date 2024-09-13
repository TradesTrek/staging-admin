import React, { Fragment, useEffect, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import SideBar from "../../components/side-bar/SideBar";
import Head from "next/head";
import FormSpinner from "../../components/Spinners/FormSpinner";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { learningService } from "../../services/learning.service";

import {
  TextInput,
  Button,
  Card,
  Text,
  Select,
  Modal,
  NumberInput,
} from "@mantine/core";

export default function GroupManagement() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await learningService.getLearningModuleGroups();
      setGroups(response);
    } catch (error) {
      toast.error("Failed to fetch groups", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    createGroup(data);
  };

  const createGroup = async (data) => {
    setIsLoading(true);
    try {
      const response = await learningService.createLearningModuleGroup({
        name: data.groupName,
      });
      if (response.success) {
        toast.success("Group created successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        reset({ groupName: "" });
        fetchGroups();
      } else {
        toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Failed to create group", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (group) => {
    setGroupToDelete(group);
    setDeleteModalOpen(true);
  };

  const deleteGroup = async () => {
    if (!groupToDelete) return;
    setIsLoading(true);
    try {
      const response = await learningService.deleteLearningModuleGroup(
        groupToDelete._id
      );
      if (response.success) {
        toast.success(
          "Group and associated learning modules deleted successfully",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        fetchGroups();
      } else {
        toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Failed to delete group", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

  return (
    <>
      <Head>
        <title>Group Management</title>
        <meta
          name="description"
          content="Group Management for Learning Modules"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Fragment>
        <SideBar />
        <div className="dashboard sideBarOpen">
          <DashboardHeader />
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
          <div className="contentWrapper centerForm">
            <div className="dashboard_content">
              <h1 className="dashboard__title">Group Management</h1>
              <div className="center--block">
                <div className="small--block">
                  <div className="site--form">
                    <form
                      className="site--form"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="form--item">
                        <label className="form--label" htmlFor="groupName">
                          Group Name
                        </label>
                        <div
                          className={`form--group ${
                            errors.groupName ? "is-invalid" : ""
                          }`}
                        >
                          <input
                            type="text"
                            className="withIcon"
                            id="groupName"
                            placeholder="Enter group name"
                            {...register("groupName", {
                              required: true,
                              minLength: 2,
                              maxLength: 50,
                            })}
                          />
                        </div>
                        <div className="invalid-feedback">
                          {errors.groupName?.type === "required" &&
                            "Group name is required"}
                          {errors.groupName?.type === "minLength" &&
                            "Group name should be at least 2 characters"}
                          {errors.groupName?.type === "maxLength" &&
                            "Group name should be less than 50 characters"}
                        </div>
                      </div>

                      <div className="btnBlue fullW mt-6">
                        <Button className="btn btnBgBlue" type="submit">
                          Create Group
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="mt-8" style={{marginTop: '20px'}}>
                <div className="container" style={{
                  width: '40%',
                  margin: '0 auto'
                }}>
                  <h2 className="text-xl font-semibold m-4">Existing Groups</h2>
                  {groups.map((group) => (
                    <div
                      style={{ display: "flex", margin: 20 }}
                      key={group._id}
                      // style={{ justifyContent: 'space-between'}}
                      className="border p-4 rounded mb-4 flex  items-center"
                    >
                      <h3 className="text-lg">{group.name}</h3>
                      <Button
                        style={{ background: "red" }}
                        onClick={() => confirmDelete(group)}
                        className="btn btnBgRed"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>

      {deleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the group "{groupToDelete?.name}"?
              This will also delete all associated learning modules.
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setDeleteModalOpen(false)}
                className="btn btnBgGray mr-2"
              >
                Cancel
              </Button>
              <Button onClick={deleteGroup} className="btn btnBgRed">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <FormSpinner />}
    </>
  );
}
