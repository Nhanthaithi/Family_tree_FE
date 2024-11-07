import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { images } from "../../assets/img/img";
import { Link, useNavigate } from "react-router-dom";
import { GetformLogin } from "../../types/types";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reduce/UserSlice";
import { axiosClient } from "../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const Login: React.FC = () => {
  //==========================================================================================> gọi API để đăg xuất

  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (token) {
      axiosClient({ method: "POST", url: "/api/v1/user/logout" })
        .then(() => {
          deleteCookie("refreshToken");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userLogin");
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, []);

  //========================================================================> tạo biến
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, seterror] = useState<string>();
  const [getform, setgetform] = useState<GetformLogin>({
    email: "",
    passwords: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [statusformlogin, setstatusformlogin] = useState(1);

  //=================================================================================> validate form login
  // tạo oject rỗng để validate form login
  const [erroremail, errorsetemail] = useState("");
  const [errorpasswords, setErrorpasswords] = useState("");

  //=================================================================================> mắt ẩn hiện
  const show1 = () => {
    setShowPassword(!showPassword);
  };

  const show2 = () => {
    setShowPassword1(!showPassword1);
  };

  const show3 = () => {
    setShowPassword2(!showPassword2);
  };

  //=================================================================================> ẩn hiện form lấy password
  const setstatusform = () => {
    setstatusformlogin(2);
  };

  //========================================================================>lấy dữ liệu login để gửi đi

  const handlegetform = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      errorsetemail("");
      seterror("");
    }
    if (e.target.name === "passwords") {
      setErrorpasswords("");
      seterror("");
    }
    setgetform({
      ...getform,
      [e.target.name]: e.target.value,
    });
  };

  //========================================================================> gửi dữ liệu đi
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (getform.email === "" || getform.passwords === "") {
      if (getform.email === "") {
        errorsetemail("Email must not be blank");
      }
      if (getform.passwords === "") {
        setErrorpasswords("Password must not be blank");
      }
    } else {
      let data = await dispatch(login(getform) as any).unwrap();
      if (data.message === "Request failed with status code 401") {
        seterror("Email or password incorrect");
      } else {
        toast.success("Đăng nhập thành công", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    }
  };

  return (
    <div>
      <div className="logincomponent1">
        {statusformlogin === 1 ? (
          <>
            <form className="loginform" onSubmit={handleSubmit}>
              <div>
                <div>
                  <label htmlFor="">EMAIL</label>
                </div>
                <div className="inputForm">
                  <input
                    type="text"
                    name="email"
                    value={getform.email}
                    onChange={handlegetform}
                  />
                </div>
                <span id="spanerror">{erroremail}</span>
              </div>

              <div>
                <div>
                  <label htmlFor="">MẬT KHẨU</label>
                </div>
                <div className="validatepassword">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="passwords"
                    value={getform.passwords}
                    onChange={handlegetform}
                  />
                  <i onClick={() => show1()} id="btnshowhide1">
                    {showPassword ? (
                      <img src={images.View} alt="caption" />
                    ) : (
                      <img src={images.Hide} alt="caption" />
                    )}
                  </i>
                </div>
                <span id="spanerror">{errorpasswords}</span>
                <span id="spanerror">{error}</span>
              </div>
              <div className="btnlogin">
                <button type="submit">ĐĂNG NHẬP</button>
              </div>
            </form>
          </>
        ) : statusformlogin === 2 ? (
          <div>
            <form className="loginform">
              <label htmlFor="">EMAIL</label>
              <div className="inputForm">
                <input
                  type="text"
                  name="email"
                  id="inputemail"
                  placeholder="Xin vui lòng nhập Email"
                />
              </div>
              <span id="spanerror">getcode lỗi</span>
              <span id="spanerror">code api lỗi</span>

              <div className="btngetcode">
                <button type="submit">GỬI MÃ SỐ</button>
              </div>
            </form>
            <p id="formgetcode">* Mã số sẽ được gửi đến Email bạn vừa nhập *</p>
          </div>
        ) : (
          <form className="loginform">
            <label htmlFor="">YOUR CODE</label>
            <br />
            <input
              type="text"
              name="yourcode"
              id="inputemail"
              placeholder="Please enter your code"
            />
            <span id="spanerror">lỗi submit pass</span>
            <br />
            <label htmlFor="">NEW PASSWORD</label>
            <br />
            <div className="validatepassword">
              <input
                type={showPassword1 ? "text" : "password"}
                name="newpassword"
                id="inputemail"
                placeholder="Please enter your new password"
              />
              <i onClick={() => show2()} id="btnshowhide1">
                {showPassword1 ? (
                  <img src={images.View} alt="caption" />
                ) : (
                  <img src={images.Hide} alt="caption" />
                )}
              </i>
              <span id="spanerror">lỗi submit pas mới</span>
            </div>

            <br />
            <label htmlFor="">REPEAT PASSWORD</label>
            <br />
            <div className="validatepassword">
              <input
                type={showPassword2 ? "text" : "password"}
                name="repeatpassword"
                id="inputemail"
                placeholder="Please re-enter new password"
              />
              <i onClick={() => show3()} id="btnshowhide1">
                {showPassword2 ? (
                  <img src={images.View} alt="caption" />
                ) : (
                  <img src={images.Hide} alt="caption" />
                )}
              </i>
              <span id="spanerror">lỗi</span>
            </div>

            <div className="btngetcode">
              <button type="submit">SUBMIT</button>
            </div>
          </form>
        )}

        <div className="loginform1">
          <Link className="gotoregister" to={"/auth/register"}>
            ĐĂNG KÝ
          </Link>
          <Link className="gotoregister" to={"/"}>
            TRANG CHỦ
          </Link>
          {statusformlogin === 1 ? (
            <button id="forgotPassword" onClick={() => setstatusform()}>
              QUÊN MẬT KHẨU
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Login;
