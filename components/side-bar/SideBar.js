import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SideBar() {
  const router = useRouter();
  const route = router.pathname.split('/');
  const rout = route[2];

  const [openMenu, setOpenMenu] = useState(false);
  const [openMenu1, setOpenMenu1] = useState(false);
  const [openMenu2, setOpenMenu2] = useState(false);
  const [openMenu3, setOpenMenu3] = useState(false);
  const [openMenu4, setOpenMenu4] = useState(false);
  const [openMenu5, setOpenMenu5] = useState(false);
  const [openMenu6, setOpenMenu6] = useState(false);
  const [openMenu7,setOpenMenu7]=useState(false)
  const [openMenu8,setOpenMenu8]=useState(false)
  const [openMenu9,setOpenMenu9]=useState(false)
  const [openMenu10,setOpenMenu10]=useState(false)








  const [closeNav, setCloseNav] = useState(false);

  useEffect(() => {
    if (rout === 'guests' || rout === 'property-managers') {
      setOpenMenu(true);
    }
  }, [rout]);
 
  return (
    <div className={closeNav ? 'pageWrapper closeNav' : 'pageWrapper'}>
      <nav className={closeNav ? 's-sidebar__nav navClose' : 's-sidebar__nav'}>
        <div className="site--logo">
          <div className="logo--image">
            <Link href="/admin/dashboard">
              <a>
                <img src="../../images/main-logo.svg" alt="Logo" />
              </a>
            </Link>
          </div>
        </div>
        <ul>
          <li className={rout === 'dashboard' ? 'active' : ''}>
            <Link href="/admin/dashboard">
              <a className="s-sidebar__nav-link">
                <svg
                  width="27"
                  height="22"
                  viewBox="0 0 27 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.8125 0.75C1.26709 0.75 0 2.01709 0 3.5625V18.5625C0 20.1079 1.26709 21.375 2.8125 21.375H23.4375C24.9829 21.375 26.25 20.1079 26.25 18.5625V3.5625C26.25 2.01709 24.9829 0.75 23.4375 0.75H2.8125ZM2.8125 2.625H23.4375C23.5034 2.625 23.5547 2.64697 23.6133 2.66162L13.125 9.91992L2.63672 2.66162C2.69531 2.64697 2.74658 2.625 2.8125 2.625ZM1.875 4.41211L13.125 12.2051L24.375 4.41211V18.5625C24.375 19.0898 23.9648 19.5 23.4375 19.5H2.8125C2.28516 19.5 1.875 19.0898 1.875 18.5625V4.41211Z"
                    fill="#ffffff"
                  />
                </svg>{' '}
                <span>Dashboard</span>{' '}
              </a>
            </Link>
          </li>{' '}
          <li
            className={
              openMenu ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Users</span>{' '}
            </span>{' '}
            {openMenu && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Users</a>
                  </Link>
                </li> */}
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/users">
                    <a>All Users</a>
                  </Link>
                </li>

                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-userlogs">
                    <a>User Logs</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '}

          <li
            className={
              openMenu1 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu1(!openMenu1)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Holiday List</span>{' '}
            </span>{' '}
            {openMenu1 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Users</a>
                  </Link>
                </li> */}
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-holidays">
                    <a>Holiday</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '}
          <li
            className={
              openMenu2 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu2(!openMenu2)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Subscription List</span>{' '}
            </span>{' '}
            {openMenu2 && (
              <ul className="sub__navMenu">
               
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-subscription">
                    <a>Subscription</a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/gift-users">
                    <a>Gift Users</a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/all-giftedUsers">
                    <a>View Gifted Users</a>
                  </Link>
                </li>

                <li>
                  <Link href="/admin/discount-code">
                    <a>Create Discount Code</a>
                  </Link>
                </li>

                <li>
                  <Link href="/admin/discount-subscription">
                    <a>Apply Discount </a>
                  </Link>
                </li>

                
              </ul>
            )}
          </li>{' '}
          <li
            className={
              openMenu3 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu3(!openMenu3)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Competition List</span>{' '}
            </span>{' '}
            {openMenu3 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Users</a>
                  </Link>
                </li> */}
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-games">
                    <a>Competition</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '}
          <li
            className={
              openMenu4 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu4(!openMenu4)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Refferal List</span>{' '}
            </span>{' '}
            {openMenu4 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Users</a>
                  </Link>
                </li> */}
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-refferal">
                    <a>All Refferal</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/refferal-rule">
                    <a>Refferal Rule</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '}
          <li
            className={
              openMenu5 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu5(!openMenu5)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Stock</span>{' '}
            </span>{' '}
            {openMenu5 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Stocks</a>
                  </Link>
                </li> */}
               
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-stock">
                    <a>All Stock</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/stock-rule">
                    <a>Stock Rule</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '} 
          <li
            className={
              openMenu7 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu7(!openMenu7)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Order</span>{' '}
            </span>{' '}
            {openMenu7 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Stocks</a>
                  </Link>
                </li> */}
               
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-pending">
                    <a>Pending Order</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-failed">
                    <a>Failed Order</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-cancel">
                    <a>Cancel Order</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-holding">
                    <a>Holding Order</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-short">
                    <a>Short Order</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '} 
          <li
            className={
              openMenu6 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu6(!openMenu6)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Accounting</span>
            </span>{' '}
            {openMenu6 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Stocks</a>
                  </Link>
                </li> */}
               
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-transaction">
                    <a>All Request</a>
                  </Link>
                </li>
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/bank-details">
                    <a>User Bank Details</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '} 
          <li
            className={
              openMenu8 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu8(!openMenu8)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Help & Support</span>
            </span>{' '}
            {openMenu8 && (
              <ul className="sub__navMenu">
                {/* <li className={rout === "all-users" ? "active" : ""}>
                  <Link href="/admin/users">
                    <a>All Stocks</a>
                  </Link>
                </li> */}
               
                <li className={rout === 'users' ? 'active' : ''}>
                  <Link href="/admin/all-help-support">
                    <a>All Support List</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>{' '} 
          <li
            className={
              openMenu9 ? 'openMenu has__sub--navMenu' : 'has__sub--navMenu'
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu9(!openMenu9)}
            >
              <svg
                width="19"
                height="22"
                viewBox="0 0 19 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.375 0.75C6.27685 0.75 3.75 3.27685 3.75 6.375C3.75 9.47314 6.27685 12 9.375 12C12.4731 12 15 9.47314 15 6.375C15 3.27685 12.4731 0.75 9.375 0.75ZM9.375 12C4.21143 12 0 16.2114 0 21.375H1.875C1.875 17.2222 5.22217 13.875 9.375 13.875C13.5278 13.875 16.875 17.2222 16.875 21.375H18.75C18.75 16.2114 14.5386 12 9.375 12ZM9.375 2.625C11.4551 2.625 13.125 4.29492 13.125 6.375C13.125 8.45508 11.4551 10.125 9.375 10.125C7.29492 10.125 5.625 8.45508 5.625 6.375C5.625 4.29492 7.29492 2.625 9.375 2.625Z"
                  fill="#ffffff"
                />
              </svg>{' '}
              <span>Learning</span>
            </span>{' '}
            {openMenu9 && (
              <ul className="sub__navMenu">
              <li className={rout === 'learning-list' ? 'active' : ''}>
                  <Link href="/admin/category-list">
                    <a>Category List</a>
                  </Link>
                </li>
               
                <li className={rout === 'learning-list' ? 'active' : ''}>
                  <Link href="/admin/learning-list">
                    <a>Learning List</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            className={
              openMenu10 ? "openMenu has__sub--navMenu" : "has__sub--navMenu"
            }
          >
            <span
              className="s-sidebar__nav-link"
              onClick={() => setOpenMenu10(!openMenu10)}
            >
              <svg
                fill="none"
                height="512"
                viewBox="0 0 512 512"
                width="512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M462.34 210.42L436.29 203.31C434.252 196.713 431.852 190.233 429.1 183.9L449 140.95C452.611 133.152 453.614 124.398 451.862 115.985C450.109 107.573 445.694 99.9477 439.27 94.24L424.71 81.3C417.929 75.272 409.301 71.7283 400.241 71.2504C391.181 70.7725 382.227 73.3888 374.85 78.67L350.85 95.84C339.554 89.2358 327.599 83.8298 315.18 79.71L307.75 52.47C305.441 44.007 300.413 36.5379 293.442 31.2128C286.471 25.8877 277.942 23.002 269.17 23H249.4C240.624 22.9976 232.091 25.8813 225.116 31.2068C218.141 36.5322 213.11 44.0037 210.8 52.47L203.99 77.47C188.999 81.7704 174.604 87.9282 161.14 95.8L137.27 78.71C129.893 73.4288 120.939 70.8125 111.879 71.2904C102.819 71.7683 94.1907 75.312 87.41 81.34L72.84 94.28C66.4175 99.9889 62.0042 107.614 60.2535 116.027C58.5029 124.44 59.508 133.193 63.12 140.99L82.87 183.63C80.0644 190.062 77.6207 196.645 75.55 203.35L49.55 210.46C41.0772 212.753 33.5937 217.77 28.2537 224.736C22.9136 231.703 20.0134 240.232 20 249.01V268.8C20.0004 277.575 22.8866 286.107 28.2137 293.081C33.5409 300.054 41.0135 305.082 49.48 307.39L75.48 314.5C77.2333 320.147 79.2333 325.677 81.48 331.09L63.12 370.8C59.508 378.597 58.5029 387.35 60.2535 395.763C62.0042 404.176 66.4175 411.801 72.84 417.51L87.41 430.46C94.1919 436.486 102.821 440.028 111.881 440.504C120.941 440.981 129.894 438.362 137.27 433.08L156.59 419.25C171.862 428.753 188.422 436.011 205.76 440.8L210.76 459.28C213.063 467.762 218.095 475.25 225.079 480.586C232.064 485.921 240.611 488.808 249.4 488.8H269.17C277.945 488.8 286.477 485.913 293.451 480.586C300.424 475.259 305.452 467.786 307.76 459.32L313.39 438.66C328.139 433.931 342.247 427.395 355.39 419.2L374.84 433.12C382.216 438.403 391.169 441.021 400.229 440.544C409.289 440.068 417.918 436.526 424.7 430.5L439.26 417.55C445.695 411.841 450.117 404.209 451.872 395.788C453.626 387.367 452.619 378.604 449 370.8L430.43 330.8C432.623 325.467 434.577 320.04 436.29 314.52L462.34 307.42C470.81 305.109 478.284 300.075 483.609 293.096C488.935 286.117 491.817 277.579 491.81 268.8V249.01C491.81 240.236 488.925 231.705 483.6 224.732C478.275 217.759 470.805 212.73 462.34 210.42V210.42ZM256 383.8C231.277 383.8 207.11 376.469 186.554 362.734C165.998 348.999 149.976 329.476 140.515 306.635C131.054 283.795 128.579 258.661 133.402 234.414C138.225 210.166 150.13 187.893 167.612 170.412C185.093 152.93 207.366 141.025 231.614 136.202C255.861 131.379 280.995 133.854 303.835 143.315C326.676 152.776 346.199 168.798 359.934 189.354C373.669 209.91 381 234.077 381 258.8C380.963 291.941 367.781 323.713 344.347 347.147C320.913 370.581 289.141 383.763 256 383.8V383.8Z"
                  fill="black"
                />
              </svg>{" "}
              <span>Settings</span>{" "}
            </span>
            {openMenu10 && (
              <ul className="sub__navMenu">
                <li>
                  <Link href="/admin/change-password">
                    <a>Change password</a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/news-rule">
                    <a>News Rule</a>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>{' '}
        <div className="userInfo">
          <div className="user__pic">
            <img src="/images/lock-img.png" alt="User" />
          </div>{' '}
          <div className="user__detail-data">
            {/* <span className="user__msg">
              <Link href="#"> Good Morning, </Link>{" "}
            </span>{" "} */}
            <div className="flex flex-wrap">
              <span className="user__name"> Adam </span>{' '}
              {/* <span className="btn btnBlue"> Standard User </span>{" "} */}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        <div className="integrator">
          <span className="btn btnBlue">Admin</span>
        </div>
      </nav>{' '}
      <div
        className={closeNav ? 'sidebarToggle activeToggle' : 'sidebarToggle'}
      >
        <span
          className="sidebarToggleBtn"
          onClick={() => setCloseNav(!closeNav)}
        ></span>
      </div>
    </div>
  );
}
