import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { userService } from "../../services";

const UserSubscription = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [subscription, setSubscription] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const portfolioRef = useRef();
  const [portfolioData,setPortfolioData]=useState([])
  const [loadingPortfolio,setLoadingPortfolio]=useState(false)
 
  useEffect(() => {
    if (router?.query?.id) {
      UserPortfolio(router?.query?.id);
      setUserId(router?.query?.id);
     
    }
  }, [router]);
  const UserPortfolio = (id) => {
    setIsLoading(true);
    userService
      .getSingleUserSubscription(id)
      .then((res) => {
        if (res.success) {
          setSubscription(res.data);
        } else {
      
          setSubscription([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
     
        setSubscription([]);
        setIsLoading(false);
      });
  };


console.log(subscription)
  return (
    <div className="table--layout">
     
      <div
        style={{
          display: "flex",
          // marginTop: "50px",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        
        {subscription.length > 0 ?
          subscription?.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  border:'1px solid #e4e7eb',
                  borderRadius:'5px',
                  // boxShadow: "0 5px 5px rgb(0 0 0 / 13%)",
                  width: "30%",
                  margin: "10px",
                  height: "320px",
                  padding: "20px 20px",
                }}
              >
                <h1 style={{ textAlign: "center",color:"#99a5b5" }}>
                  {item?.result?.packageName} 
                </h1>
                
                <hr />
               

               <p>Duration :- <span>{item?.result?.packageDuration}</span></p>
               <p>Desc :- <span>{item?.result?.packageDesc}</span></p>
               <p>Amount :- <span>{item?.result?.packageAmount}</span></p>
               <p>Activate Date :- {moment(item.createdAt).format('lll')}</p>
               <p>Expired Date :- {moment(item.expireDate).format('lll')}</p>



              </div>
            );
          }):<h1 style={{margin:'30px 0px'}}>No Subscription</h1>}
      </div>
    </div>
  );
};

export default UserSubscription;
