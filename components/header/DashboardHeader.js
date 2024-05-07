import React from 'react';
import Link from 'next/dist/client/link';
import { ToastContainer } from 'react-toastify';
export default function DashboardHeader() {
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
      <div className="pageWrapper">
        <div className="siteWidth">
          <div className="DashboardHeader divideBlcok justify-between">
            <div className="leftBlock">
              {/* <div className="Logo">
                  <img src="/images/header-logo-new.svg" alt="Logo" />
                </div> */}
              <div className="welcome__title">
                <h3>Welcome Admin</h3>
              </div>
            </div>
            <div className="rightBlock">
              <div className="headerRightMenu flex items-center">
                <div className="menuList srch__list--icon">
                  <Link href="#">
                    <a className="btn">
                      {/* <svg
                          width="25"
                          height="30"
                          viewBox="0 0 30 30"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                        <g id="Search"><path class="cls-1" d="M27.0215,24.6064,22.0254,19.61a9.0257,9.0257,0,1,0-1.4141,1.414l4.9961,4.9961a1,1,0,1,0,1.4141-1.4141ZM8,14a7,7,0,1,1,7,7A7.0081,7.0081,0,0,1,8,14Z" fill="#001c55"/></g></svg> */}
                    </a>
                  </Link>
                </div>
                <div className="menuList noti__list--icon">
                  <Link href="#">
                    <a className="btn">
                      {/* <svg
                          width="17"
                          height="24"
                          viewBox="0 0 20 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 0.875C8.97461 0.875 8.125 1.72461 8.125 2.75V4.88867C4.90234 5.73096 2.5 8.646 2.5 12.125V19.5957C2.5 19.5957 2.4707 20.1157 2.22168 20.5991C1.97266 21.0898 1.67236 21.5 0.625 21.5V23.375H19.375V21.5C18.2617 21.5 17.9761 21.0898 17.7417 20.6211C17.5073 20.145 17.5 19.6323 17.5 19.6323V12.125C17.5 8.646 15.0977 5.73096 11.875 4.88867V2.75C11.875 1.72461 11.0254 0.875 10 0.875ZM10 23.375C8.96729 23.375 8.125 24.2173 8.125 25.25C8.125 26.2827 8.96729 27.125 10 27.125C11.0327 27.125 11.875 26.2827 11.875 25.25C11.875 24.2173 11.0327 23.375 10 23.375ZM10 6.5C13.1201 6.5 15.625 9.00488 15.625 12.125V19.6177C15.625 19.6177 15.603 20.5112 16.0645 21.4414C16.0718 21.4634 16.0864 21.478 16.0938 21.5H3.86231C3.86963 21.4854 3.88428 21.4707 3.8916 21.4634C4.36035 20.5405 4.375 19.6543 4.375 19.6543V12.125C4.375 9.00488 6.87988 6.5 10 6.5Z"
                            fill="#060F27"
                          />
                        </svg> */}
                    </a>
                  </Link>
                </div>
                <div className="menuList logout__list--icon">
                  <Link href="/admin/logout">
                    <a className="btn">
                      &nbsp;
                      {/* <svg
                          width="30"
                          height="28"
                          viewBox="0 0 30 28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                        <g id="info"/><g id="icons"><g id="exit2"><path d="M12,10c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2s-2,0.9-2,2v4C10,9.1,10.9,10,12,10z"/><path d="M19.1,4.9L19.1,4.9c-0.3-0.3-0.6-0.4-1.1-0.4c-0.8,0-1.5,0.7-1.5,1.5c0,0.4,0.2,0.8,0.4,1.1l0,0c0,0,0,0,0,0c0,0,0,0,0,0    c1.3,1.3,2,3,2,4.9c0,3.9-3.1,7-7,7s-7-3.1-7-7c0-1.9,0.8-3.7,2.1-4.9l0,0C7.3,6.8,7.5,6.4,7.5,6c0-0.8-0.7-1.5-1.5-1.5    c-0.4,0-0.8,0.2-1.1,0.4l0,0C3.1,6.7,2,9.2,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,9.2,20.9,6.7,19.1,4.9z" fill='#001c55'/></g></g></svg> */}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
