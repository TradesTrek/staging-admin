import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";

import { Modal, Button, Input, Stack } from "@mantine/core";

import SideBar from "../../components/side-bar/SideBar";
import { userService } from "../../services";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

import { subscriptionService } from "../../services/subscription.service";
import { gameService } from "../../services/game.service";
import AddGame from "../../components/game/AddGame";
import EditGame from "../../components/game/EditGame";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import AddPriodicTimeGame from "../../components/game/AddPrioditTime";
import moment from "moment";
import FormSpinner from "../../components/Spinners/FormSpinner";
import { CSVLink } from "react-csv";
import ExportExcel from "../../helpers/ExportExcel";
import ExportPdf from "../../helpers/ExportPdf";
import { useDisclosure } from "@mantine/hooks";

const initialPointsData = {
  accountValuePointPerZeroOnePercent: 1,
  soldStockPoint: 1,
  uniqueStockPurchasePoint: 2,
  gameId: ''
}

export default function AllGames() {
  useEffect(() => {
    document.body.classList.remove("has--tabs");
  });

  const [opened, { open, close }] = useDisclosure(false);

  const [openedPointsModal, pointHandlers] = useDisclosure(false);

  const [tableAction, setTableAction] = useState(false);
  const [filterAction, setFilterAction] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [isUserToggle, setIsUserToggle] = useState();
  const [games, setGames] = useState();
  const [editUserForm, setEditUserForm] = useState(false);
  const [addPriodicForm, setAddPriodicForm] = useState(false);

  const [userData, setUserData] = useState("");
  const [allPage, setAllPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchgame, setSearchGame] = useState("");
  const [gameId, setGameId] = useState("");
  const [option, setOption] = useState({ createdAt: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [fileterOption, setFilterOption] = useState({});
  const [gameStatus, setGameStatus] = useState("All");
  const [gameCreatorType, setGameCreatorType] = useState("All");
  const [gameType, setGameType] = useState("All");
  const history = useRouter();
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [xlsxDownloading, setXlsxDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const allCompetitionRef = useRef();
  const [downloadCompetitionData, setDownloadCompetitionData] = useState([]);

  const [selectedCompetition, setSelectedCompetiton] = useState(null);
  const [isMessagingLoading, setIsMessagingLoading] = useState(false);
  const [updatePointsLoading, setUpdatePointsLoading] = useState(false);

  const [userPointsData, setUserPointsData] = useState(initialPointsData);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const competitionHeaders = [
    {
      label: "Competition Name",
      key: "competitionName",
    },
    { label: "Type", key: "competitionType" },
    { label: "Timing", key: "dateRange" },
    { label: "Entry Amount", key: "startingCash" },
    { label: "No Of Players", key: "userCount" },
    { label: "Creator", key: "username" },
    { label: "Created Date", key: "createdAt" },
  ];
  useEffect(() => {
    getAllGame(currentPage, searchgame, { option, fileterOption });
  }, [
    currentPage,
    addUserForm,
    editUserForm,
    searchgame,
    option,
    fileterOption,
  ]);
  const getAllGame = (page, search, body) => {
    setIsLoading(true);
    gameService
      .getAllGame(page, search, body)
      .then((res) => {
        if (res.success) {
          setGames(res.data);
          setAllPage(res.totalPage);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const addUserCloseModal = () => {
    setAddUserForm(false);
    setTableAction(false);
    getAllGame(currentPage, searchgame, { option, fileterOption });
  };

  const addPriodicCloseModal = () => {
    setAddPriodicForm(false);
    getAllGame(currentPage, searchgame, { option, fileterOption });
  };

  const editUserCloseModal = () => {
    setEditUserForm(false);
    setTableAction(false);

    setUserData("");
    getAllGame(currentPage, searchgame, { option, fileterOption });
  };

  const resetCompetition = async (gameId) => {
    let response = await gameService.resetGame(gameId);
    if (response.success) {
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getAllGame(currentPage, searchgame, { option, fileterOption });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const confirmResetCompetition = (gameId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => resetCompetition(gameId),
        },
        {
          label: "No",
        },
      ],
    });
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
  const confirmSetDefaulGame = (userId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => setDefaultGame(userId),
        },
        {
          label: "No",
        },
      ],
    });
  };
  // console.log(priodicTime)

  const deleteUser = async (userId) => {
    let response = await gameService.deleteGame(userId);
    if (response.success) {
      // if (!toast.isActive(toastId.current)) {
      //   toastId.current = toast.success(response.message, {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // }
      getAllGame(currentPage, searchgame, { option, fileterOption });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const setDefaultGame = async (userId) => {
    let response = await gameService.updateDefaultGame(userId);
    if (response.success) {
      // if (!toast.isActive(toastId.current)) {
      //   toastId.current = toast.success(response.message, {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // }
      getAllGame(currentPage, searchgame, { option, fileterOption });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const viewGame = (id) => {
    history.push({
      pathname: "game-rank",
      query: { gameId: id },
    });
  };
  const WinnerRank = (id) => {
    history.push({
      pathname: "winner-list",
      query: { gameId: id },
    });
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  const handleFilterSubmit = () => {
    setCurrentPage(1);
    let tempdata = {};
    if (gameStatus == "All") {
    } else {
      tempdata.status = gameStatus == "true" ? true : false;
    }
    if (gameType == "All") {
    } else {
      tempdata.competitionType = gameType;
    }
    if (gameCreatorType == "All") {
    } else {
      tempdata.creatorType = gameCreatorType;
    }

    setFilterOption(tempdata);
    setFilterAction(false);
  };
  const downloadCompetition = async (str) => {
    const { data } = await gameService.downloadAllCompetition(searchgame, {
      option,
      fileterOption,
    });
    setDownloadCompetitionData(data);
    if (str == "csv") {
      setTimeout(() => {
        allCompetitionRef.current.link.click();
        setCsvDownloading(false);
      }, 1000);
    } else if (str == "xlsx") {
      ExportExcel(competitionHeaders, data, "competition");
      setXlsxDownloading(false);
    } else if (str == "pdf") {
      ExportPdf(competitionHeaders, data, "competition");
      setPdfDownloading(false);
    }
  };

  const messageUsers = async () => {
    setIsMessagingLoading(true);
    const data = { title, message, competitionId: selectedCompetition };
    try {
      const res = await userService.notifyUsersInCompetition(data);

      setMessage("");
      setTitle("");
      setSelectedCompetiton(null);
      close();
      if (res.success) {
        toast.success(res.message);
      }
      setIsMessagingLoading(false);
    } catch (error) {
      setIsMessagingLoading(false);
      toast.error(e.message);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const updatePoints = async () => {
    try {
      const {
        accountValuePointPerZeroOnePercent,
        soldStockPoint,
        uniqueStockPurchasePoint,
        gameId
      } = userPointsData;

      if (
        isNaN(accountValuePointPerZeroOnePercent) ||
        isNaN(soldStockPoint) ||
        isNaN(uniqueStockPurchasePoint) || !gameId
      ) {
        toast.error("Ensure all field are correct before sumbission");
        return;
      }

      setUpdatePointsLoading(true)
      const response=  await gameService.updateGamePoints(userPointsData)
      if (response.success) {
        toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setUpdatePointsLoading(false);
        pointHandlers.close()

        const gameIndex = games.findIndex((game) => game._id === gameId);
        if (gameIndex !== -1) {
    
          const updatedGame = {
            ...games[gameIndex],
            accountValuePointPerZeroOnePercent,
            soldStockPoint,
            uniqueStockPurchasePoint,
          };
  
          // Create a new array with the updated game
          const updatedGamesArray = [...games];
          updatedGamesArray[gameIndex] = updatedGame;
  
          // Update the games state with the new array
          setGames(updatedGamesArray);
        }
      
        
      } else {
        setUpdatePointsLoading(false);
        toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    } catch (error) {
      setUpdatePointsLoading(false);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  };

  const handleInputChange = (field, value) => {
    // Validate input to ensure it's a number
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")); // Allow decimals

    setUserPointsData({
      ...userPointsData,
      [field]: isNaN(numericValue) ? "" : numericValue, // Set to '' if not a number
    });
  };

  return (
    <>
      <Head>
        <title>Game Lists</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBar />

      <Modal
        opened={opened}
        onClose={() => {
          setSelectedCompetiton(null);
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

      <Modal
        opened={openedPointsModal}
        onClose={() => {
          setUserPointsData(initialPointsData);
          pointHandlers.close();
        }}
        title="Update Points"
      >
        <Stack>
          <Input.Wrapper label="Account Value Point per 0.01%">
            <Input
              placeholder="Account Value Point per 0.01%"
              value={userPointsData.accountValuePointPerZeroOnePercent}
              onChange={(event) =>
                handleInputChange(
                  "accountValuePointPerZeroOnePercent",
                  event.target.value
                )
              }
              inputMode="numeric" // Use inputMode for mobile keyboard behavior
            />
          </Input.Wrapper>

          <Input.Wrapper label="Sold Stock Point">
            <Input
              placeholder="Sold Stock Point"
              value={userPointsData.soldStockPoint}
              onChange={(event) =>
                handleInputChange("soldStockPoint", event.target.value)
              }
              inputMode="numeric"
            />
          </Input.Wrapper>

          <Input.Wrapper label="Unique Stock Purchase Point">
            <Input
              placeholder="Unique Stock Purchase Point"
              value={userPointsData.uniqueStockPurchasePoint}
              onChange={(event) =>
                handleInputChange(
                  "uniqueStockPurchasePoint",
                  event.target.value
                )
              }
              inputMode="numeric"
            />
          </Input.Wrapper>
        </Stack>
        <Button
          className="m-4"
          variant="filled"
          disabled={
            updatePointsLoading ||
            isNaN(userPointsData.accountValuePointPerZeroOnePercent) ||
            isNaN(userPointsData.soldStockPoint) ||
            isNaN(userPointsData.uniqueStockPurchasePoint)
          }
          style={{ background: "indigo", margin: "10px", float: "right" }}
          onClick={updatePoints}
        >
          {updatePointsLoading ? "Loading" : "Update Points"}
        </Button>
      </Modal>

      <div className="dashboard sideBarOpen">
        <DashboardHeader />
        <div className="contentWrapper">
          <div className="dashboard_content">
            <h1 className="dashboard__title">All Competitions</h1>

            {/* Filter and search box */}

            <div
              className="btnLists manager"
              onClick={() => setTableAction(false)}
            >
              <ul>
                <li>
                  <form>
                    <input
                      type="text"
                      placeholder="Search by competition name..."
                      onChange={(e) => setSearchGame(e.target.value)}
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
                          downloadCompetition("csv");
                        }}
                      >
                        Export as CSV
                      </a>
                    </Link>
                  )}
                  <CSVLink
                    style={{ display: "none" }}
                    ref={allCompetitionRef}
                    headers={competitionHeaders}
                    data={downloadCompetitionData}
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
                          downloadCompetition("xlsx");
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
                          downloadCompetition("pdf");
                        }}
                      >
                        Export as PDF
                      </a>
                    </Link>
                  )}
                </li>
                <div className=" addButton1">
                  <span
                    className="filter--options"
                    onClick={() => setFilterAction(!filterAction)}
                  >
                    Filter
                  </span>

                  {/* <li
                    className="filter--options"
                    title="Filter"
                    onClick={() => setFilterAction(!filterAction)}
                  >
                    Filter
                  </li> */}
                </div>
              </ul>
              <div
                className="addButton"
                onClick={() => setAddUserForm(!addUserForm)}
              >
                <span>+</span> Add Competition
              </div>
            </div>
            {/* Filter Options Form */}
            <div
              onClick={() => setTableAction(false)}
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
              <form>
                <div className="form--item">
                  <label className="form--label">Competition Status</label>
                  <select
                    className="form--control"
                    value={gameStatus}
                    onChange={(e) => setGameStatus(e.target.value)}
                  >
                    <option value="All">All</option>

                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label">Competition Type</label>
                  <select
                    className="form--control"
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value)}
                  >
                    <option value="All">All</option>

                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label">
                    Competition Creator Type
                  </label>
                  <select
                    className="form--control"
                    value={gameCreatorType}
                    onChange={(e) => setGameCreatorType(e.target.value)}
                  >
                    <option value="All">All</option>

                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div onClick={handleFilterSubmit}>
                  <span
                    style={{
                      border: "1px solid #004577",
                      padding: "8px 23px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Submit
                  </span>
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
              {addUserForm && <AddGame addUserCloseModal={addUserCloseModal} />}
            </div>

            {/* add priodic  */}

            {addPriodicForm && <div className="layout--overlay--bg"></div>}
            <div
              className={
                addPriodicForm ? "form--layout form--active" : "form--layout"
              }
            >
              <div
                className="form__close"
                onClick={() => setAddPriodicForm(!addPriodicForm)}
              >
                X
              </div>
              {addPriodicForm && (
                <AddPriodicTimeGame
                  id={gameId}
                  addUserCloseModal={addPriodicCloseModal}
                />
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
                <EditGame
                  data={userData}
                  editUserCloseModal={editUserCloseModal}
                />
              )}
            </div>

            <div className="table--layout">
              {isLoading ? (
                <FormSpinner />
              ) : (
                <table>
                  <thead onClick={() => setTableAction(false)}>
                    <tr>
                      <th
                        style={{ width: "3rem" }}
                        className="sorting__disabled"
                      >
                        {/* <input type="checkbox" name="select--all" /> */}
                        Sr. No
                      </th>
                      <th
                        className={
                          option.competitionNames == 1
                            ? "desc"
                            : option.competitionName == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            competitionNames:
                              option.competitionNames == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Competition Name
                      </th>
                      <th
                        className={
                          option.competitionType == 1
                            ? "desc"
                            : option.competitionType == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            competitionType:
                              option.competitionType == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Type
                      </th>
                      <th
                        className={
                          option.startDate == 1
                            ? "desc"
                            : option.startDate == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            startDate: option.startDate == 1 ? -1 : 1,
                            endDate: option.endDate == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Timing
                      </th>
                      <th
                        className={
                          option.startingCash == 1
                            ? "desc"
                            : option.startingCash == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            startingCash: option.startingCash == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Entry Amount
                      </th>
                      <th
                        className={
                          option.userCount == 1
                            ? "desc"
                            : option.userCount == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            userCount: option.userCount == 1 ? -1 : 1,
                          });
                        }}
                      >
                        No of Players
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
                        Creator User
                      </th>
                      <th
                        className={
                          option.timePriod == 1
                            ? "desc"
                            : option.timePriod == -1
                            ? "asc"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOption({
                            timePriod: option.timePriod == 1 ? -1 : 1,
                          });
                        }}
                      >
                        Priodic Time
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

                      <th
                        style={{ width: "4rem" }}
                        className="sorting__disabled"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {games &&
                      games.length > 0 &&
                      games.map((item, i) => {
                        return (
                          <tr
                            key={i}
                            style={{
                              background: item?.isDefaultGame
                                ? "rgb(246 246 246)"
                                : item.status
                                ? "white"
                                : "rgb(248 239 239)",
                            }}
                          >
                            <td onClick={() => setTableAction(false)}>
                              {(currentPage - 1) * 10 + 1 + i}
                              {/* <input type="checkbox" /> */}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.competitionName}
                              <p style={{ fontSize: "11px", color: "#004577" }}>
                                {item?.isDefaultGame && "(Default Game)"}
                              </p>
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item.competitionType}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {" "}
                              {item?.dateRange.split(" ")[0]} -{" "}
                              {item?.dateRange.split(" ")[1] == "null"
                                ? "No End"
                                : item?.dateRange.split(" ")[1]}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {item?.startingCash?.toFixed(2)}
                            </td>

                            <td onClick={() => setTableAction(false)}>
                              {" "}
                              {item?.users?.length}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {" "}
                              {item?.username} ({item?.creatorType})
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {" "}
                              {item.timePriod
                                ? `${item?.timePriod} months`
                                : "Not Assigned"}
                            </td>
                            <td onClick={() => setTableAction(false)}>
                              {moment(item.createdAt).format("lll")}
                            </td>

                            {/* {(item?.users?.length==0 && item?.creatorType=='Admin') &&  */}
                            <td
                              onClick={() => {
                                setTableAction(!tableAction),
                                  setIsUserToggle(item._id);
                              }}
                              //         ref={notificationRef}
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
                                <span
                                  className="tableActions"
                                  key={isUserToggle}
                                >
                                  <Link href="javascript:void(0)">
                                    <a
                                      className="edit__detail"
                                      onClick={() => {
                                        setEditUserForm(true),
                                          setUserData(item);
                                      }}
                                    >
                                      Edit Competition
                                    </a>
                                  </Link>
                                  <Link href="javascript:void(0)">
                                    <a
                                      className="edit__detail"
                                      onClick={() => {
                                        confirmResetCompetition(item._id);
                                      }}
                                    >
                                      Reset competition
                                    </a>
                                  </Link>

                                  {item?.users?.length == 0 &&
                                    item?.creatorType == "Admin" && (
                                      <Link href="javascript:void(0)">
                                        <a
                                          className="delete__lock"
                                          onClick={() => {
                                            confirmDelete(item._id);
                                          }}
                                        >
                                          Delete Competition
                                        </a>
                                      </Link>
                                    )}
                                  {!item?.timePriod && (
                                    <Link href="javascript:void(0)">
                                      <a
                                        className="edit__detail"
                                        onClick={() => {
                                          // setPriodicTime('1')
                                          setAddPriodicForm(true),
                                            setGameId(item._id);
                                        }}
                                      >
                                        Add Priodic Time
                                      </a>
                                    </Link>
                                  )}
                                  {item.status && !item?.isDefaultGame && (
                                    <Link href="javascript:void(0)">
                                      <a
                                        className="view__lock"
                                        onClick={() => {
                                          confirmSetDefaulGame(item._id);
                                        }}
                                      >
                                        Set Default Game
                                      </a>
                                    </Link>
                                  )}

                                  <Link href="javascript:void(0)">
                                    <a
                                      className="view__lock"
                                      onClick={() => {
                                        viewGame(item._id);
                                      }}
                                    >
                                      View Rank
                                    </a>
                                  </Link>
                                  <Link href="javascript:void(0)">
                                    <a
                                      className=""
                                      onClick={() => {
                                        setSelectedCompetiton(item._id);
                                        open();
                                      }}
                                    >
                                      Notify users
                                    </a>
                                  </Link>
                                  <Link href="javascript:void(0)">
                                    <a
                                      className="edit__detail"
                                      onClick={() => {
                                        console.log(item)
                                        setUserData(item);
                                        const {
                                          soldStockPoint,
                                          uniqueStockPurchasePoint,
                                          accountValuePointPerZeroOnePercent,
                                          _id

                                        } = item;

                                        setUserPointsData({
                                          soldStockPoint,
                                          uniqueStockPurchasePoint,
                                          accountValuePointPerZeroOnePercent,
                                          gameId: _id

                                        });
                                        pointHandlers.open();
                                      }}
                                    >
                                      Edit Ranking points
                                    </a>
                                  </Link>
                                  {item?.timePriod && (
                                    <Link href="javascript:void(0)">
                                      <a
                                        className="view__lock"
                                        onClick={() => {
                                          WinnerRank(item._id);
                                        }}
                                      >
                                        Winner List
                                      </a>
                                    </Link>
                                  )}
                                </span>
                              ) : (
                                " "
                              )}
                            </div>
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
                pageCount={allPage}
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
