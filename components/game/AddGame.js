/** @format */
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FormSpinner } from "../Spinners/FormSpinner";
import getConfig from "next/config";
import { userService } from "../../services";
import { useForm } from "react-hook-form";
import { gameService } from "../../services/game.service";
import NigerianCurrentTimeZone from "../../helpers/NegerianCurrentTime";
import NigerianDateConverter from "../../helpers/NegerianDateConverter";

export default function AddGame({ addUserCloseModal }) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `₦{publicRuntimeConfig.apiUrl}`;
  const toastId = useRef(null);
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm({
    defaultValues: {
      startingCash: "100000",
      marketDelay: "15",
      endDate: null,
    },
  });
  const intialValues = {
    holidayName: "",
    holidayDate: "",
  };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    gameService
      .createGame(data)
      .then((res) => {
        if (res.success) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          addUserCloseModal();
          setUpdateLoader(false);
          setIsSubmitting(false);
          // router.push("/dashboard/portfolio");
        } else {
          setUpdateLoader(false);
          setIsSubmitting(false);
          // alert('nnn')
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.error(res.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      })
      .catch((err) => console.log(err));
    // alert("data");
    // console.log(data);
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
          <h3>Add Competition</h3>
        </div>
        <div>
          <form id="addLocks" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="formTitle px-32">
                <h4 className="font-18 font--bold">
                  COMPETITION NAME & BASIC TRADING RULES
                </h4>
                <p>
                  These settings cannot be changed once the competition has been
                  created.
                </p>
              </div>
              <div className="user--form1">
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Competition Name *
                  </label>
                  <input
                    className={`form--control ₦{
                      errors.competitionName ? "is-invalid" : ""
                    }`}
                    type="text"
                    id="competitionName"
                    placeholder="Enter competition name here"
                    {...register("competitionName", {
                      required: true,
                      maxLength: 30,
                      minLength: 10,
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.competitionName?.type === "required" &&
                      "Competition Name is required"}
                    {errors.competitionName?.type === "minLength" &&
                      "Competition Name should be atleast 10 characters"}
                    {errors.competitionName?.type === "maxLength" &&
                      "Competition Name should be less than 30 characters"}
                  </div>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Competition Description *
                  </label>
                  <textarea
                    className={`form--control ₦{
                      errors.competitionDescription ? "is-invalid" : ""
                    }`}
                    type="text"
                    id="competitionDescription"
                    placeholder="Enter competition name here"
                    {...register("competitionDescription", {
                      required: true,
                      maxLength: 70,
                      minLength: 20,
                    })}
                  />

                  <div className="invalid-feedback">
                    {errors.competitionDescription?.type === "required" &&
                      "Competition Description is required"}
                    {errors.competitionDescription?.type === "minLength" &&
                      "Competition Description should be atleast 20 characters"}
                    {errors.competitionDescription?.type === "maxLength" &&
                      "Competition Description should be less than 70 characters"}
                  </div>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Competition Description *
                  </label>
                  <select
                    {...register("competitionType")}
                    className="form--control"
                  >
                    <option value="Public">Public Competition</option>
                    <option value="Private">Private Competition</option>
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Starting Cash *
                  </label>
                  <select
                    {...register("startingCash")}
                    className="form--control"
                  >
                    <option value="1000000">₦1,000,000</option>

                    <option value="500000">₦500,000</option>

                    <option value="250000">₦250,000</option>

                    <option value="100000">₦100,000</option>

                    <option value="50000">₦50,000</option>

                    <option value="25000">₦25,000</option>

                    <option value="10000">₦10,000</option>
                    <option value="1000">₦1,000</option>
                  </select>
                </div>
                <div className="form--item">
                  <div
                    className="form--item toggle"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label className="form--label withIcon">
                      Allow Trading with margin?
                    </label>
                    <div className="box_1">
                      <input
                        {...register("allowTradingWithMargin")}
                        type="checkbox"
                        className="switch_1"
                      />
                    </div>
                  </div>
                </div>
                <div className="form--item">
                  <div
                    className="form--item toggle"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label className="form--label withIcon">
                      Allow Short Selling?
                    </label>
                    <div className="box_1">
                      <input
                        {...register("allowShortSelling")}
                        type="checkbox"
                        className="switch_1"
                      />
                    </div>
                  </div>
                </div>

                <div className="form--item">
                  {watch("competitionType") == "Private" ? (
                    <div className="form--item ">
                      <label className="form--label" htmlFor="lockModel">
                        Password *
                      </label>

                      <div style={{ display: "flex" }}>
                        <input
                          style={{ width: "100%" }}
                          className={`form--control ₦{
                            errors.password ? "is-invalid" : ""
                          }`}
                          type={showPassword ? "text" : "password"}
                          id="pwd"
                          placeholder="Password"
                          {...register("password", {
                            required: true,
                            maxLength: 15,
                            minLength: 8,

                            pattern: {
                              value:
                                /^(?=.*[0-9])(?=.*[a-z])(?=.*[@₦#!%*?_&])([a-zA-Z0-9@₦#!%*?_&]{8,})₦/,
                            },
                          })}
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

                      <div className="invalid-feedback">
                        {errors.password?.type === "required" &&
                          "Password is required"}
                        {errors.password?.type === "minLength" &&
                          "Password should be atleast 8 characters"}
                        {errors.password?.type === "maxLength" &&
                          "Password should be less than 15 characters"}
                        {errors.password?.type === "pattern" &&
                          "Password must be alphanumeric with at least one special character"}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="formTitle px-32">
                <h4 className="font-18 font--bold">BASIC COMPETITION RULES</h4>
                <p>
                  Basic game rules can be modified after the game is created.
                </p>
              </div>
              <div className="user--form1">
                <div className="form--item">
                  <div
                    className="form--item toggle"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label className="form--label withIcon">
                      Allow Late Entry
                    </label>
                    <div className="box_1">
                      <input
                        {...register("allowLateEntry")}
                        type="checkbox"
                        className="switch_1"
                      />
                    </div>
                  </div>
                </div>
                <div className="form--item">
                  <div
                    className="form--item toggle"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label className="form--label withIcon">
                      Allow Portfolio Viewing?
                    </label>
                    <div className="box_1">
                      <input
                        {...register("allowPortfolioViewing")}
                        type="checkbox"
                        className="switch_1"
                      />
                    </div>
                  </div>
                </div>
                <div className="form--item">
                  <div
                    className="form--item toggle"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label className="form--label withIcon">
                      Allow Portfolio Resetting?
                      {/* <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path
                      d="M7.75259 0.772461C3.52441 0.772461 0.0800781 4.21679 0.0800781 8.44497C0.0800781 12.6732 3.52441 16.1175 7.75259 16.1175C11.9808 16.1175 15.4251 12.6732 15.4251 8.44497C15.4251 4.21679 11.9808 0.772461 7.75259 0.772461ZM7.75259 1.95285C11.3445 1.95285 14.2447 4.85309 14.2447 8.44497C14.2447 12.0369 11.3445 14.9371 7.75259 14.9371C4.16071 14.9371 1.26046 12.0369 1.26046 8.44497C1.26046 4.85309 4.16071 1.95285 7.75259 1.95285ZM7.1624 4.31362V5.49401H8.34279V4.31362H7.1624ZM7.1624 6.67439V12.5763H8.34279V6.67439H7.1624Z"
                      fill="#2525BB"
                    />
                  </svg> */}
                    </label>
                    <div className="box_1">
                      <input
                        {...register("allowPortfolioResetting")}
                        type="checkbox"
                        className="switch_1"
                      />
                    </div>
                  </div>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Game Start Date *
                  </label>
                  <input
                    {...register("startDate", { required: true })}
                    className="form--control"
                    type="date"
                    min={NigerianCurrentTimeZone()}
                  />
                  <div className="invalid-feedback">
                    {errors.startDate?.type === "required" &&
                      "Start Date is required"}
                  </div>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Game End Date *
                  </label>
                  <input
                    {...register("endDate")}
                    className="form--control"
                    type="date"
                    disabled={!watch('startDate')}
                    min={NigerianDateConverter(watch('startDate'))}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="formTitle px-32">
                <h4 className="font-18 font--bold">
                  ADVANCED COMPETITION RULES
                </h4>
                <p>
                  Some advanced game rules can be modified after the game is
                  created.
                </p>
              </div>
              <div className="user--form1">
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Market Delay *
                  </label>
                  <select
                    {...register("marketDelay")}
                    className="form--control"
                  >
                    {Array.from({ length: 20 }, (_, i) => {
                      return <option value={i + 1}>{i + 1} minutes</option>;
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Daily Volume *
                  </label>
                  <select
                    {...register("dailyVolume")}
                    className="form--control"
                  >
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 20 }, (_, i) => {
                      return (
                        <option value={(i + 1) * 5}>{(i + 1) * 5} %</option>
                      );
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Quick Sell*
                  </label>
                  <select {...register("quickSell")} className="form--control">
                    <option value="Disabled">Disabled</option>

                    {Array.from({ length: 32 }, (_, i) => {
                      return (
                        <option value={(i + 1) * 15}>
                          {(i + 1) * 15} minutes
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Minimum Price *
                  </label>
                  <select
                    {...register("minimumPrice")}
                    className="form--control"
                  >
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      return (
                        <option value={i + 1}>₦ {(i + 1).toFixed(2)}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Minimum Price Short *
                  </label>
                  <select
                    {...register("minimumPriceShort")}
                    className="form--control"
                  >
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      return (
                        <option value={i + 1}>₦ {(i + 1).toFixed(2)}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Minimum Stock for Margin *
                  </label>
                  <select
                    {...register("minimumStockForMargin")}
                    className="form--control"
                  >
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      return (
                        <option value={i + 1}>₦ {(i + 1).toFixed(2)}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Commission *
                  </label>
                  <select {...register("commission")} className="form--control">
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      return (
                        <option value={i + 0.99}>
                          ₦ {(i + 0.99).toFixed(2)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Margin Interest *
                  </label>
                  <select
                    {...register("marginInterest")}
                    className="form--control"
                  >
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      return (
                        <option value={(i + 1) * 10}>{(i + 1) * 10} %</option>
                      );
                    })}
                  </select>
                </div>
                <div className="form--item">
                  <label className="form--label" htmlFor="lockModel">
                    Cash Interest *
                  </label>
                  <select
                    {...register("cashInterest")}
                    className="form--control"
                  >
                    <option value="Disabled">Disabled</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      return (
                        <option value={(i + 1) * 10}>{(i + 1) * 10} %</option>
                      );
                    })}
                  </select>
                </div>

                <div className="form--actions">
                  <button
                    className="btn "
                    style={{
                      padding: " 2px 10px",
                      background: "#1d82f5",
                      borderRadius: "5px",
                      color: "white",
                    }}
                    type="submit"
                  >
                    Create Competition
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
