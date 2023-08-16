import React from "react";

export const IncreaseDecrease = (change, changePer) => {
  return (
    <>
      {change < 0 ? (
        <td className="text-red">
          <div className="flexBox">
          ₦{change.toFixed(2)*-1} ({changePer.toFixed(2)*-1}%)
            <svg
              className="ml-12"
              width="16"
              height="17"
              viewBox="0 0 27 29"
              fill="none"
            >
              <path
                d="M13.6021 28.0854L14.462 27.2629L26.4263 15.2986L24.7064 13.5788L14.7985 23.4867L14.7985 0.081543H12.4056L12.4056 23.4867L2.4977 13.5788L0.777832 15.2986L12.7421 27.2629L13.6021 28.0854Z"
                fill="#F45531"
              ></path>
            </svg>
          </div>
        </td>
      ) : change == 0 ? (
        <td>
          <div className="flexBox ">
          ₦{change.toFixed(2)} ({changePer.toFixed(2)}%)
           -
          </div>
        </td>
      ) : (
        <td>
          <div className="flexBox text-light-green">
          ₦{change.toFixed(2)} ({changePer.toFixed(2)}%)
            <svg
              className="ml-12"
              width="16"
              height="17"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M9 0.445312L8.46094 0.960937L0.960938 8.46094L2.03906 9.53906L8.25 3.32812V18H9.75V3.32812L15.9609 9.53906L17.0391 8.46094L9.53906 0.960937L9 0.445312Z"
                fill="#008000"
              />
            </svg>
          </div>
        </td>
      )}
    </>
  );
};

export default IncreaseDecrease;
