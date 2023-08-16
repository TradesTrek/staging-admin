/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import NigerianCurrentTimeZone from "../../helpers/NegerianCurrentTime";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

export default function AddLearning({ addUserCloseModal }) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const [video, setVideo] = useState();
  const [title,setTitle]=useState('');
  const [category,setCategory]=useState('');
  const [description,setDescription]=useState('')
  const intialValues = {
    holidayName: "",
    holidayDate: "",
  };
  const handleChange = (e) => {
    if (e.target.files[0]) {
      var vid = document.createElement("video");

      var fileURL = URL.createObjectURL(e.target.files[0]);
      setVideo(fileURL);
      vid.src = fileURL;
      // vid.ondurationchange = function () {
      //   alert(this.duration);
      // };
    }
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
          <h3>Add Content</h3>
        </div>
         <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Holiday Name*
              </label>
              <input
                type="text"
                name="holidayName"
                // value={formValues.holidayName}
                // className={`form--control ${
                //   formErrors.holidayName ? "is-invalid" : ""
                // }`}
                onChange={handleChange}
              />
              {/* <div className="invalid-feedback">{formErrors.holidayName}</div> */}
            </div>
            
        {!video && (
          <div className="user--form">
            <label htmlFor="file">
              <img src="/images/video.png" />
            </label>
            <input
              id="file"
              type="file"
              placeholder="click"
              onChange={handleChange}
            />
          </div>
        )}
        {video && (
          <video width="200" controls>
            <source src={video} type="video/mp4" />
            <source src={video} type="video/ogg" />
          </video>
        )}
      </div>
    </>
  );
}
