import React, { useState } from "react";
import "./Member.css";
import { images } from "../../../assets/img/img";

const MemberComponent: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [imageAvartar, setImageAvartar] = useState("");
  // =======================================================================> test hình ảnh thể hiện
  const dataImg = [
    { src: images.testImg },
    { src: images.testImg },
    { src: images.backgroud4 },
    { src: images.testImg },
  ];

  const imageCount = dataImg.length;

  // ======================================================================> tạo ô chứa ảnh tạm
  const handleImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImageAvartar(selectedFile);
      setSelectedImage((prevImages: any[]) =>
        prevImages.concat(URL.createObjectURL(selectedFile))
      );
    }
  };

  console.log(selectedImage);

  return (
    <div className="MemberComponent">
      <div className="memberquantityTotal">
        <div className="memberquantity1">
          <div className="memberquantity">
            <div className="memberImage">
              <img src={images.Avatar} alt="" />
            </div>
            <div className="memberName">
              <p>
                <b>trần đăng khoa</b>
              </p>
            </div>
          </div>
          <div className="memberStatus"></div>
        </div>
      </div>
      {/* phần card bình luận */}
      <div className="memberContentHero">
        <div className="memberContent">
          <div className="Comment">
            <div>
              <div className="userComment">
                <div className="imgAvataruserComent">
                  <img src={images.Avatar} alt="" />
                </div>

                <p>
                  <b>trần đăng khoa :</b>
                </p>
              </div>

              <p>chúc mừng năm mới, merry chrismax </p>
            </div>
            <div className="imgComment">
              <div className={`imgComment imgComment-${imageCount}`}>
                {dataImg.map((image, index) => (
                  <img key={index} src={image.src} alt={`Image ${index + 1}`} />
                ))}
              </div>
            </div>

            <div className="numberOfLikes">
              <p>
                <b>5 lượt thích</b>
              </p>

              <p>
                <b>5 lượt Bình luận</b>
              </p>
            </div>
            <div className="btnLike">
              <button>THÍCH</button>
              <button>BÌNH LUẬN</button>
            </div>
            <div className="showCommentTotal">
              <div className="CommentTitel">
                <div className="CommentTitel1">
                  <div className="showCommentAvartar">
                    <img src={images.Avatar} alt="" />
                  </div>

                  <b>TRẦN ĐĂNG KHOA</b>
                </div>
                <div className="CommentTitel2">
                  <p>
                    hình đẹp quá Nếu vẫn không hoạt động, hãy thử kiểm tra trên
                    các trình duyệt khác hoặc xóa bộ nhớ cache để đảm bảo không
                    có vấn đề nào Nếu vẫn không hoạt động, hãy thử kiểm tra trên
                    các trình duyệt khác hoặc xóa bộ nhớ cache để đảm bảo không
                    có vấn đề nào do bộ nhớ cache của trình duyệt gây ra. do bộ
                    nhớ cache của trình duyệt gây ra.hình đẹp quá Nếu vẫn không
                    hoạt động, hãy thử kiểm tra trên các trình duyệt khác hoặc
                    xóa bộ nhớ cache để đảm bảo không có vấn đề nào Nếu vẫn
                    không hoạt động, hãy thử kiểm tra trên các trình duyệt khác
                    hoặc xóa bộ nhớ cache để đảm bảo không có vấn đề nào do bộ
                    nhớ cache của trình duyệt gây ra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* phần nhập bình luận */}
        <div className="memberContent1">
          <div className="memberContentTotal">
            {selectedImage.length > 0 && (
              <div className="memberImg">
                {selectedImage.map((image, index) => (
                  <div className="imgShowTotal" key={index}>
                    <div className="imgShow">
                      <button className="imgDelete">
                        <img src={images.Delete} alt="" />
                      </button>
                      <img src={image} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="memberComment">
              <form action="" className="memberCommentForm">
                <label htmlFor="avatar1">
                  <input
                    id="avatar1"
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                  />
                  <i className="fa-solid fa-paperclip"></i>
                </label>

                <input type="text" name="" id="" />
                <button className="btnCommentForm">
                  <i
                    className="fa-solid fa-paper-plane fa-beat"
                    style={{ color: "#ABBE67" }}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberComponent;
