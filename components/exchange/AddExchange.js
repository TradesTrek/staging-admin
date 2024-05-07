/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { stockService } from "../../services/stock.service";
import "react-datepicker/dist/react-datepicker.css";


export default function AddExchange({ addUserCloseModal }) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const intialValues = {
    exchangeName: "",

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
      name: formValues?.exchangeName,
    };

 

    const response = await stockService.addExchange(data);
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
      if (name == "exchangeName" && value.length <= 20) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        setFormErrors({ ...formErrors, [name]: "" });
      } else if (name == "exchangeName") {
        setFormErrors({
          ...formErrors,
          [name]: "Name is maximum 20 characters.",
        });
      }
   
    } else {
      setFormValues({
        ...formValues,
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
    if (!values.exchangeName) {
      errors.exchangeName = "name is required.";
    } else if (values.exchangeName.length < 3) {
      errors.exchangeName = " Name is minimum 3 characters.";
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
          <h3>Add Exchange</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Exchange Name*
              </label>
              <input
                type="text"
                name="exchangeName"
                value={formValues.exchangeName}
                className={`form--control ${
                  formErrors.name ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.exchangeName}</div>
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