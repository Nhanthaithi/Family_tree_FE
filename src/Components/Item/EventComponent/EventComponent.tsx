import React from "react";
import "./EventComponent.css";

const EventComponent: React.FC = () => {
  return (
    <div className="EventLayout">
      <div className="EventHero">
        <b>SỰ KIỆN NĂM 2024</b>
      </div>
      <table className="eventTable">
        <thead>
          <tr>
            <th>THỜI GIAN</th>
            <th>TÊN SỰ KIỆN</th>
            <th>NỘI DUNG</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01/01/2021</td>
            <td>GIỖ TỔ TỘC</td>
            <td>THÔN KỲ LAM - ĐIỆN BÀN</td>
          </tr>
          <tr>
            <td>01/01/2021</td>
            <td>XÂY DỰNG TỪ ĐƯỜNG</td>
            <td>THÔN KỲ LAM - ĐIỆN BÀN</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EventComponent;
