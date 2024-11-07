import React, { useEffect, useState } from "react";
import "./SidebarComponent.css";
import { images } from "../../assets/img/img";
import MenuHideComponent from "../MenuHideComponent/MenuHideComponent";

const SidebarComponent: React.FC<{ position: "left" | "right" }> = ({
  position,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const dataUser = localStorage.getItem("userLogin");

  const menuItemsLogin = [
    { name: "THÔNG TIN TÀI KHOẢN", path: "/" },
    { name: "ĐĂNG XUẤT", path: "/auth/login" },
  ];

  const menuItemsNotLogin = [
    { name: "ĐĂNG NHẬP", path: "/auth/login" },
    { name: "ĐĂNG KÝ", path: "/auth/register" },
  ];

  //----------------------------------------------------------------> kiểm tra màn hình để xác định hình
  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước màn hình
      if (window.innerWidth <= 768) {
        // Đổi hình khi màn hình <= 768px
        setImageSrc(position === "left" ? images.dragon4 : images.dragon3);
      } else {
        // Hình mặc định khi màn hình lớn hơn 768px
        setImageSrc(position === "left" ? images.dragon1 : images.dragon2);
      }
    };

    // Gọi hàm ngay khi component mount và khi resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [position]);

  // -------------------------------------------------------------------> ẩn hiện menu
  const toggleDiv = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div>
      {position === "right" ? (
        <div className="itemLogOut">
          <div className="contentLogOut">
            <p>
              <b>Khoa Trần</b>
            </p>
          </div>

          <label htmlFor="avatar1" className="AvatarLogout">
            <input id="avatar1" type="button" onClick={() => toggleDiv()} />
            <img src={images.Avatar} alt="Icon menu" />
          </label>
        </div>
      ) : (
        position === "left" && <div className="itemLogOut1"></div>
      )}
      <div className={`HeroSidebar ${position}`}>
        <img src={imageSrc} />
      </div>
      <div className="MenuAccounts">
        {isMenuVisible &&
          (dataUser === null ? (
            <MenuHideComponent menuItems={menuItemsNotLogin} />
          ) : (
            <MenuHideComponent menuItems={menuItemsLogin} />
          ))}
      </div>
    </div>
  );
};

export default SidebarComponent;
