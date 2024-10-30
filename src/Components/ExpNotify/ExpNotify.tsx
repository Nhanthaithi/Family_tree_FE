import "./ExpNotify.css";

import React from "react";

import { Link } from "react-router-dom";

const ExpNotify: React.FC = () => {
  return (
    <div className="wrapper-exp">
      <section className="modal-exp">
        <p>Phiên đăng nhập đã hết hạn, bạn vui lòng đăng nhập lại! </p>
        <div className="expbtn">
          <Link id="btnexplogout" to="auth/login">
            ĐĂNG NHẬP
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ExpNotify;
