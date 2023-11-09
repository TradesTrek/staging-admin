/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import { subscriptionService } from "../../services/subscription.service";

export default function AddSubscription({ addUserCloseModal }) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const intialValues = {
    packageName: "",
    packageDuration: "monthly",
    packageAmount: 0,
    packageDesc: "",
    category: "Premium",
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
    const data = {
      packageName: formValues?.packageName,
      packageDuration: formValues?.packageDuration,
      packageAmount: formValues?.packageAmount,
      packageDesc: formValues?.packageDesc,
      category: formValues?.category
    };

    const response = await subscriptionService.AddSubscription(data);
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
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(validate(formValues));
    setFormErrors({ ...formErrors, [name]: "" });
  };
  //   useEffect(()=>{
  //           isSubmitting &&   setFormErrors(validate(formValues));
  //   },[formValues,isSubmitting])

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.packageName) {
      errors.packageName = "Package name is required.";
    } else if (values.packageName.length > 50) {
      errors.packageName = "Package name is maximum 50 characters.";
    }
    if (!values.packageDuration) {
      errors.packageDuration = "Package duration is required";
    }
    if (!values.category) {
      errors.category = "Package category is required";
    }
    if (!values.packageAmount) {
      errors.packageAmount = "Package amount is required";
    }
    if (values.packageAmount < 100) {
      errors.packageAmount =
        "Package Amount must be greater than or equal to 100";
    }
    if (!values.packageDesc) {
      errors.packageDesc = "Package description is required";
    } else if (values.packageDesc.length > 80) {
      errors.packageDesc = "Package description is maximum 80 characters.";
    }

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
          <h3>Add Subscription</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Package Name*
              </label>
              <input
                type="text"
                name="packageName"
                value={formValues.packageName}
                className={`form--control ${
                  formErrors.packageName ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.packageName}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="brand">
                Package Duration*
              </label>
              <select
                className={`form--control ${
                  formErrors.packageDuration ? "is-invalid" : ""
                }`}
                name="packageDuration"
                value={formValues.packageDuration}
                onChange={handleChange}
              >
                {/* <option
                  value='trial'
                  selected={formValues.packageDuration == 'trial' ? true : false}
                >
                Free  Trial
                </option> */}
                <option
                  value="hourly"
                  selected={
                    formValues.packageDuration == "hourly" ? true : false
                  }
                >
                  Hourly
                </option>
                <option
                  value="monthly"
                  selected={
                    formValues.packageDuration == "monthly" ? true : false
                  }
                >
                  Monthly
                </option>
                <option
                  value="quarterly"
                  selected={
                    formValues.packageDuration == "quarterly" ? true : false
                  }
                >
                  Quarterly
                </option>
                <option
                  value="annually"
                  selected={
                    formValues.packageDuration == "annually" ? true : false
                  }
                >
                  Annually
                </option>
                <option
                  value="free-lifetime"
                  selected={
                    formValues.packageDuration == "free-lifetime" ? true : false
                  }
                >
                  free-lifetime
                </option>
              </select>
              <div className="invalid-feedback">
                {formErrors?.packageDuration}
              </div>
            </div>

            <div className="form--item">
              <label className="form--label" htmlFor="brand">
                Package Category*
              </label>
              <select
                className={`form--control ${
                  formErrors.category ? "is-invalid" : ""
                }`}
                name="category"
                value={formValues.category}
                onChange={handleChange}
              >




                <option
                  value="Premium"
                  selected={formValues.category == "Premium" ? true : false}
                >
                  Premium
                </option>
                <option
                  value="Standard"
                  selected={formValues.category == "Standard" ? true : false}
                >
                  Standard
                </option>
                <option
                  value="Basic"
                  selected={formValues.category == "Basic" ? true : false}
                >
                  Basic
                </option>
              </select>
              <div className="invalid-feedback">
                {formErrors?.category}
              </div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Package Amount*
              </label>
              <input
                type="text"
                name="packageAmount"
                value={formValues.packageAmount}
                className={`form--control ${
                  formErrors.packageAmount ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.packageAmount}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Package Description*
              </label>
              <textarea
                type="text"
                name="packageDesc"
                value={formValues.packageDesc}
                className={`form--control ${
                  formErrors.packageDesc ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.packageDesc}</div>
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
