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
export default function EditHoliday(props) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const intialValues = {
    holidayName: "",
    holidayDate: "",
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let upDateState = {
      holidayName: props?.data?.holidayName,
      holidayDate: props?.data?.holidayDate,
      holidayMessage: props?.data?.holidayMessage,
    };
    setFormValues(upDateState);
  }, [props]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitEditForm();
    }
  }, [formErrors]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  const submitEditForm = async () => {
    setUpdateLoader(true);
    const data = {
      holidayName: formValues?.holidayName,
      holidayDate: formValues?.holidayDate,
      holidayMessage: formValues?.holidayMessage,
    };

    // var form_data = new FormData();
    // for (let key in data) {
    //   form_data.append(key, data[key]);
    // }
    // const userId = props?.data?._id;
    data._id = props?.data?._id;
    const response = await userService.updateHoliday(data);
    if (response.success) {
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setUpdateLoader(false);
      setIsSubmitting(false);
      props.editUserCloseModal();
    } else {
      setUpdateLoader(false);
      setIsSubmitting(false);
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  // Save value in state
  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      if (name == "holidayName" && (value.length == null || value == "")) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors({
          ...formErrors,
          [name]: "Holiday name is required.",
        });
      } else if (name == "holidayName" && value.length <= 20) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        setFormErrors({ ...formErrors, [name]: "" });
      }
      if (name == "holidayMessage" && value.length <= 50) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        
        setFormErrors({ ...formErrors, [name]: "" });
      } 
    } else {
      setFormValues({
        ...formValues,
        holidayDate: moment(e).format("YYYY-MM-DD"),
      });
      setFormErrors({ ...formErrors, holidayDate: "" });
    }
  };

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.holidayName) {
      errors.holidayName = "Holiday name is required";
    } else if (values.holidayName.length > 20) {
      errors.holidayName = "Holiday Name is maximum 20 characters.";
    }
    if (!values.holidayDate) {
      errors.holidayDate = "Holiday Date is required";
    }
    if (!values.holidayMessage) {
      errors.holidayMessage = "Holiday Day message is required";
    } else if (values.holidayMessage > 50) {
      errors.holidayMessage = "Holiday Message Name is maximum 20 characters.";
    }

    return errors;
  };
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
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
          <h3>Edit Holiday</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Holiday Name*
              </label>
              <input
                type="text"
                name="holidayName"
                value={formValues.holidayName}
                className={`form--control ${
                  formErrors.holidayName ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.holidayName}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Holiday Date*
              </label>
              <ReactDatePicker
                name="holidayDate"
                value={formValues.holidayDate}
                onChange={handleChange}
                className={`form--control ${
                  formErrors.holidayDate ? "is-invalid" : ""
                }`}
                minDate={new Date()}
                filterDate={isWeekday}
                placeholderText="Select a weekday"
              />
              {/* <input
                type="date"
                name="holidayDate"
                value={formValues.holidayDate}
                className={`form--control ${
                  formErrors.holidayDate ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                min={NigerianCurrentTimeZone()}
              /> */}
              <div className="invalid-feedback">{formErrors.holidayDate}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Holiday Message*
              </label>
              <input
                type="text"
                name="holidayMessage"
                value={formValues.holidayMessage}
                className={`form--control ${
                  formErrors.holidayMessage ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                {formErrors.holidayMessage}
              </div>
            </div>
            <div className="form--actions">
              {updateLoader ? (
                <FormSpinner />
              ) : (
                <>
                  <input
                    type="submit"
                    className="form--submit"
                    value="Update"
                  />
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
