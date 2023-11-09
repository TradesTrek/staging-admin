import jsPDF from "jspdf";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { userService } from "../../services";
import FormSpinner from "../Spinners/FormSpinner";

const Portfolio = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [competition, setCompetition] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const portfolioRef = useRef();
  const [portfolioData, setPortfolioData] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [portofolioHeader, setPortfolioHeader] = useState([
    {
      label: "Rank",
      key: "rank",
    },
    { label: "Username", key: "userId.username" },
    { label: "Account Value", key: "accountValue" },
    { label: "Overall Naira Change", key: "annualReturn" },
    { label: "Overall Percent Change", key: "profitOrLossToday" },
  ]);
  useEffect(() => {
    if (router?.query?.id) {
      UserPortfolio(router?.query?.id);
      setUserId(router?.query?.id);
    }
  }, [router]);
  const UserPortfolio = (id) => {
    setIsLoading(true);
    userService
      .getUserPortfolio(id)
      .then((res) => {
        if (res.success) {
          setUser(res.data.user);
          setCompetition(res.data.competition);
        } else {
          setUser([]);
          setCompetition([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setUser([]);
        setCompetition([]);
        setIsLoading(false);
      });
  };

  const DownloadUserPortfolio = (id) => {
    userService
      .downloadUserPortfolio(id)
      .then((res) => {
        setLoadingPortfolio(true);
        const { data } = res;
        setPortfolioData(data);
        setTimeout(() => {
          portfolioRef.current.link.click();
          setLoadingPortfolio(false);
        }, 2000);
      })
      .catch((err) => setLoadingPortfolio(false));
  };
  function convert() {
    var doc = new jsPDF();
    var imgData =
      "data:image/jpeg;base64," + Base64.encode("/images/manager.png");
    console.log(imgData);
    doc.setFontSize(40);
    doc.text(30, 20, "Hello world!");
    doc.addImage(imgData, "JPEG", 15, 40, 180, 160);
    doc.output("datauri");
  }
  return (
    <div className="table--layout">
      {user && (
        <div>
          <div className="profileImage">
            <img
              src={
                user?.filePath
                  ? `${user?.baseUrl}${user?.filePath}`
                  : "/images/manager.png"
              }
            />
          </div>
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{`${user?.firstName} ${user?.lastName}`}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <td>Username</td>
                <td>{user?.username}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{user?.phone}</td>
              </tr>
              <tr>
                <td>Subscription Expiry Date</td>
                <td>
                  {user?.subscriptionDuration === "free-lifetime"
                    ? "free-lifetime"
                    : moment(user?.currentSubscriptionExpiryDate).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <hr />
      <div
        className="btnLists"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px 0px",
        }}
      >
        <ul>
          <li style={{ marginRight: "20px" }}>
            {loadingPortfolio ? (
              <Link href="javascript:void(0)">
                <a className="btn spinnerBtn">
                  <FormSpinner />
                </a>
              </Link>
            ) : (
              <Link href="javascript:void(0)">
                <a
                  className="btn"
                  onClick={() => DownloadUserPortfolio(userId)}
                >
                  Download Portfolio
                </a>
              </Link>
            )}
            <CSVLink
              style={{ display: "none" }}
              ref={portfolioRef}
              headers={portofolioHeader}
              data={portfolioData}
            >
              Download me
            </CSVLink>
          </li>

          {/* <li>
                  <form>
                    <input type="text" placeholder="Search by User Name..." />
                  </form>
                </li> */}
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          // marginTop: "50px",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {competition?.length > 0 &&
          competition?.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  border: "1px solid #e4e7eb",
                  borderRadius: "5px",
                  // boxShadow: "0 5px 5px rgb(0 0 0 / 13%)",
                  width: "30%",
                  margin: "10px",
                  height: "320px",
                  padding: "20px 20px",
                }}
              >
                <h1 style={{ textAlign: "center", color: "#99a5b5" }}>
                  {item?.gameId?.competitionName}
                </h1>
                <hr />

                <table>
                  <tbody>
                    <tr>
                      <th>Account Value</th>
                      <th>
                        ₦{" "}
                        {item.accountValue
                          ?.toFixed(2)
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </th>
                    </tr>
                    <tr>
                      <th>Buying Power</th>
                      <th>
                        ₦{" "}
                        {item.buyingPower
                          ?.toFixed(2)
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </th>
                    </tr>
                    <tr>
                      <th>Cash</th>
                      <th>
                        ₦{" "}
                        {item.cash
                          ?.toFixed(2)
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </th>
                    </tr>
                    <tr>
                      <th>Annual Return</th>
                      <th>
                        ₦{" "}
                        {item.annualReturn
                          ?.toFixed(2)
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </th>
                    </tr>
                    <tr>
                      <th>Join Date</th>
                      <th>
                        {moment(item?.currentSubscriptionExpiryDate).format("MMMM Do YYYY")}
                      </th>
                    </tr>
                    <tr>
                      <th>Game Expire Date</th>
                      <th>
                        {item?.gameId?.endDate
                          ? moment(item?.gameId?.endDate).format("MMMM Do YYYY")
                          : "No End"}
                      </th>
                    </tr>
                  </tbody>
                </table>
                <div style={{ margin: "10px auto", textAlign: "center" }}>
                  <Link
                    href={`user-trade-history?id=${userId}&gameId=${item?.gameId?._id}`}
                  >
                    <a
                      style={{
                        padding: "10px 10px",
                        background: "blue",
                        borderRadius: "5px",
                        color: "white",
                      }}
                    >
                      View Trade History
                    </a>
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Portfolio;
