/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import { subscriptionService } from "../../services/subscription.service";

export default function EditSubscription(props) {
  console.log(props, "propsprops");
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const intialValues = {
    packageName: "",
    packageDuration: "",
    packageDesc: "",
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let upDateState = {
      packageName: props?.data?.packageName,
      packageDuration: props?.data?.packageDuration,
      packageAmount: props?.data?.packageAmount,
      day: props?.data?.day,
      packageDesc: props?.data?.packageDesc,
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
      packageName: formValues?.packageName,
      packageDuration: formValues?.packageDuration,
      packageAmount: formValues?.packageAmount,
      day: formValues?.day,

      packageDesc: formValues?.packageDesc,
    };

    // var form_data = new FormData();
    // for (let key in data) {
    //   form_data.append(key, data[key]);
    // }
    // const userId = props?.data?._id;
    data.packageId = props?.data?._id;
    const response = await subscriptionService.updateSubscription(data);
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
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors(validate(formValues));
    setFormErrors({ ...formErrors, [name]: "" });
  };

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.packageName) {
      errors.packageName = "Package name is required";
    } else if (values.packageName > 50) {
      errors.packageName = "Package name is maximum 50 characters.";
    }
    if (!values.packageDesc) {
      errors.packageDesc = "Package Description is required";
    } else if (values.packageDesc > 80) {
      errors.packageDesc = "Package Description is maximum 80 characters.";
    }
    
    if (values.packageDuration != "trial") {
      if (!values.packageDuration) {
        errors.packageDuration = "Package Duration is required";
      }
      if (!values.packageAmount) {
        errors.packageAmount = "Package Amount is required";
      }
      if (values.packageAmount < 100) {
        errors.packageAmount =
          "Package Amount must be greater then or equal to 100";
      }
    }else{
      if (!values.day) {
        errors.day = "Package Day is required";
      }
      if(values.day<1){
        errors.day='Package day must be greater then or equal to 1'
      }
     
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
          <h3>Edit Subscription</h3>
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
                disabled
                name="packageDuration"
                value={formValues.packageDuration}
                onChange={handleChange}
              >
                {formValues.packageDuration == "trial" && (
                  <option
                    value="trial"
                    selected={
                      formValues.packageDuration == "trial" ? true : false
                    }
                  >
                    Free Trial
                  </option>
                )}
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
              </select>
              <div className="invalid-feedback">
                {formErrors?.packageDuration}
              </div>
            </div>
            {formValues.packageDuration != "trial" && (
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
                <div className="invalid-feedback">
                  {formErrors.packageAmount}
                </div>
              </div>
            )}
            {formValues.packageDuration == "trial" && (
              <div className="form--item">
                <label className="form--label" htmlFor="lockModel">
                  Trial Days*
                </label>
                <input
                  type="number"
                  name="day"
                  value={formValues.day}
                  className={`form--control ${
                    formErrors.day ? "is-invalid" : ""
                  }`}
                  min='1'
                  max='45'
                  onChange={handleChange}
                />
                <div className="invalid-feedback">
                  {formErrors.day}
                </div>
              </div>
            )}
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