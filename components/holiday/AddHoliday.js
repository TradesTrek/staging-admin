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

export default function AddHoliday({ addUserCloseModal }) {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
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

    // console.log(data);
    // var form_data = new FormData();
    // for (let key in data) {
    //   form_data.append(key, data[key]);
    // }

    const response = await userService.addHoliday(data);
    if (response.success) {
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      addUserCloseModal();
      setUpdateLoader(false);
      setIsSubmitting(false);
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
      if (name == "holidayName" && value.length <= 20) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        setFormErrors({ ...formErrors, [name]: "" });
      } else if (name == "holidayName") {
        setFormErrors({
          ...formErrors,
          [name]: "Holiday Name is maximum 20 characters.",
        });
      }
      if (name == "holidayMessage" && value.length <= 50) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        setFormErrors({ ...formErrors, [name]: "" });
      } else if (name == "holidayMessage") {
        setFormErrors({
          ...formErrors,
          [name]: "Holiday Message  is maximum 50 characters.",
        });
      }
    } else {
      setFormValues({
        ...formValues,
        holidayDate: moment(e).format("YYYY-MM-DD"),
      });
      setFormErrors(validate(formValues));
      setFormErrors({ ...formErrors, holidayDate: "" });
    }
  };

  //   useEffect(()=>{
  //           isSubmitting &&   setFormErrors(validate(formValues));
  //   },[formValues,isSubmitting])

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.holidayName) {
      errors.holidayName = "Holiday name is required.";
    } else if (values.holidayName.length > 20) {
      errors.holidayName = "Holiday Name is maximum 20 characters.";
    }
    if (!values.holidayDate) {
      errors.holidayDate = "Holiday day is required";
    }
    if (!values.holidayMessage) {
      errors.holidayMessage = "Holiday day message is required";
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
          <h3>Add Holiday</h3>
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
                // selected={formValues.holidayDate}
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
              <textarea
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
                  <input type="submit" className="form--submit" value="Save" />
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
