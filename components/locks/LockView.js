/** @format */

import React, { useState } from "react";
import Link from "next/dist/client/link";
import { userService } from "../../services";
import { useForm } from "react-hook-form";
import { FormSpinner } from "../Spinners/FormSpinner"
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Modal from 'react-modal';
import { toast } from "react-toastify";
import { async } from "rxjs";
export default function Locks(props) {
  const [isModal, setIsModal] = useState(false);
  const [loadLock, setLoadLock] = useState("");
  const [isUser, setIsUser] = useState([]);
  const [modalLoading, setModalLoading] = useState(true);
  const assignLockToUser = async (lock) => {
    setIsModal(true);
    setLoadLock(lock);
    const response = await userService.getUsers();
    if (response.success) {
       const tmpArray = [];
       response.users.map((user) => {
         const userArray = {
           id: user.detail._id,
           email: user.detail.email,
           mobile: user.detail.mobile_number,
           urn_id: user.detail.urn_id,
         };
         tmpArray.push(userArray);
       });
       setIsUser(tmpArray);
       setModalLoading(false);
    }
    else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setBtnStatus(false);
    }
  };

  //form validation
  const validationSchema = Yup.object().shape({
    lockType: Yup.string().required("lockType is required"),
    urn: Yup.string().required("User is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const onSubmit = async (options) => {
    var today = Date.UTC(new Date());
    options["lock_ids"] = loadLock.id;
    options["valid_from"] = "2022-05-09T08:00:00+01:00";
    options["valid_to"] = "2024-10-24T08:00:00+01:00";
    options["time_slot"] = { "start_hour": "8", "start_min": "0", "end_hour": "20", "end_min": "0" };
    options["holidays"] = true;
    options["allowed_days"] = [1, 1, 1, 1, 1, 0, 0];
    const response = await userService.AssignLock(options);
    if (response.status) {
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsModal(false);
    }
    else{
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const closeModal = () => {
    setIsModal(false);
  };
  return (
    <>
      <div className="siteWidth">
        <div className="dashboardBody">
          <div className="lockBox flex flex-wrap">
            {props?.data?.map((item, index) => {
              //console.  log(item,'item')
              return (
                <div className="colW" key={index}>
                  <div className="lockDetail">
                    <Link href="javaScript:void(0);">
                      <a
                        onClick={() => {
                          assignLockToUser(item);
                        }}
                      >
                        <div className="imgBlock">
                          <img src="/images/lock-img.png" alt="Lock Image" />
                        </div>
                      </a>
                    </Link>
                    <div className="lockText">
                      <h4 className="font-16">{item.name}</h4>
                      <p className="flex">
                        Current Status: &nbsp;
                        <span className="lockIcon textDarkBlue flex items-center">
                          Locked
                          <span className="pl-4">
                            <svg
                              width="13"
                              height="14"
                              viewBox="0 0 13 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.5 0.0625C4.15918 0.0625 2.25 1.97168 2.25 4.3125V5.375H1.71875C0.843017 5.375 0.125 6.09302 0.125 6.96875V12.2813C0.125 13.157 0.843017 13.875 1.71875 13.875H11.2812C12.157 13.875 12.875 13.157 12.875 12.2813V6.96875C12.875 6.09302 12.157 5.375 11.2812 5.375H10.75V4.3125C10.75 1.97168 8.84082 0.0625 6.5 0.0625ZM6.5 1.125C8.26807 1.125 9.6875 2.54443 9.6875 4.3125V5.375H3.3125V4.3125C3.3125 2.54443 4.73193 1.125 6.5 1.125ZM1.71875 6.4375H11.2812C11.5801 6.4375 11.8125 6.66992 11.8125 6.96875V12.2813C11.8125 12.5801 11.5801 12.8125 11.2812 12.8125H1.71875C1.41992 12.8125 1.1875 12.5801 1.1875 12.2813V6.96875C1.1875 6.66992 1.41992 6.4375 1.71875 6.4375Z"
                                fill="#001C55"
                              />
                            </svg>
                          </span>
                        </span>
                      </p>
                      <p>Property Name</p>
                      <p>Floor 1</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModal}
        style={{
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgb(122 120 120 / 75%)",
            },
            content: {
                position: "absolute",
                top: "0",
                left: "0%",
                right: "0%",
                bottom: "200px",
                background: "#fff",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
            },
        }}>
        <div className="modalHeader">
          <button onClick={() => closeModal()}><img src="/images/icons8_delete_1.svg" /></button>
        </div>
        <div className='modalBody'>
            <div className="card card--block modal_box text-center">
                <h4 className='font-22 mb-6'>Assign Lock To Users</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="lockSeletion">
                <div className='form-item lockSelectW'>
                  <label>Select Lock Type</label>
                  <select {...register("lockType")}
                  className={`form-control ${
                    errors.lockType ? "is-invalid" : ""
                  }`}
                  autoFocus>
                    <option value="iseo">iseo</option>
                    <option value="chinese">chinese</option>
                  </select>
                  <div className="invalid-feedback">
                    {errors.lockType?.message}
                  </div>
                </div>
                <div className="form-item userSelectW">
                  <label>Select Email Type</label>
                  <select {...register("urn")}
                      className={`form-control ${
                        errors.urn ? "is-invalid" : ""
                      }`}
                      autoFocus
                    >
                  {isUser?.length > 0 &&
                      isUser.map((user, index) => {
                        return (
                          <>
                            <option value={user.urn_id} key={index}>
                              {user.email}
                            </option>
                          </>
                        );
                      })}
                  </select>
                  <div className="invalid-feedback">
                    {errors.urn?.message}
                  </div>
                </div>
                </div>
                
                <div className='btnBlue fullW mt--6'>
                    <button className='btnBgBlue' type="submit">Assign</button>
                </div>
                </form>
            </div>
        </div>
    </Modal>
    </>
  );
}
