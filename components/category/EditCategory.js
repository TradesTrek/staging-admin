/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { learningService } from "../../services/learning.service";

export default function EditCategory(props) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [updateLoader, setUpdateLoader] = useState(false);
  const [error, setError] = useState({});
  useEffect(()=>{
    setUrl(`${baseUrl}/${props.data.filePath}`)
    setCategory(props.data.categoryName)
  },[])
  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = () => {
   
    if (!category) {
      return setError({ category: "Please select Category" });
    }
    if (category.length < 5) {
      return setError({
        category: "Category should be greater then or equal to 5 characters",
      });
    }
    if (category.length > 31) {
      return setError({
        category: "Category should be less then or equal to 30 characters",
      });
    }
    setError({});
    setUpdateLoader(true);
    learningService
      .EditCategory(image, category,props.data._id)
      .then((response) => {
        if (response.success) {
          toast.success(response.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          props.editUserCloseModal()
          setUpdateLoader(false);
        } else {
          setUpdateLoader(false);
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.error(response.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      })
      .catch((err) => {
        setUpdateLoader(false);
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(err.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
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
          <h3>Edit Category</h3>
        </div>

        <div className="user--form">
          <div className="form--item">
            <input
              id="SelectPic"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleImage(e)}
              accept="image/png, image/jpeg"
            />
            <div className="mb--32 profileImage">
              <div className="invalid-feedback">{error.image}</div>

              <label htmlFor="SelectPic">
                <img
                  height={100}
                  width={200}
                  src={
                    url
                      ? url
                      : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIAAgAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EADEQAAICAQIFAQYFBQEAAAAAAAABAgMRBDEFEiFBUWETMkKBkaEiUnGx0RQVU2PwBv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD6iAAAAAAAACNqNfptO3GdmZL4Y9WR/wC8afPuW/RfyBYgj6fW6fUPFdn4n8MujJAAAAAAAAAAAAAAAK/i+rlRWqqniye78I5cS4lKE3TpnhrpKfr6FRKUpPMpOT7tsDGAAAJ2j4nbRiNmbK/XdfMgZMgepovr1FfPVLK/Y6Hl9PfZp7PaVyx5T2f6no9NfHU0xsh33Xh+AOoAAAAAAABpfP2dFli3jFtG5pfD2lM4fmi19gPLwjKycYRzKUnherPQUf8An6YxX9RZOc+6i8JFZwOPNxSnPw5ePkz1YFZLgWie3tF+kv5NtPwXR0vMou2X+x5X0LEAaqqtQ9mq4KH5eVY+hTcQ4HGebNFiMv8AG9n+nguwB4eyudU3XZFxmt0yz4DKXNdD4MJ/MtuN0Rt4fbLlTnBcyljquvX7FXwCP4bpeqX/AH1AtgAAAAAAAAABX6fT+w47CUfcsUpL0eHlF6RdRBRrosjHMoWRfT16P9yUAAAAAAcdZJR0eok9lVJ/ZlVwep1aNOSw5y5vkW2rqd2lsqjvNYONsYwnywWIrZAagAAAAAAAAACTQ8ww+zOhFqs5M9M5JQAAAAAAIljzOT9SRdJxhlb7EUAAAAAAAAAAABKplzQXp0IptCbhLK6+UBLBiMlJZT6GQABxvsaXLXv3fgDW+WZYXY5AAAAAAAAAAAABlLLSW7NKXZK+VdlfJKO6ZI0kebUQ9OrLGVcJPLis4xnuBXqLjt0N1KRJlTjbqaODW6A4NyfoaezJSrb7HSNC3kBVRU5WyjCDaim5S7IyXChFRcUkkyoknGTi910AwAAAAAAG0ISnJRistgapNvCWX4R3hpLJe9iKJlFMaV5l3Z1A400xp93q+7O3N5AAypJ7Greeg5UZAxF9nubNpbmDGEAcvBwt08LHl5UvKJAAr56Sxe61L7EdpptNYa7Fwc7aYWrEl17PwBVg3trdU3F/XyaAf//Z"
                  }
                />
              </label>
            </div>
          </div>
          <div className="form--item">
            <label className="form--label" htmlFor="lockModel">
              Category Name*
            </label>
            <input
              type="text"
              name="packageName"
              value={category}
              className="form--control"
              onChange={(e) => setCategory(e.target.value)}
            />
            <div className="invalid-feedback">{error.category}</div>
          </div>

          <div className="form--actions">
            {updateLoader ? (
              <FormSpinner />
            ) : (
              <>
                <input
                  onClick={onSubmit}
                  type="submit"
                  className="form--submit"
                  value="Save"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
