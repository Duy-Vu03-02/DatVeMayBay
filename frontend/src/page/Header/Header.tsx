import React, { useState, useContext, Dispatch } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { UserContext } from "../../Context/UserContext";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { RiH5 } from "react-icons/ri";

const Header = React.memo(() => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const { userData, setUserData } = useContext(UserContext) as {
    userData: any;
    setUserData: Dispatch<any>;
  };
  const [showRegiser, setShowRegister] = useState(false);

  const handleChangeShowLogin = (value: boolean) => {
    setShowLogin(value);
  };
  const handleChangeShowRegister = (value: boolean) => {
    setShowRegister(value);
  };
  const handleLogout = async () => {
    try {
      const url = "http://192.168.41.26:8080/auth/user/logout";
      const result = await axios.post(url, {}, { withCredentials: true });
      if (result.status === 200) {
        setUserData(null);
        navigate("/");
        window.history.go();
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <>
      <div className="position-relative">
        <div className="d-flex justify-content-between align-items-center p-2 bg-success">
          <div className="left-header text-body-secondary">
            <h5>Đặt Vé Máy Bay</h5>
          </div>

          <div className="right-header d-flex align-items-center">
            <button className="btn m-auto">
              <Link style={{ color: "black", textDecoration: "none" }} to="/">
                Đặt Vé
              </Link>
            </button>

            <button className="btn m-auto mx-2">
              <Link
                to={userData && userData.phone ? "/manager" : "/"}
                style={{ color: "black", textDecoration: "none" }}
              >
                Quản Lý Vé
              </Link>
            </button>

            {!userData ? (
              <>
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
              </>
            ) : (
              <div>
                <h5 className="btn m-auto ">{userData.username}</h5>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  đăng xuất
                </button>
              </div>
            )}
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
    const [infor, setInfor] = useState({
      account: "",
      password: "",
    });

    const { userData, setUserData } = useContext(UserContext) as {
      userData: any;
      setUserData: Dispatch<any>;
    };
    const handleChange = (e: any) => {
      setInfor((prevState) => {
        return {
          ...prevState,
          [e.target.name]: e.target.value,
        };
      });
    };

    const handleLogin = async () => {
      try {
        const user: any = infor;
        if (user.username?.trim() !== "" && user.password?.trim() !== "") {
          const url = "http://192.168.41.26:8080/auth/user/login";
          const result = await axios.post(url, user, { withCredentials: true });
          setUserData(result.data);
          handleChangeShow(false);
        }
      } catch (err) {
        console.error(err);
        return;
      }
    };

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
                onChange={handleChange}
                name="account"
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
                name="password"
                onChange={handleChange}
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-success" onClick={handleLogin}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </>
    );
  });

const Register: React.FC<{ handleChangeShow: (value: boolean) => void }> =
  React.memo(({ handleChangeShow }) => {
    const [infor, setInfor] = useState({
      username: "",
      phone: "",
      account: "",
      password: "",
    });
    const { userData, setUserData } = useContext(UserContext) as {
      userData: any;
      setUserData: Dispatch<any>;
    };

    const handlChange = (e: any) => {
      setInfor((prevState) => {
        return {
          ...prevState,
          [e.target.name]: e.target.value,
        };
      });
    };

    const handleRegister = async () => {
      try {
        if (
          infor.account?.trim() !== "" &&
          infor.phone?.trim() !== "" &&
          infor.username?.trim() !== "" &&
          infor.password?.trim() !== ""
        ) {
          const url = "http://192.168.41.26:8080/auth/user/register";

          const user = infor;
          const result = await axios.post(url, user, { withCredentials: true });

          if (result.status === 200) {
            setUserData(result.data);
            handleChangeShow(false);
          }
        }
      } catch (err) {
        console.error(err);
        return;
      }
    };

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
                onChange={handlChange}
                className="form-control"
                name="username"
                placeholder="Username"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Số điện thoại
              </span>
              <input
                type="text"
                onChange={handlChange}
                name="phone"
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
                onChange={handlChange}
                name="account"
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
                name="password"
                onChange={handlChange}
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-success" onClick={handleRegister}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </>
    );
  });

export default Header;
