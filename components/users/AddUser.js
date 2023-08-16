/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../../components/Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function AddUser({ addUserCloseModal }) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const intialValues = {
    firstName: "",
    lastName: "",
    userName: "",
    phone: "",
    email: "",
    status: 1,
    password: "",
    confirmPassword: "",
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [phone, setPhone] = useState();
  useEffect(() => {
    console.log(formErrors);
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
      firstName: formValues?.firstName,
      lastName: formValues?.lastName,
      username: formValues?.userName,
      phone: phone,
      email: formValues?.email,
      status: formValues?.status,
      password: formValues?.password,
      confirmPassword: formValues?.confirmPassword,
    };

    console.log(data);
    // var form_data = new FormData();
    // for (let key in data) {
    //   form_data.append(key, data[key]);
    // }

    const response = await userService.createUser(data);
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
    if (!values.firstName) {
      errors.firstName = "First name is required";
    }
    if (!values.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(
        values.email
      )
    ) {
      errors.email = "Invalid Email";
    } else if (values.email.length > 30) {
      errors.email = "Email is maximum 30 characters.";
    }
    if (!phone) {
      errors.phone = "Phone is required";
    } else if (!/^[0-9]+/.test(phone)) {
      errors.phone = "Invalid Phone No";
    } else if (phone.length < 10 || phone.length > 15) {
      errors.phone = "Invalid Phone No";
    }

    if (!values.userName) {
      errors.userName = "Username is required";
    }
    if (values.userName.length > 20) {
      errors.userName = "Username is maximum 20 characters.";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$#!%*?_&])([a-zA-Z0-9@$#!%*?_&]{8,15})$/.test(
        values.password
      )
    ) {
      errors.password =
        "Password must be alphanumeric with at least one special character and one capital letter     ";
    }

    if (values.password != values.confirmPassword) {
      errors.confirmPassword = "Password does not matched";
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
          <h3>Add User</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="brand">
                Select Status*
              </label>
              <select
                className={`form--control ${
                  formErrors.fullName ? "is-invalid" : ""
                }`}
                name="status"
                value={formValues.status}
                onChange={handleChange}
              >
                <option
                  value={1}
                  selected={formValues.status == 1 ? true : false}
                >
                  Active
                </option>
                <option
                  value={0}
                  selected={formValues.status == 0 ? true : false}
                >
                  Inactive
                </option>
              </select>
              <div className="invalid-feedback">{formErrors?.status}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockName">
                Username*
              </label>
              <input
                type="text"
                name="userName"
                value={formValues.userName}
                className={`form--control ${
                  formErrors.userName ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.userName}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                className={`form--control ${
                  formErrors.email ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.email}</div>
            </div>
            <div className="form--item ">
              <label className="form--label" htmlFor="lockName">
                Phone No*
              </label>
              <PhoneInput
                className="form--control"
                placeholder="Enter phone number"
                value={phone}
                country={"ng"}
                enableSearch={true}
                // defaultCountry="NG"
                onChange={(phone) => setPhone(phone)}
              />
              {/* <div className="inputGroup">
                  <span>+234</span>
                  <input
                    className={`form--control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    type="tel"
                    id="phnum"
                    placeholder="Phone Number"
                    {...register("phone", {
                      required: true,
                      maxLength: 11,
                      minLength: 11,
                      pattern: /^[0-9]+/,
                    })}
                  />
                </div> */}
              {/* <label className="form--label" htmlFor="phnum">
                  Phone Number
                </label>
                <div className="invalid-feedback">
                  {errors.phone?.type === "required" &&
                    "Phone number is required"}
                  {errors.phone?.type === "minLength" &&
                    "Phone number should be at least 11 digit. "}
                  {errors.phone?.type === "maxLength" &&
                    "Phone number should contain  11 digit only "}
                  {errors.phone?.type === "pattern" && "Only digits allow"}
                </div> */}
              <div className="invalid-feedback">{formErrors.phone}</div>
            </div>
            {/* <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phone"
                value={formValues.phone}
                className={`form--control ${
                  formErrors.phone ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.phone}</div>
            </div> */}
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                className={`form--control ${
                  formErrors.firstName ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.firstName}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                className={`form--control ${
                  formErrors.lastName ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.lastName}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Password*
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  className={`form--control ${
                    formErrors.password ? "is-invalid" : ""
                  }`}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <img
                    src="/images/view.png"
                    className="passwordView"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <img
                    onClick={() => setShowPassword(!showPassword)}
                    src="/images/invisible.png"
                    className="passwordView"
                  />
                )}
              </div>
              <div className="invalid-feedback">{formErrors.password}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Confirm Password*
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type={showCPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  className={`form--control ${
                    formErrors.confirmPassword ? "is-invalid" : ""
                  }`}
                  onChange={handleChange}
                />
                {showCPassword ? (
                  <img
                    src="/images/view.png"
                    className="passwordView"
                    onClick={() => setShowCPassword(!showCPassword)}
                  />
                ) : (
                  <img
                    onClick={() => setShowCPassword(!showCPassword)}
                    src="/images/invisible.png"
                    className="passwordView"
                  />
                )}
              </div>
              <div className="invalid-feedback">
                {formErrors.confirmPassword}
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
