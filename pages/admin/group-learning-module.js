import React, { Fragment, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { learningService } from "../../services/learning.service";
import DashboardHeader from "../../components/header/DashboardHeader";
import SideBar from "../../components/side-bar/SideBar";
import FormSpinner from "../../components/Spinners/FormSpinner";

import {
  TextInput,
  Button,
  Card,
  Text,
  Modal,
  Loader
} from "@mantine/core";

export default function GroupManagement() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

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
      setGroups(response.data);
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
        description: data.description,
      });
      if(response.success){
        toast.success("Group created successfully",{
          position: toast.POSITION.TOP_RIGHT,
        } );
        reset({ groupName: "", description: "" });
        fetchGroups();
        return
      }
 
      toast.error(response.message,  {
        position: toast.POSITION.TOP_RIGHT,
      })
      
    } catch (error) {
      toast.error("Failed to create group", {
        position: toast.POSITION.TOP_RIGHT,
      } );
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
        toast.success("Group deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    setIsReordering(true);
    const newGroups = Array.from(groups);
    const [reorderedItem] = newGroups.splice(result.source.index, 1);
    newGroups.splice(result.destination.index, 0, reorderedItem);

    try {
     const response = await learningService.reorderLearningModuleGroups({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      });

      if(response.success){
        setGroups(response.data)
    
        toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        } );
      }
      
    } catch (error) {
      toast.error("Failed to reorder groups", {
        position: toast.POSITION.TOP_RIGHT,
      }); // Refetch to ensure frontend is in sync with backend
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <>
      <Head>
        <title>Group Learning </title>
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
                          <TextInput
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

                      <div className="form--item">
                        <label className="form--label" htmlFor="description">
                          Description (optional)
                        </label>
                        <div className="form--group">
                          <TextInput
                            id="description"
                            placeholder="Enter group description"
                            {...register("description")}
                          />
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
                  margin: '0 auto',
                  position: 'relative'
                }}>
                  <h2 className="text-xl font-semibold m-4">Existing Groups</h2>

                  {isReordering && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1000
                    }}>
                      <Loader size="xl" color="blue" />
                      <Text size="xl" style={{ marginLeft: '10px' }}>Reordering...</Text>
                    </div>
                  )}

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="groups">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {groups.map((group, index) => (
                            <Draggable key={group._id} draggableId={group._id} index={index}  isDragDisabled={isReordering}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    margin: "10px 0",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    background: "white"
                                  }}
                                >
                                  <div>
                                    <h3 className="text-lg">{group.name}</h3>
                                    {group.description && (
                                      <p className="text-sm text-gray-600">{group.description}</p>
                                    )}
                                     <p className="text-sm text-gray-600">Order: {group.order}</p>
                                  </div>
                                  <Button
                                    disabled
                                    style={{ background: "red" }}
                                    onClick={() => confirmDelete(group)}
                                    className="btn btnBgRed"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>

      {isLoading && <FormSpinner />}
      
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
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
      </Modal>

      {isLoading && <FormSpinner />}
    </>
  );
}