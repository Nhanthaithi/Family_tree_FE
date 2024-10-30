import "./Register.css";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { images } from "../../assets/img/img";
import { Link, useNavigate } from "react-router-dom";
import { GetformRegister } from "../../types/types";
import { toast, ToastContainer } from "react-toastify";
import { register } from "../../redux/reduce/UserSlice";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState("");
  const [imageAvartar, setImageAvartar] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ẩn hiện mắt password
  const show1 = () => {
    setShowPassword(!showPassword);
  };

  //tạo oject rỗng chứa from
  const [getform, setgetform] = useState<GetformRegister>({
    fullname: "",
    email: "",
    passwords: "",
    phoneNumber: "",
  });

  // tạo oject rỗng để validate
  const [fullname, setfullname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");

  //  chức năng lấy dữ liệu từ form
  const handlegetform = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "fullname") {
      setfullname("");
    }
    if (e.target.name === "email") {
      setErrorEmail("");
    }
    if (e.target.name === "passwords") {
      setErrorPass("");
    }
    if (e.target.name === "phoneNumber") {
      setphoneNumber("");
    }
    setgetform({ ...getform, [e.target.name]: e.target.value });
  };

  // chuyển hướng đăng nhập thành công
  const returnHome = () => {
    navigate("/auth/login");
  };

  //tạo link ảnh tạm thời
  const handleImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImageAvartar(selectedFile);
      setSelectedImage(URL.createObjectURL(selectedFile) as any);
    }
  };

  // kiểm tra validate và chuyển dữ liệu đi
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      getform.fullname === "" ||
      getform.email === "" ||
      getform.passwords === "" ||
      getform.phoneNumber === ""
    ) {
      if (getform.fullname === "") {
        setfullname("USERNAME MUST NOT BE BLANK");
      }
      if (getform.email === "") {
        setErrorEmail("EMAIL MUST NOT BE BLANK");
      }
      if (getform.passwords === "") {
        setErrorPass("PASSWORDS MUST NOT BE BLANK");
      }
      if (getform.phoneNumber === "") {
        setphoneNumber("PHONE NUMBER MUST NOT BE BLANK");
      }
    } else {
      const formdata = new FormData(); // Tạo đối tượng FormData để đưa dữ liệu và file vào

      // Đưa các trường thông tin sản phẩm vào FormData
      formdata.append("imageAvartar", imageAvartar);
      formdata.append("fullname", getform.fullname);
      formdata.append("email", getform.email);
      formdata.append("passwords", getform.passwords);
      formdata.append("phoneNumber", getform.phoneNumber);

      const data = await dispatch(register(formdata) as any).unwrap();

      if (data?.status === 200) {
        toast.success("Register in successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        data && setTimeout(returnHome, 2000);
      } else {
        toast.error(data?.response?.data?.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="registercomponent1">
        <form
          className="registerform"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="totalformchooseavatar">
            <div className="formchooseavatar">
              <label htmlFor="" id="labelavatar2">
                ẢNH ĐẠI DIỆN
              </label>
              <label htmlFor="avatar1" id="labelavatar1">
                <input
                  id="avatar1"
                  type="file"
                  name="imageAvartar"
                  onChange={handleImageChange}
                />
                CHỌN ẢNH
              </label>
            </div>
            <div className="imageAvatar">
              {selectedImage && <img src={selectedImage} alt="Selected" />}
            </div>
          </div>

          <label htmlFor="">HỌ VÀ TÊN</label>
          <br />
          <input type="text" name="fullname" onChange={handlegetform} />
          <span>{fullname}</span>
          <br />
          <label htmlFor="">EMAIL</label>
          <br />
          <input type="text" name="email" onChange={handlegetform} />
          <span>{errorEmail}</span>
          <br />
          <label htmlFor="">MẬT KHẨU</label>
          <br />
          <div className="validateregister">
            <input
              type={showPassword ? "text" : "password"}
              name="passwords"
              onChange={handlegetform}
            />
            <i onClick={() => show1()} id="btnshowhide2">
              {showPassword ? (
                <img src={images.View} alt="caption" />
              ) : (
                <img src={images.Hide} alt="caption" />
              )}
            </i>
            <span>{errorPass}</span>
          </div>

          <br />
          <label htmlFor="">SỐ ĐIỆN THOẠI</label>
          <br />
          <input type="text" name="phoneNumber" onChange={handlegetform} />
          <span>{phoneNumber}</span>
          <br />
          <div className="btnregister1">
            <div className="btnregister">
              <button type="submit">ĐĂNG KÝ</button>
            </div>
          </div>

          <div className="btnnextpage">
            <Link className="gotohome" to={"/auth/Login"}>
              ĐĂNG NHẬP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
