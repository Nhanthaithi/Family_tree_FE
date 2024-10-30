import React from "react";
import { images } from "../../assets/img/img";
import "./MenuHideComponent.css";
import { Link } from "react-router-dom";
import { MenuItem } from "../../types/types";

interface MenuComponentProps {
  menuItems: MenuItem[];
}

const MenuHideComponent: React.FC<MenuComponentProps> = ({ menuItems }) => {
  return (
    <div className="menuShowAndHide">
      {menuItems.map((item, index) => (
        <div key={index} className="menuShowAndHide1">
          <Link to={item.path}>
            <b>{item.name}</b>
          </Link>
        </div>
      ))}
      <div className="MenuConer11">
        <img src={images.coner9} alt="" />
      </div>
      <div className="MenuConer21">
        <img src={images.coner10} alt="" />
      </div>
      <div className="MenuConer31">
        <img src={images.coner11} alt="" />
      </div>
      <div className="MenuConer41">
        <img src={images.coner12} alt="" />
      </div>
    </div>
  );
};

export default MenuHideComponent;
