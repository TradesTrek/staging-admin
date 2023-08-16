/** @format */
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FormSpinner } from '../../components/Spinners/FormSpinner';
import getConfig from 'next/config';
import { userService } from '../../services';
import PhoneInput from 'react-phone-input-2';

export default function EditUser(props) {
  console.log(props, 'propsprops');
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const [phone,setPhone]=useState()
  const intialValues = {
    firstName: '',
    lastName:'',
    userName: '',
    phone: '',
    email: '',
    status: '',
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let upDateState = {
      firstName: props?.data?.firstName,
      lastName:props?.data?.lastName,
      userName: props?.data?.username,
      // phone: props?.data?.phone,
      email: props?.data?.email,
      status: props?.data?.status,
    };
    setPhone(props?.data?.phone)
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
      firstName: formValues?.firstName,
      lastName:formValues?.lastName,
      username: formValues?.userName,
      phone:phone,
      email: formValues?.email,
      status: formValues?.status,
    };

    // var form_data = new FormData();
    // for (let key in data) {
    //   form_data.append(key, data[key]);
    // }
    const userId = props?.data?._id;
    const response = await userService.updateUser(userId, data);
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
    setFormErrors({ ...formErrors, [name]: '' });
  };

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!phone) {
      errors.phone = 'Phone is required';
    }

    if (!values.userName) {
      errors.userName = 'Username is required';
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
          <h3>Edit User</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="brand">
                Select Status*
              </label>
              <select
                className={`form--control ${
                  formErrors.fullName ? 'is-invalid' : ''
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
                  formErrors.userName ? 'is-invalid' : ''
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
                  formErrors.email ? 'is-invalid' : ''
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
               className='form--control'
                  placeholder="Enter phone number"
                  value={phone}
                  country={'ng'}
                  enableSearch={true}
                  // defaultCountry="NG"
                  onChange={(phone)=>setPhone(phone)}
    
                 
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
                  formErrors.phone ? 'is-invalid' : ''
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
                  formErrors.firstName ? 'is-invalid' : ''
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
                  formErrors.lastName ? 'is-invalid' : ''
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.lastName}</div>
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
