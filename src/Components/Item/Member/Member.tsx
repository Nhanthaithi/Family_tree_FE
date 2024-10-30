import React from "react";
import "./Member.css";
import { images } from "../../../assets/img/img";

const MemberComponent: React.FC = () => {
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
        <div className="showComment">
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
              <img src={images.dragon} alt="" />
              <img src={images.dragon} alt="" />
              <img src={images.dragon} alt="" />
              <img src={images.dragon} alt="" />
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
        <div className="memberContent">
          <div className="imgShowTotal">
            <div className="imgShow">
              <div className="imgDelete">
                <img src={images.Delete} alt="" />
              </div>
              <img src={images.dragon} alt="" />
            </div>
          </div>

          <div className="memberComment">
            <form action="" className="memberCommentForm">
              <label htmlFor="avatar1">
                <input id="avatar1" type="file" name="image" />
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
  );
};

export default MemberComponent;
