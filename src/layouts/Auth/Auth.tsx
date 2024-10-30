import React from "react";
import { Outlet } from "react-router-dom";
import "./Auth.css";

type Props = {};

const Auth: React.FC = (props: Props) => {
  return (
    <div className="registercomponent">
      <Outlet />
    </div>
  );
};

export default Auth;
