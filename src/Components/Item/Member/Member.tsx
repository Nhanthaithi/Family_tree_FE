import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./Member.css";
import { images } from "../../../assets/img/img";
import {
  typeGetArticle,
  typeImageVideo,
  typeMedia,
} from "../../../types/types";
import { axiosClient } from "../../../api/axiosClient";
import { toast } from "react-toastify";

const MemberComponent: React.FC = () => {
  const dataUser = localStorage.getItem("userLogin");
  const userId = dataUser ? JSON.parse(dataUser)?.id : null;
  const useRole = dataUser ? JSON.parse(dataUser)?.role : null;
  const [selectedImageVideo, setSelectedImageVideo] = useState<
    typeImageVideo[]
  >([]);
  const [dataServer, setdataServer] = useState<typeGetArticle[]>([]);
  const [ImageVideo, setImageVideo] = useState<File[]>([]);
  const [content, setcontent] = useState("");
  const [ErrorFile, setErrorFile] = useState("");
  const [flag, setFlag] = useState(false);
  const [statusArticle, setstatusArticle] = useState(1);
  const [idArticle, setidArticle] = useState<number | null>();

  // ============================================================================================> hàm gọi data từ server
  useEffect(() => {
    const fetchDataFromServer = async () => {
      const data = await axiosClient.get(`api/v1/Article/getAllArticle`);
      setdataServer(data.data.data);
      setFlag(false);
    };

    fetchDataFromServer();
  }, [flag]);

  // ======================================================================> tạo ô chứa ảnh video tạm
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Chuyển file list thành array

      // Kiểm tra tổng dung lượng
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }

      const maxSize = 15 * 1024 * 1024; // Giới hạn dung lượng là 15MB
      if (totalSize > maxSize) {
        setErrorFile("Tổng dung lượng vượt quá 15MB");
        return;
      }
      setErrorFile("");

      // Lấy URL tạm thời cho tất cả file đã chọn
      const newSelectedFiles = files.map((file) => {
        const fileType = file.type.split("/")[0]; // "image" hoặc "video"
        const fileUrl = URL.createObjectURL(file);
        return { url: fileUrl, type: fileType };
      });

      // Cập nhật state với danh sách file mới
      setSelectedImageVideo((prevImages: typeImageVideo[]) => [
        ...prevImages,
        ...newSelectedFiles,
      ]);

      setImageVideo((prevImages: File[]) => [...prevImages, ...files]);
    }
  };

  useEffect(() => {
    return () => {
      selectedImageVideo.forEach((file) => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [flag]);

  //  ======================================================================> xóa ảnh video trong ô chứa video và ảnh tạm
  const handleDeleteImageVideo = (index: number) => {
    setSelectedImageVideo((prevImages: typeImageVideo[]) =>
      prevImages.filter((_, i) => i !== index)
    );
    setImageVideo((prevImages: File[]) =>
      prevImages.filter((_, i) => i !== index)
    );
    setErrorFile("");
  };

  // ======================================================================> hàm change nội dung
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setcontent(e.target.value);
  };

  // ======================================================================> hàm add bài viết

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", content);
    ImageVideo.forEach((file: any) => {
      formData.append("mediaFiles", file);
    });

    try {
      const data = await axiosClient.post(
        `/api/v1/Article/postArticle`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFlag(true);
      setSelectedImageVideo([]);
      setImageVideo([]);
      setcontent("");
      toast.success(data.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("đăng bài dữ liệu thất bại", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleComment = (id: number | undefined) => {
    setstatusArticle(2);
    setidArticle(id);
  };

  const handlePostComment = async () => {
    const dataForm = { content: content, userId: userId, postId: idArticle };
    try {
      const data = await axiosClient.post(
        `/api/v1/Comment/postComment`,
        dataForm
      );
      setFlag(true);
      setcontent("");
      setstatusArticle(1);
      setidArticle(null);
      toast.success(data.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("đăng bình luận thất bại", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleLike = async (id: number | undefined) => {
    const dataLike = { userId: userId, postId: id };
    try {
      await axiosClient.post(`/api/v1/Likes/postLike`, dataLike);
      setFlag(true);
    } catch (error) {}
  };

  const handleUnLike = async (id: number | undefined) => {
    try {
      await axiosClient.delete(`/api/v1/Likes/deleteLike/${id}`);
      setFlag(true);
    } catch (error) {}
  };

  const handleDeleteArticle = async (id: number | undefined) => {
    try {
      await axiosClient.delete(`/api/v1/Article/DeleteArticle/${id}`);
      setFlag(true);
    } catch (error) {}
  };

  const handleEditArticle = async (id: number | undefined) => {
    try {
      const data = await axiosClient.get(`/api/v1/Article/getOneArticle/${id}`);
      const article = data.data.data;
      setidArticle(article.id);
      setcontent(article.content);
      setSelectedImageVideo(article.mediaFiles);
      setImageVideo(article.mediaFiles);
      setstatusArticle(3);
    } catch (error) {}
  };

  const handleDeleteComment = async (id: number | undefined) => {
    try {
      await axiosClient.delete(`/api/v1/Comment/DeleteComment/${id}`);
      setFlag(true);
    } catch (error) {}
  };

  const handlePostEditArticle = async () => {
    const oldMediaFiles: any[] = [];

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", content);
    ImageVideo.forEach((file: any) => {
      if (file.id) {
        oldMediaFiles.push(file);
      } else {
        formData.append("mediaFiles", file);
      }
    });
    if (oldMediaFiles.length > 0) {
      formData.append("oldMediaFiles", JSON.stringify(oldMediaFiles));
    }

    try {
      const data = await axiosClient.patch(
        `/api/v1/Article/patchArticle/${idArticle}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFlag(true);
      setSelectedImageVideo([]);
      setImageVideo([]);
      setcontent("");
      setidArticle(null);
      setstatusArticle(1);
      toast.success(data.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("sửa bài viết thất bại", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

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
          {dataServer &&
            dataServer.map((item, index) => (
              <div className="Comment" key={index}>
                {item.user?.id === userId ? (
                  <>
                    <button
                      className="btnDeleteArticle"
                      onClick={() => handleDeleteArticle(item.id)}
                    >
                      <img
                        src={images.Delete}
                        alt=""
                        width={"20px"}
                        height={"20px"}
                      />
                    </button>

                    <button
                      className="btnEditArticle"
                      onClick={() => handleEditArticle(item.id)}
                    >
                      <img
                        src={images.Edit}
                        alt=""
                        width={"20px"}
                        height={"20px"}
                      />
                    </button>
                  </>
                ) : (
                  ""
                )}

                <div>
                  <div className="userComment">
                    {item.user?.imgavatar ? (
                      <div className="imgAvataruserComent">
                        <img src={item.user.imgavatar} alt="" />
                      </div>
                    ) : (
                      <div className="imgAvataruserComent">
                        <img src={images.Avatar} alt="" />
                      </div>
                    )}

                    <p>
                      <b>{item.user?.fullname} :</b>
                    </p>
                  </div>

                  <p>{item.content} </p>
                </div>

                {item.mediaFiles && item.mediaFiles?.length > 0 ? (
                  <div className="imgComment">
                    <div
                      className={`imgComment imgComment-${item.mediaFiles?.length}`}
                    >
                      {item?.mediaFiles?.map((media, index) => (
                        <>
                          {media.type === "video" ? (
                            <video src={media.url} controls />
                          ) : (
                            <img src={media.url} alt={`Media ${index + 1}`} />
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="numberOfLikes">
                  <p>
                    <b>{item.likes?.length} Lượt thích</b>
                  </p>

                  <p>
                    <b>{item.comments?.length} Lượt bình luận</b>
                  </p>
                </div>
                <div className="btnLike">
                  <button
                    onClick={() => {
                      const hasLiked = item.likes?.some(
                        (like) => like.IdUser === userId
                      );
                      const likeId = item.likes?.find(
                        (like) => like.IdUser === userId
                      )?.id;

                      hasLiked ? handleUnLike(likeId) : handleLike(item.id);
                    }}
                  >
                    {item.likes?.some((like) => like.IdUser === userId) ? (
                      <>
                        <i
                          className="fa-solid fa-thumbs-up fa-lg"
                          style={{ color: "#74C0FC" }}
                        ></i>
                        BỎ THÍCH
                      </>
                    ) : (
                      <>
                        <i
                          className="fa-regular fa-thumbs-up fa-lg"
                          style={{ color: "#74C0FC" }}
                        ></i>
                        THÍCH
                      </>
                    )}
                  </button>
                  <button onClick={() => handleComment(item.id)}>
                    BÌNH LUẬN
                  </button>
                </div>
                {item.comments && item.comments?.length > 0 ? (
                  <div className="showCommentTotal">
                    {item.comments?.map((comment) => (
                      <div className="CommentTitel">
                        {item.user?.id === userId ? (
                          <button
                            className="btnDeleteComment"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <img
                              src={images.Delete}
                              alt=""
                              width={"18px"}
                              height={"18px"}
                            />
                          </button>
                        ) : (
                          ""
                        )}
                        <div className="CommentTitel1">
                          {item.user?.imgavatar ? (
                            <div className="showCommentAvartar">
                              <img src={item.user?.imgavatar} alt="" />
                            </div>
                          ) : (
                            <div className="showCommentAvartar">
                              <img src={images.Avatar} alt="" />
                            </div>
                          )}

                          <b>{item.user?.fullname}</b>
                        </div>

                        <div className="CommentTitel2">
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
        {/* phần nhập bình luận */}
        <div className="memberContent1">
          <div className="memberContentTotal">
            {ErrorFile && (
              <p style={{ color: "red", margin: "0px" }}>{ErrorFile}</p>
            )}
            {selectedImageVideo.length > 0 && (
              <>
                <div className="memberImg">
                  {selectedImageVideo.map((media, index) => (
                    <div className="imgShowTotal" key={index}>
                      <div className="imgShow">
                        <button
                          className="imgDelete"
                          onClick={() => handleDeleteImageVideo(index)}
                        >
                          <img src={images.Delete} alt="" />
                        </button>
                        {media.type === "video" ? (
                          <video src={media.url} controls />
                        ) : (
                          <img src={media.url} alt="Selected" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="memberComment">
              <form
                action=""
                className="memberCommentForm"
                onSubmit={handleSubmit}
              >
                <label htmlFor="avatar1" style={{ cursor: "pointer" }}>
                  <input
                    id="avatar1"
                    type="file"
                    name="image"
                    multiple
                    onChange={handleImageChange}
                  />
                  <i className="fa-solid fa-paperclip"></i>
                </label>

                {statusArticle === 1 ? (
                  <>
                    <input
                      type="text"
                      name="content"
                      placeholder="Bạn có muốn đăng gì đó không???"
                      required
                      value={content}
                      onChange={(e) => handleChange(e)}
                    />
                    <button className="btnCommentForm" type="submit">
                      <i
                        className="fa-solid fa-paper-plane fa-xl"
                        style={{ color: "#63E6BE" }}
                      ></i>
                    </button>
                  </>
                ) : statusArticle === 2 ? (
                  <>
                    <input
                      type="text"
                      name="content"
                      placeholder="Bạn muốn bình luận gì vậy???"
                      required
                      value={content}
                      onChange={(e) => handleChange(e)}
                    />
                    <button
                      className="btnCommentForm"
                      type="button"
                      onClick={() => handlePostComment()}
                    >
                      <i
                        className="fa-solid fa-paper-plane fa-xl"
                        style={{ color: "#FFD43B" }}
                      ></i>
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      name="content"
                      required
                      value={content}
                      onChange={(e) => handleChange(e)}
                    />
                    <button
                      className="btnCommentForm"
                      type="button"
                      onClick={() => handlePostEditArticle()}
                    >
                      <i
                        className="fa-solid fa-paper-plane fa-xl"
                        style={{ color: "#E31D51" }}
                      ></i>
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberComponent;
