import React from 'react';
import Link from 'next/dist/client/link';
import { ToastContainer } from 'react-toastify';
export default function Header() {
  return (
    <div>
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
      <div className="loginHeader">
        <div className="siteWidth">
          <div className="divideBlcok justify-between">
            <div className="leftBlock">
              <div className="Logo">
                <Link href="/">
                  <a>
                    <img src="../images/site--logo.svg" alt="Logo" />
                  </a>
                </Link>
              </div>
            </div>
            <div className="rightBlock">
              <div className="headerRightMenu items-center">
                <div className="menuList">
                  {/* <Link href="/" className="btn">
                    <a className="btn">Sign in</a>
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
