import React, { useState, useEffect } from 'react';
import { async } from 'rxjs';
import { FormSpinner } from '../../components/Spinners/FormSpinner';
import { CompanyPersonService, userService } from '../../services';
import { toast } from 'react-toastify';

export default function AssignLockProperty(props) {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isProperty, setIsProperty] = useState([]);
  const [managerId, setPropertyManager] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    getAllCompanies();
  }, []);

  const getAllCompanies = async () => {
    const resposne = await CompanyPersonService.getAllCompanies();
    if (resposne.success) {
      setIsProperty(resposne.companies);
    } else {
      setIsProperty([]);
    }
  };

  const selectCompany = (e) => {
    if (e.target.value) {
      setPropertyManager(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoader(true);
    let lockId = props?.data?.lock?._id;
    if (managerId && lockId) {
      setErrors(null);
      const response = await userService.AssignLockToProperty(
        lockId,
        managerId
      );
      if (response.success) {
        setUpdateLoader(false);
        toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        props.editLockCloseModal();
      } else {
        setUpdateLoader(false);
        toast.error(response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      setUpdateLoader(false);
      if (managerId === null) {
        setErrors('Please select company');
      }

      if (lockId === null) {
        setErrors('Lock not selected');
      }
    }
  };
  console.log(isProperty, 'isProperty');
  return (
    <div className="form--inner">
      <div className="form--title">
        <h3>Assign lock to the property</h3>
      </div>
      <div className="user--form" onSubmit={(e) => handleSubmit(e)}>
        <form id="addLocks">
          <div className="form--item">
            <label className="form--label" htmlFor="brand">
              Select Brand
            </label>
            {props?.data?.lock?.provider}
          </div>
          <div className="form--item">
            <label className="form--label" htmlFor="lockName">
              Lock Name
            </label>
            {props?.data?.lock?.name}
          </div>
          <div className="form--item">
            <label className="form--label" htmlFor="lockModel">
              Lock Model
            </label>
            {props?.data?.lock?.unique_key}
          </div>

          <div className="form--item">
            <label className="form--label" htmlFor="lockModel">
              Property*
            </label>
            <select
              className="form--control"
              name="property"
              onChange={(e) => selectCompany(e)}
            >
              <option value="">Select Property Manager</option>
              {isProperty &&
                isProperty.length > 0 &&
                isProperty.map((item, i) => {
                  return <option value={item._id}>{item.company_name}</option>;
                })}
            </select>
            <div className="invalid-feedback">{errors}</div>
          </div>

          <div className="form--actions">
            {updateLoader ? (
              <FormSpinner />
            ) : (
              <>
                <input type="submit" className="form--submit" value="Assign" />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
