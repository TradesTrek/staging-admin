/** @format */
import React, { useEffect } from "react";
import Router from "next/router";

export default function Login() {
  useEffect(() => {
    Router.push("/");
  }, []);
  return <div></div>;
}
