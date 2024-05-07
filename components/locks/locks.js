import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import getConfig from 'next/config';
import { userService } from '../../services';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import EditLock from './editLock';
import AssignLock from './assignLock';
export default function AllLocks(props) {
  const notificationRef = useRef();
  const [tableAction, setTableAction] = useState(false);
  const [isUserToggle, setIsUserToggle] = useState();
  const [editLockForm, setEditLockForm] = useState(false);
  const [isSingleLockData, setIsSingleLockData] = useState('');
  const [isAssignLock, setIsAssignLock] = useState(false);
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}`;
  useEffect(() => {
    const closeNotificationPopup = (event) => {
      if (
        event.target.innerText != 'View Lock' &&
        event.target.innerText != 'Assign Lock' &&
        event.target.innerText != 'Delete Lock' &&
        !event.target.classList.contains('tableActions') &&
        !event.target.classList.contains('three--vertical--dots')
      ) {
        setIsUserToggle(false);
        //console.log('dfsdfds');
      }
    };
    document.body.addEventListener('click', closeNotificationPopup, false);
    return () =>
      document.body.addEventListener('click', closeNotificationPopup, false);
  }, []);

  const confirmDelete = (lockId) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteLock(lockId),
        },
        {
          label: 'No',
        },
      ],
    });
  };
  const deleteLock = async (lockId) => {
    let response = await userService.deleteLock(lockId);
    if (response.success) {
      toast.success(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      props.allAdminLocks();
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const editLockCloseModal = () => {
    props.allAdminLocks();
    setEditLockForm(false);
    setIsSingleLockData('');
    setIsAssignLock(false);
  };
  return (
    <>
      <div className="table--layout">
        <table>
          <thead>
            <tr>
              <th style={{ width: '3rem' }} className="sorting__disabled">
                <input type="checkbox" name="select--all" />
              </th>
              <th style={{ width: '4rem' }} className="asc">
                Sr.
              </th>
              <th className="desc">Brand</th>
              <th className="asc desc">Lock ID</th>
              <th>Lock Name</th>
              <th>Assign To</th>
              <th>Battery Level</th>
              <th style={{ width: '8rem' }}>Status</th>
              <th style={{ width: '4rem' }} className="sorting__disabled">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {props.data.userLocks &&
              props.data.userLocks.length > 0 &&
              props.data.userLocks.map((lock, inx) => {
                let batterylevel = '';
                if (lock?.lock?.battery_level === 0) {
                  batterylevel = '/images/full-battery.svg';
                } else if (lock?.lock?.battery_level === 1) {
                  batterylevel = '/images/medium-battery.svg';
                } else if (lock?.lock?.battery_level === 2) {
                  batterylevel = '/images/low-battery.svg';
                } else if (lock?.lock?.battery_level === 3) {
                  batterylevel = '/images/very-low-battery.svg';
                }
                return (
                  <tr key={inx}>
                    <td>
                      <input type="checkbox" name="select--all" />
                    </td>
                    <td>{inx + 1}</td>
                    <td>
                      {lock.lock.provider === 'chinese'
                        ? 'Rayonics'
                        : lock.lock.provider}
                    </td>
                    <td>{lock.lock.unique_key}</td>
                    <td>
                      <div className="lock--info">
                        <div className="lock--image">
                          {lock.lock.image && (
                            <img src={`${baseUrl}/${lock.lock.image}`} />
                          )}
                          {!lock.lock.image && (
                            <img
                              src="/images/lock-img.png"
                              layout="responsive"
                              width={150}
                              height={200}
                            />
                          )}
                        </div>
                        <p>{lock.lock.name}</p>
                      </div>
                    </td>
                    <td>{lock.alloted_to?.name}</td>
                    <td className="" style={{ paddingRight: '2rem' }}>
                      {batterylevel != '' ? <img src={batterylevel} /> : 'N/A'}
                    </td>
                    <td>
                      {lock.lock.status === 1 ? (
                        <span className="status--active lock--status">
                          Active
                        </span>
                      ) : (
                        <span className="status--in-active lock--status">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className="three--vertical--dots"
                        onClick={() => {
                          setTableAction(!tableAction),
                            setIsUserToggle(lock.lock._id);
                        }}
                        ref={notificationRef}
                      >
                        <span
                          onClick={() => {
                            setTableAction(!tableAction),
                              setIsUserToggle(lock.lock._id);
                          }}
                        ></span>
                        <span
                          onClick={() => {
                            setTableAction(!tableAction),
                              setIsUserToggle(lock.lock._id);
                          }}
                        ></span>
                        <span
                          onClick={() => {
                            setTableAction(!tableAction),
                              setIsUserToggle(lock.lock._id);
                          }}
                        ></span>
                      </span>
                      {tableAction && isUserToggle === lock.lock._id ? (
                        <span className="tableActions" key={isUserToggle}>
                          {/* <Link href="javascript:void(0)">
                            <a className="view__lock">View Lock</a>
                          </Link> */}
                          {lock.alloted_to?.name === 'NA' ? (
                            <Link href="javascript:void(0)">
                              <a
                                className="assign__lock"
                                onClick={() => {
                                  setIsAssignLock(true),
                                    setIsSingleLockData(lock);
                                }}
                              >
                                Assign Lock
                              </a>
                            </Link>
                          ) : (
                            ''
                          )}
                          {lock.lock.provider === 'chinese' ? (
                            <Link href="javascript:void(0)">
                              <a
                                className="edit__detail"
                                onClick={() => {
                                  setEditLockForm(true),
                                    setIsSingleLockData(lock);
                                }}
                              >
                                Edit Lock
                              </a>
                            </Link>
                          ) : (
                            ''
                          )}
                          <Link href="javascript:void(0)">
                            <a
                              className="delete__lock"
                              onClick={() => {
                                confirmDelete(lock.lock._id);
                              }}
                            >
                              Delete Lock
                            </a>
                          </Link>
                        </span>
                      ) : (
                        ' '
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {/* Add Lock Form */}
      {editLockForm && <div className="layout--overlay--bg"></div>}
      <div
        className={editLockForm ? 'form--layout form--active' : 'form--layout'}
      >
        <div
          className="form__close"
          onClick={() => setEditLockForm(!editLockForm)}
        >
          X
        </div>
        {editLockForm && (
          <EditLock
            data={isSingleLockData}
            editLockCloseModal={editLockCloseModal}
          />
        )}
      </div>

      {/* Assign Lock Form */}
      {isAssignLock && <div className="layout--overlay--bg"></div>}
      <div
        className={isAssignLock ? 'form--layout form--active' : 'form--layout'}
      >
        <div
          className="form__close"
          onClick={() => setIsAssignLock(!isAssignLock)}
        >
          X
        </div>
        {isAssignLock && (
          <AssignLock
            data={isSingleLockData}
            editLockCloseModal={editLockCloseModal}
          />
        )}
      </div>
    </>
  );
}
