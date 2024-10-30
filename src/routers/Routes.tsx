import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "../layouts/Main/Main";
import Login from "../Components/Login/Login";
import Auth from "../layouts/Auth/Auth";
import Register from "../Components/Register/Register";
import Genealogy from "../Components/Item/Genealogy/Genealogy";
import CashTracking from "../Components/Item/CashTracking/CashTracking";
import EventComponent from "../Components/Item/EventComponent/EventComponent";
import MemberComponent from "../Components/Item/Member/Member";
import RequireAuth from "../Components/RequireAuth";

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Main />}>
            <Route path="" index element={<Genealogy />} />
            <Route path="CashTracking" index element={<CashTracking />} />
            <Route path="EventComponent" index element={<EventComponent />} />
            <Route path="MemberComponent" index element={<MemberComponent />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
