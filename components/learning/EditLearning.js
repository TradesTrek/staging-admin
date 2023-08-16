/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { learningService } from "../../services/learning.service";
export default function EditLearning(props) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;

  const toastId = useRef(null);
  const intialValues = {
    title: "",
    category: "",
    url: '',
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [option,setOption]=useState([])

  useEffect(() => {
    let upDateState = {
      title: props?.data?.title,
      category: props?.data?.result?._id,
      url: props?.data?.url,
    };
    setFormValues(upDateState);
  }, [props]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitEditForm();
    }
  }, [formErrors]);


  useEffect(()=>{
    learningService.AllCategory().then((res)=>{
      if(res.success){
        setOption(res.data)
      }else{
        setOption([])
      }
    }).catch((err)=>{
      setOption([])
    })
  },[])
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  const submitEditForm = async () => {
    setUpdateLoader(true);
    const data = {
      title: formValues?.title,
      categoryId: formValues?.category,
      url: formValues?.url,
    };

    // var form_data = new FormData();
    // for (let key in data) {
    //   form_data.append(key, data[key]);
    // }
    // const userId = props?.data?._id;
    data._id = props?.data?._id;
    const response = await learningService.EditLearning(data,props?.data?._id);
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
      if (name == "title" && (value.length == null || value == "")) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors({
          ...formErrors,
          [name]: "Title is required.",
        });
      } else if (name == "title" && value.length <= 20) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        setFormErrors({ ...formErrors, [name]: "" });
      }
      if (name == "category" && value.length <= 50) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        
        setFormErrors({ ...formErrors, [name]: "" });
      } 
      if (name == "url" ) {
        setFormValues({ ...formValues, [name]: value });
        setFormErrors(validate(formValues));
        
        setFormErrors({ ...formErrors, [name]: "" });
      } 
    
  };

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.title) {
      errors.title = "Title is required";
    } else if (values.title.length > 20) {
      errors.title = "Title is maximum 20 characters.";
    }
    if (!values.category) {
      errors.category = "Category is required";
    }
    if (!values.url) {
      errors.url = "Url is required";
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
          <h3>Edit Learning</h3>
        </div>
        <div className="user--form">
          <form id="addLocks" onSubmit={handleSubmit} noValidate>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                className={`form--control ${
                  formErrors.title ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.title}</div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="brand">
                Category*
              </label>
              <select
                className={`form--control ${
                  formErrors.category ? "is-invalid" : ""
                }`}
                name="category"
                value={formValues.category}
                onChange={handleChange}
              >
              
                {option?.map((item)=>{
                  return (
                    <option
                  value={item?._id}
                  selected={formValues.category == "stock_buy" ? true : false}
                >
                  {item?.categoryName}
                </option>
                  )
                })}
               
              </select>
              <div className="invalid-feedback">
                {formErrors?.category}
              </div>
            </div>
            <div className="form--item">
              <label className="form--label" htmlFor="lockModel">
                Url*
              </label>
              <input
                type="text"
                name="url"
                value={formValues.url}
                className={`form--control ${
                  formErrors.url ? "is-invalid" : ""
                }`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{formErrors.url}</div>
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
