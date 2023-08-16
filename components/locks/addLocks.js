import React, { useState, useEffect } from "react";
import { async } from "rxjs";
import { userService } from "../../services";
import { toast } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";

export default function AddLock(props) {
  const intialValues = {
    provider: "",
    lockName: "",
    unique_key: "",
    description: "",
    uploadPhoto: "",
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isImage, setIsImage] = useState("");
  const [loadPhoto, setLoadPhoto] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitSavedForm();
    }
  }, [formErrors]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  const submitSavedForm = async () => {
    setUpdateLoader(true);
     const data = {
       provider: formValues.provider,
       name: formValues.lockName,
       unique_key: formValues.unique_key,
       desc: formValues.description,
       photo: isImage,
     };

     var form_data = new FormData();
     for (let key in data) {
       form_data.append(key, data[key]);
     }

     const response = await userService.addNewLocks(form_data);
     if (response.success) {
       toast.success(response.message, {
         position: toast.POSITION.TOP_RIGHT,
       });
       formReset();
       setUpdateLoader(false);
       setIsSubmitting(false);
       props.allAdminLocks();
     } else {
       setUpdateLoader(false);
       setIsSubmitting(false);
       toast.error(response.message, {
         position: toast.POSITION.TOP_RIGHT,
       });
     }
  };

  // Save value in state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  // Reset Form
  const formReset = () => {
    const intialValues = {
      provider: "",
      lockName: "",
      unique_key: "",
      description: "",
      uploadPhoto: "",
    };
    setFormValues(intialValues);
    setIsImage("");
    setLoadPhoto(false);
  };

  // Form validation
  const validate = (values) => {
    let errors = {};
    if (!values.provider) {
      errors.provider = "Brand name is required";
    }
    if (!values.lockName) {
      errors.lockName = "Lock name is required";
    }
    if (!values.unique_key) {
      errors.unique_key = "Lock modal is required";
    }

    if (!values.uploadPhoto) {
      errors.uploadPhoto = "Passport photo is required";
    }
    return errors;
  };

  // Add Attachment
  const uploadLockImage = async (event, img) => {
    if (event) {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async (e) => {
        setLoadPhoto(true);
        setFormValues({ ...formValues, ["uploadPhoto"]: e.target.result });
      };
      setIsImage(img);
      setFormErrors({ ...formErrors, ["uploadPhoto"]: "" });
    }
    event.target.value = null;
  };

  return (
    <div className="form--inner">
      <div className="form--title">
        <h3>Add New Lock</h3>
      </div>
      <div className="user--form">
        <form id="addLocks" onSubmit={handleSubmit} noValidate>
          <div className="form--item">
            <label className="form--label" htmlFor="brand">
              Select Brand*
            </label>
            <select
              className={`form--control ${
                formErrors.provider ? "is-invalid" : ""
              }`}
              name="provider"
              defaultValue={formValues.provider}
              onChange={handleChange}
            >
              <option value="">Select brand</option>
              <option value="chinese">Rayonics</option>
              <option value="iseo" disabled>
                ISEO
              </option>
            </select>
            <div className="invalid-feedback">{formErrors.provider}</div>
          </div>
          <div className="form--item">
            <label className="form--label" htmlFor="lockName">
              Lock Name*
            </label>
            <input
              type="text"
              name="lockName"
              value={formValues.lockName}
              className={`form--control ${formErrors.name ? "is-invalid" : ""}`}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{formErrors.lockName}</div>
          </div>
          <div className="form--item">
            <label className="form--label" htmlFor="lockModel">
              Lock Model*
            </label>
            <input
              type="text"
              name="unique_key"
              value={formValues.unique_key}
              className={`form--control ${
                formErrors.unique_key ? "is-invalid" : ""
              }`}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{formErrors.unique_key}</div>
          </div>
          <div className="form--item">
            <label className="form--label" htmlFor="lockModel">
              Lock Description
            </label>
            <textarea
              className="form--control"
              name="description"
              value={formValues.description}
              onChange={handleChange}
            />
          </div>
          <div className="form--item form--image">
            <label className="form--label" htmlFor="lockImage">
              Lock Image
            </label>
            <input
              type="file"
              id="lockImage"
              className="form--control"
              accept="image/*"
              onChange={(event) =>
                uploadLockImage(event, event.target.files[0])
              }
            />
            {loadPhoto ? (
              <img
                className="form--label"
                src={formValues.uploadPhoto}
                alt="Profile Image"
              />
            ) : (
              ""
            )}
            <div className="invalid-feedback">{formErrors.uploadPhoto}</div>
          </div>
          <div className="form--actions">
            {updateLoader ? (
              <FormSpinner />
            ) : (
              <>
                <input type="submit" className="form--submit" />
                <input
                  type="reset"
                  className="form--cancel"
                  onClick={() => formReset()}
                />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
