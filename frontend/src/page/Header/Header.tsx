import React, { useState } from "react";
import "./header.css";
import { MdClose } from "react-icons/md";

const Header = React.memo(() => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegiser, setShowRegister] = useState(false);

  const handleChangeShowLogin = (value: boolean) => {
    setShowLogin(value);
  };
  const handleChangeShowRegister = (value: boolean) => {
    setShowRegister(value);
  };

  return (
    <>
      <div className="position-relative">
        <div className="d-flex justify-content-between align-items-center p-2 bg-success">
          <div className="left-header text-body-secondary">
            <h5>Đặt Vé Máy Bay</h5>
          </div>

          <div className="right-header d-flex align-items-center">
            <button className="btn m-auto">Đặt Vé</button>
            <button className="btn m-auto mx-2">Quản Lý Vé</button>
            <button
              className="btn m-auto"
              onClick={() => handleChangeShowLogin(true)}
            >
              Đăng nhập
            </button>
            <button
              className="btn a-auto mx-2"
              onClick={() => handleChangeShowRegister(true)}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {showLogin && (
          <div className="login-form position-absolute">
            <Login handleChangeShow={handleChangeShowLogin} />
          </div>
        )}
        {showRegiser && (
          <div className="register-form position-absolute">
            <Register handleChangeShow={handleChangeShowRegister} />
          </div>
        )}
      </div>
    </>
  );
});

const Login: React.FC<{ handleChangeShow: (value: boolean) => void }> =
  React.memo(({ handleChangeShow }) => {
    return (
      <>
        <div className="bg-light">
          <div className="bg-success text-light p-2 px-3 d-flex justify-content-between align-items-center">
            <h5>Đăng nhập</h5>
            <MdClose
              className="fs-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleChangeShow(false)}
            />
          </div>

          <div className="m-3">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Tài khoản
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Account"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Mật khẩu
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-success ">Đăng nhập</button>
            </div>
          </div>
        </div>
      </>
    );
  });

const Register: React.FC<{ handleChangeShow: (value: boolean) => void }> =
  React.memo(({ handleChangeShow }) => {
    return (
      <>
        <div className="bg-light">
          <div className="bg-success text-light p-2 px-3 d-flex justify-content-between align-items-center">
            <h5>Đăng ký</h5>
            <MdClose
              style={{ cursor: "pointer" }}
              className="fs-4"
              onClick={() => handleChangeShow(false)}
            />
          </div>

          <div className="m-3">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Họ và tên
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Số điện thoại
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Phone number"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Tài khoản
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Account"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Mật khẩu
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-success">Đăng ký</button>
            </div>
          </div>
        </div>
      </>
    );
  });

export default Header;
