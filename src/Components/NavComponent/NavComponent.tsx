import React, { useState } from "react";
import "./NavComponent.css";
import { images } from "../../assets/img/img";
import MenuHideComponent from "../MenuHideComponent/MenuHideComponent";
import { Link } from "react-router-dom";

const NavComponent: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const menuItems = [
    { name: "TÔNG ĐỒ PHẢ HỆ", path: "/" },
    { name: "THEO DÕI SỔ QUỸ", path: "/CashTracking" },
    { name: "SỰ KIỆN GIA TỘC", path: "/EventComponent" },
    { name: "QUẢN LÝ THÀNH VIÊN", path: "/MemberComponent" },
  ];

  const toggleDiv = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div className="NavContent">
      <div className="NavImg">
        <img src={images.decor5} alt="decor" />
      </div>
      <div className="btnNav">
        <Link to={"/"}>TÔNG ĐỒ PHẢ HỆ</Link>
        <Link to={"/CashTracking"}>THEO DÕI SỔ QUỸ</Link>
        <Link to={"/EventComponent"}>SỰ KIỆN GIA TỘC</Link>
        <Link to={"/MemberComponent"}>QUẢN LÝ THÀNH VIÊN</Link>
      </div>
      <div className="btnMenuTotal">
        <div className="btnMenuLayout">
          <div className="cloud1">
            <img src={images.decor7} alt="" />
          </div>
          <div>
            <button className="btnMenu" onClick={() => toggleDiv()}>
              <img src={images.logomenu1} alt="Icon menu" />
            </button>
          </div>

          <div className="cloud2">
            <img src={images.decor8} alt="" />
          </div>
        </div>
      </div>

      <div className="NavImg">
        <img src={images.decor6} alt="decor" />
      </div>
      <div className="menuHideNav">
        {isMenuVisible && <MenuHideComponent menuItems={menuItems} />}
      </div>
    </div>
  );
};

export default NavComponent;
