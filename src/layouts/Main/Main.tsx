import React from "react";
import "./Main.css";
import HeaderComponent from "../../Components/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../Components/SidebarComponent/SidebarComponent";
import NavComponent from "../../Components/NavComponent/NavComponent";
import { Outlet } from "react-router-dom";

const Main: React.FC = () => {
  return (
    <div className="layout-container">
      <HeaderComponent />
      <NavComponent />
      <div className="layout-sidebar">
        <div className="sidebar">
          <SidebarComponent position="left" />
        </div>
        <Outlet />
        <div className="sidebar">
          <SidebarComponent position="right" />
        </div>
      </div>
    </div>
  );
};

export default Main;
