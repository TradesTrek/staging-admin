/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import { subscriptionService } from "../../services/subscription.service";
import { learningService } from "../../services/learning.service";

export default function AddLearning({ addUserCloseModal }) {
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
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitEditForm();
    }
  }, [formErrors]);

  useEffect(()=>{
    learningService.AllCategory().then((res)=>{
      if(res.success){
        setOption(res.data)
        setFormValues({...formValues,category:res?.data[0]._id})
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

    const response = await learningService.AddLearning(data);
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

  const validate = (values) => {
    let errors = {};
    if (!values.title) {
      errors.title = "Title is required.";
    } else if (values.title.length > 50) {
      errors.title = "Title is maximum 50 characters.";
    }
    if (!values.category) {
      errors.category = "Category is required";
    }
    if (!values.url) {
      errors.url = "Url  is required";
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
          <h3>Add Learning</h3>
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
               Link *
              </label>
              <input
                type="url"
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
