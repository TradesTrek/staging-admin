/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../../components/Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { gameService } from "../../services/game.service";

export default function AddPriodicTimeGame({ addUserCloseModal, id }) {
  const { publicRuntimeConfig } = getConfig();
  const [priodicTime, setPriodicTime] = useState("1");
  const [updateLoader, setUpdateLoader] = useState(false);
  // Save value in state
  const addPriodicTime = async (userId) => {
    let response = await gameService.Add_PriodicTime(priodicTime, userId);
    addUserCloseModal();
  };
  return (
    <>
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
      <div className="form--inner">
        <div className="form--title">
          <h3>Add Priodic Time</h3>
        </div>

        <div className="user--form1">
          <div className="form--item">
            <label className="form--label" htmlFor="lockModel">
              Priodic Time*
            </label>
            <select
              className="form--control"
              onChange={(e) => setPriodicTime(e.target.value)}
            >
              <option value="1">Monthly</option>
              <option value="3">Quarterly</option>
              <option value="6">Half- Yearly</option>
              <option value="12"> Yearly</option>
            </select>
          </div>
        </div>
        <div className="form--actions">
          {updateLoader ? (
            <FormSpinner />
          ) : (
            <>
              <button className="addPriodicButton" onClick={() => addPriodicTime(id)}>Save</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
