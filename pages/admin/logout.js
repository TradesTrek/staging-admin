/** @format */
import React, { useEffect } from "react";
import { userService } from "../../services";

export default function AdminLogout() {
  useEffect(() => {
    return userService.logout();
  }, []);
  return <div></div>;
}
