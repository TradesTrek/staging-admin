import React, { useState, useRef } from 'react';
import { userService } from '../../services';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function LoginView() {
  const [btnStatus, setBtnStatus] = useState(false);
  const router = useRouter();
  const toastId = useRef(null);
const [showPassword,setShowPassword]=useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  function onSubmit({ email, password }) {
    setBtnStatus(true);
  
    userService
      .login(email, password)
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          router.push('/admin/dashboard');
        } else {
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.error(res.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          setBtnStatus(false);
        }
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setBtnStatus(false);
      });
  }

  return (
    <div className="pageWrapper signUpProcess">
      <div className="signUp mb-12">
        <div className="bgWhite">
          <h3 className="font-20 mb-2">Sign in to your account</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tabLogin">
              <div className="tabDataWrapper">
                <div className="form_group">
                  <div className="form-item">
                    <input
                      type="email"
                      placeholder="Email"
                      {...register('email',{required:true})}
                      className={`form-control ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.email?.message}
                    </div>
                  </div>
                </div>
                <div className="form_group">
                  <div className="form-item">
                   <div className='passwordIcon'>
                   <input
                   style={{width:'100%'}}
                      type={showPassword?'text':"password"}
                      placeholder="Password"
                      {...register('password',{required:true})}
                      className={`form-control ${
                        errors.password ? 'is-invalid' : ''
                      }`}
                    />
                {showPassword?<img src='/images/view.png' className='passwordView' onClick={()=>setShowPassword(!showPassword)}/>:<img onClick={()=>setShowPassword(!showPassword)} src='/images/invisible.png' className='passwordView'/>}

                   </div>
                    <div className="invalid-feedback">
                      {errors.password?.message}
                    </div>
                  </div>
                </div>
                <div className="btnBlue fullW mt-6">
                  <button
                    type="submit"
                    className="btn btnBgBlue"
                    disabled={btnStatus}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
