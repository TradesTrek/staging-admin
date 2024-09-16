import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import AddHoliday from "../../components/quiz/AddLearning";
import EditHoliday from "../../components/quiz/EditLearning";
import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import FormSpinner from "../../components/Spinners/FormSpinner";
import { learningService } from "../../services/learning.service";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const DynamicEditor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const buttonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background-color 0.3s, transform 0.1s",
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging
    ? "linear-gradient(45deg, #e6f7ff, #bae7ff)"
    : "linear-gradient(45deg, #f0f5ff, #e6f7ff)",
  color: "#1a3a5f",
  borderRadius: "4px",
  boxShadow: isDragging
    ? "0 4px 8px rgba(0,0,0,0.1)"
    : "0 1px 3px rgba(0,0,0,0.05)",
  transition: "background 0.2s ease, box-shadow 0.2s ease",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver
    ? "linear-gradient(to right, #f0f5ff, #e6f7ff)"
    : "#ffffff",
  padding: grid,
  width: 400,
  borderRadius: "8px",
  boxShadow: "0 0 20px rgba(0,0,0,0.05)",
  border: "1px solid #e8e8e8",
});

const Learn = ({ learningModules, toggleEditForm }) => {
  const [items, setItems] = useState(learningModules);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectItem, setSelectItem] = useState({});
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    if (selectItem && selectItem.content) {
      try {
        const contentState = convertFromRaw(JSON.parse(selectItem.content));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error parsing content:", error);
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [selectItem]);

  const reorderModules = async (groupId, sourceIndex, destinationIndex) => {
    try {
      const response = await learningService.reorderLearningModules({
        group: groupId,
        sourceIndex,
        destinationIndex
      });
      if (response.success) {
        setItems(prevItems => {
          const newItems = [...prevItems];
          const groupIndex = newItems.findIndex(item => item.group._id === groupId);
          if (groupIndex !== -1) {
            newItems[groupIndex].modules = response.data;
          }
          return newItems;
        });
        toast.success("Modules reordered successfully");
      } else {
        toast.error("Failed to reorder modules");
      }
      setIsReordering(false);
    } catch (error) {
      setIsReordering(false);
      toast.error("An error occurred while reordering modules");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      setIsReordering(true);
      // Reordering within the same group
      const groupId = source.droppableId;
      reorderModules(groupId, source.index, destination.index);
    } else {
      // Moving between groups is not implemented in this version
      toast.warning("Moving modules between groups is not supported currently");
    }
  };

  const handleView = (item) => {
    setSelectItem(item);
    open();
  };

  const handleEdit = (item) => {
    toggleEditForm(item);
  };

  const handleDelete = async (id) => {
    let response = await learningService.deleteLearningModule(id);
    if (response.success) {
      const newItems = items.map((group) => ({
        ...group,
        modules: group.modules.filter((item) => item._id !== id),
      }));
      setItems(newItems);
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleToggleDisable = async (id) => {
    try {
      await learningService.toggleLearningModuleAbility(id);
      const newItems = items.map((group) => ({
        ...group,
        modules: group.modules.map((item) =>
          item._id === id ? { ...item, disabled: !item.disabled } : item
        ),
      }));
      setItems(newItems);
      toast.info(
        `Item ${
          newItems
            .find((group) => group.modules.find((item) => item._id === id))
            .modules.find((item) => item._id === id).disabled
            ? "disabled"
            : "enabled"
        }`
      );
    } catch (error) {
      toast.error(`Failed to toggle item status`);
    }
  };

  const confirmDelete = (userId) => {
    confirmAlert({
      title: "Confirm deletion",
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily:
          "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        color: "#333",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {isReordering && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <p>Reordering modules...</p>
            {/* You can add a spinner or loading animation here */}
          </div>
        </div>
      )}

      <Modal opened={opened} fullScreen onClose={close} title={selectItem.name}>
        <h1 style={{ fontWeight: 900 }}>Reading Section</h1>
        <br />
        {typeof window !== "undefined" && (
          <DynamicEditor
            editorState={editorState}
            readOnly={true}
            toolbarHidden
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
          />
        )}
        <br />
        <h1 style={{ fontWeight: 900 }}>Questions</h1>
        <br />
        <QuizComponent selectItem={selectItem} />
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        {items.map((group) => (
          <div key={group.group._id} style={{ marginBottom: "30px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              {group.group.name} 
            </h2>
            <Droppable droppableId={group.group._id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {group.modules.map((item, index) => (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                      isDragDisabled={isReordering}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {item.name}  
                          </div>
                          <br/>
                          <p className="text-sm text-gray-600">Order: {item.order}</p>
                          
                          <br/>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "8px",
                              paddingTop: "10px",
                            }}
                          >
                            <button
                              onClick={() => handleView(item)}
                              style={{
                                ...buttonStyle,
                                backgroundColor: "#4CAF50",
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              style={{
                                ...buttonStyle,
                                backgroundColor: "#2196F3",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(item._id)}
                              style={{
                                ...buttonStyle,
                                backgroundColor: "#F44336",
                              }}
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleToggleDisable(item._id)}
                              style={{
                                ...buttonStyle,
                                backgroundColor: item.disabled
                                  ? "#9E9E9E"
                                  : "#FF9800",
                              }}
                            >
                              {item.disabled ? "Enable" : "Disable"}
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default function LearningQuiz() {
  const [tableAction, setTableAction] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [editUserForm, setEditUserForm] = useState(false);
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [learningModules, setLearningModules] = useState([]);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });

  const getLearningModules = () => {
    setIsLoading(true);
    learningService
      .GetLearningModule()
      .then((res) => {
        if (res.success) {
          setLearningModules(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getLearningModules();
  }, []);

  const addUserCloseModal = (refresh) => {
    setAddUserForm(false);
    if (refresh) getLearningModules();
  };

  const editUserCloseModal = () => {
    setEditUserForm(false);
    setEditFormData({});
    getLearningModules();
  };

  const confirmDelete = (userId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteUser(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const deleteUser = async (userId) => {
    let response = await userService.deleteHoliday(userId);
    if (response.success) {
      // if (!toast.isActive(toastId.current)) {
      //   toastId.current = toast.success(response.message, {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // }
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const toggleEditForm = (editFormData) => {
    setEditUserForm(!editUserForm);
    setEditFormData(editFormData);
  };

  const closeEditForm = () => {
    setEditUserForm(false);
    setEditFormData({});
    getLearningModules();
  };

  return (
    <>
      <Head>
        <title>Add Learning Module</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />
      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <div onClick={() => setTableAction(false)} className="btnLists">
              <ul>
                <li>
                  <Link href="javascript:void(0)">
                    <a
                      className="add__lock"
                      onClick={() => setAddUserForm(!addUserForm)}
                    >
                      Add New Learning Module
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Filter Options Form */}

            {/* Add Lock Form */}

            <div
              className={
                addUserForm
                  ? "form--layout form--active overflow-auto"
                  : "form--layout"
              }
            >
              <div
                className="form__close"
                onClick={() => setAddUserForm(!addUserForm)}
              >
                X
              </div>
              {addUserForm && (
                <AddHoliday addUserCloseModal={addUserCloseModal} />
              )}
            </div>

            {/* Edit lock Form ........ */}
            {/* edit page ..............  */}
            {editUserForm && <div className="layout--overlay--bg"></div>}
            <div
              className={
                editUserForm
                  ? "form--layout form--active overflow-auto"
                  : "form--layout"
              }
            >
              <div
                className="form__close"
                onClick={() => setEditUserForm(!editUserForm)}
              >
                X
              </div>
              {editUserForm && (
                <EditHoliday
                  editFormData={editFormData}
                  closeEditForm={closeEditForm}
                />
              )}
            </div>

            <div className="table--layout">
              {isLoading ? (
                <FormSpinner />
              ) : (
                <Learn
                  toggleEditForm={toggleEditForm}
                  learningModules={learningModules}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const QuizComponent = ({ selectItem }) => {
  return (
    <div>
      {selectItem?.questions &&
        selectItem.questions.map((question, index) => (
          <div key={question._id} className="mb-4">
            <p
              className="font-semibold"
              style={{ fontWeight: 900, color: "black" }}
            >{`${index + 1}. ${question.text}`}</p>
            <ul className="list-disc pl-6 mt-2" style={{ paddingLeft: "20px" }}>
              {question.options.map((option, i) => (
                <li
                  style={{ margin: 5 }}
                  key={i}
                  className={`${
                    i === question.correctOption ? "text-green" : ""
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};
