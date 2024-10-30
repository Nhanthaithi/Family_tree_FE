import React from "react";
import "./CashTracking.css";

const CashTracking: React.FC = () => {
  return (
    <div className="cashTracking">
      <div className="cashHero">
        <b>SỔ QUỸ NĂM 2024</b>
      </div>
      <div className="cashLish">
        <p>
          <b>TỔNG THU: 1.200.000 đ</b>
        </p>
        <p>
          <b>TỔNG CHI: 23.000.000 đ</b>
        </p>
        <p>
          <b>TỔNG CỘNG: 12.000.000 đ</b>
        </p>
      </div>

      <table className="cashTable">
        <thead>
          <tr>
            <th>THỜI GIAN</th>
            <th>TIỀN THU</th>
            <th>TIỀN CHI</th>
            <th>NỘI DUNG</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01/01/2021</td>
            <td>+100,000</td>
            <td>-50,000</td>
            <td>DŨNG NỘP</td>
          </tr>
          <tr>
            <td>01/01/2021</td>
            <td>+100,000</td>
            <td>-50,000</td>
            <td>MUA VẬT TƯ SỬA CHỮA</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CashTracking;
