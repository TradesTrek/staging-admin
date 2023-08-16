import React, { Fragment, useEffect, useState } from "react";
import DashboardHeader from "../../components/header/DashboardHeader";
import SideBar from "../../components/side-bar/SideBar";
import Head from "next/head";
import { gameService } from "../../services/game.service";
import FormSpinner from "../../components/Spinners/FormSpinner";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { userService } from "../../services";

export default function ChangePassword() {

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [modelOpened, setModelOpened] = useState(false)
  const router = useRouter();

  const [data, setData] = useState()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();


  const onSubmit = (data) => {
    changePassword(data)


  };
  const changePassword = (data) => {
    setModelOpened(false)
    userService
      .changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
      })
      .then((res) => {
        if (res?.success === true) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          reset({oldPassword:"",password:"",confirmPassword:""})
        } else {
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        setError(true);
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }
  return (
    <>
      <Head>
        <title>Change Password</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Fragment>
        <SideBar />
        <div className="dashboard sideBarOpen">
          <DashboardHeader />
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
          <div className="contentWrapper centerForm">
            <div className="dashboard_content">
              <h1 className="dashboard__title">Change Password</h1>
              <div className="center--block">
                <div className="small--block">
                  <div className="site--form">
                    <form className="site--form" onSubmit={handleSubmit(onSubmit)}>
                      <div className="form--item">
                        <label className="form--label" htmlFor="oldPassword">
                          Old Password
                        </label>
                        <div className={`form--group ${errors.oldPassword ? "is-invalid" : ""}`}>
                          <input
                            type={showOldPassword ? "text" : "password"}
                            className="withIcon"
                            id="oldPassword"
                            placeholder="Old Password"
                            {...register("oldPassword", {
                              required: true,
                              minLength: 8,
                              maxLength: 15,
                              pattern: {
                                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[@$#!%*?_&])([a-zA-Z0-9@$#_!%*?&]{8,15})$/,
                              },
                            })}
                          />
                          {showOldPassword ? <img src='/images/view.png' className='passwordView' onClick={() => setShowOldPassword(!showOldPassword)} /> : <img onClick={() => setShowOldPassword(!showOldPassword)} src='/images/invisible.png' className='passwordView' />}
                        </div>
                        <div className="invalid-feedback">
                          {errors.oldPassword?.type === "required" &&
                            "Old Password is required"}
                          {errors.oldPassword?.type === "minLength" &&
                            "Old Password should be atleast 8 characters"}
                          {errors.oldPassword?.type === "maxLength" &&
                            "Old Password should be less than 15 characters"}
                          {errors.oldPassword?.type === "pattern" &&
                            "Old Password must be alphanumeric with at least one special character"}
                        </div>
                      </div>

                      <div className="form--item">
                        <label className="form--label" htmlFor="pwd">
                          New Password
                        </label>
                        <div className={`form--group ${errors.password ? "is-invalid" : ""}`}>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="withIcon"
                            id="pwd"
                            placeholder="Password"
                            {...register("password", {
                              required: true,
                              maxLength: 15,
                              minLength: 8,

                              pattern: {
                                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[@$#!%*?_&])([a-zA-Z0-9@$#!%*?_&]{8,})$/,
                              },
                            })}
                          />
                          {showPassword ? <img src='/images/view.png' className='passwordView' onClick={() => setShowPassword(!showPassword)} /> : <img onClick={() => setShowPassword(!showPassword)} src='/images/invisible.png' className='passwordView' />}
                        </div>
                        <div className="invalid-feedback">
                          {errors.password?.type === "required" && "Password is required"}
                          {errors.password?.type === "minLength" &&
                            "Password should be atleast 8 characters"}
                          {errors.password?.type === "maxLength" &&
                            "Password should be less than 15 characters"}
                          {errors.password?.type === "pattern" &&
                            "Password must be alphanumeric with at least one special character"}
                        </div>
                      </div>
                      <div className="form--item">
                        <label className="form--label" htmlFor="cnfpwd">
                          Confirm Password
                        </label>
                        <div className={`form--group ${errors.cpassword ? "is-invalid" : ""}`}>
                          <input
                            type={showCPassword ? "text" : "password"}
                            className="withIcon"
                            id="cnfpwd"
                            placeholder="Confirm Password"
                            {...register("confirmPassword", {
                              required: true,
                              validate: (value) => {
                                if (watch("password") != value) {
                                  return "Confirm password does not match";
                                }
                              },
                            })}
                          />
                          {showCPassword ? <img src='/images/view.png' className='passwordView' onClick={() => setShowCPassword(!showCPassword)} /> : <img onClick={() => setShowCPassword(!showCPassword)} src='/images/invisible.png' className='passwordView' />}
                        </div>
                        <div className="invalid-feedback">
                          {errors.confirmPassword?.type === "required" &&
                            "Confirm password is required"}
                          {errors.confirmPassword?.type === "validate" &&
                            errors.confirmPassword?.message}
                        </div>
                      </div>

                      <div className="btnBlue fullW mt-6">
                        <button className="btn btnBgBlue" type="submit">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </>
  );
}
