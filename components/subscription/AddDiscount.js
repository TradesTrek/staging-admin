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
import { subscriptionService } from "../../services/subscription.service";

export default function AddSubscription({ addUserCloseModal }) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const intialValues = {
    code: "",
    expiryDate: "",
    userLimit: 0,
    discountType: "percentage",
    discountAmount: 0,
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const response = await subscriptionService.createDiscountCode(formValues);


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
      console.log(response)
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  };

  // Save value in state
  const handleChange = (e) => {

    if (e.target) {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        setFormErrors({ ...formErrors, [name]: "" });
    } else {
        setFormValues({
            ...formValues,
            expiryDate: moment(e).format("YYYY-MM-DD"),
          });
          setFormErrors(validate(formValues));
          setFormErrors({ ...formErrors,  expiryDate: "" });
    }
    
  };

  const validate = (values) => {
    let errors = {};
    if (!values.code) {
      errors.code = "Discount code is required.";
    } 

    if (values.code.length < 5) {
        errors.code = "Code name is minimum 5 characters.";
      }
    
    if (values.code.length > 50) {
      errors.code = "Package name is maximum 50 characters.";
    }

    if (!values.expiryDate) {
      errors.expiryDate = "Code expiry date is required";
    }

    if (!values.discountAmount) {
        errors.discountAmount = "Discount amount is required";
      }
    
    // if (!values.isGiftableSubscription) {
    //   if (!values.packageAmount) {
    //     errors.packageAmount = "Package amount is required";
    //   }

    //   if (values.packageAmount < 100) {
    //     errors.packageAmount =
    //       "Package Amount must be greater than or equal to 100";
    //   }
    // }


    return errors;
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
          <h3>Create Discount Code</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="brand">
              Discount Type*
              </label>
              <select
                className={`form--control `}
                name="discountType"
                value={formValues.discountType}
                onChange={handleChange}
              >
                <option
                  value="percentage"
                  selected={
                    formValues.discountType === "percentage" ? true : false
                  }
                > 
                  Percentage
                </option>
                <option
                  value="fixed"
                  selected={formValues.discountType == "fixed" ? true : false}
                >
                  Fixed Naira value
                </option>
              </select>
            </div>

            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Discount Code*
              </label>
              <input
                type="text"
                name="code"
                value={formValues.code}
                className={`form--control ${
                  formErrors.code ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.code}</div>
            </div>


            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                User Limit
              </label>
              <input
                type="text"
                name="userLimit"
                value={formValues.userLimit}
                className={`form--control ${
                  formErrors.userLimit ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.userLimit}</div>
            </div>
            

    

       

              <div className="form--item">
                <label className="form--label" htmlFor="lockModel">
                  Discount Amount*
                </label>
                <input
                  type="text"
                  name="discountAmount"
                  value={formValues.discountAmount}
                  className={`form--control ${
                    formErrors.discountAmount ? "is-invalid" : ""
                  }`}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">
                  {formErrors.discountAmount}
                </div>
              </div>
           
              <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Expiry Date*
              </label>
              <ReactDatePicker
                name="expiryDate"
                value={formValues.expiryDate}
                // selected={formValues.expiryDate}
                onChange={handleChange}
                className={`form--control ${
                  formErrors.expiryDate ? "is-invalid" : ""
                }`}
                minDate={new Date().setDate(new Date().getDate() + 1)}
                placeholderText="Select an expiry day"
              />
           

              <div className="invalid-feedback">{formErrors.holidayDate}</div>
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
