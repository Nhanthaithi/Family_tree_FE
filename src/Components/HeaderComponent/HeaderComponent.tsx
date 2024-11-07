import React, { ChangeEvent, useEffect, useState } from "react";
import "./HeaderComponent.css";
import { images } from "../../assets/img/img";
import { axiosClient } from "../../api/axiosClient";
import { typeHeader } from "../../types/types";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setDataGenealogyTree } from "../../redux/reduce/genealogySlice";

const HeaderComponent: React.FC = () => {
  const [dataGenealogy, setDataGenealogy] = useState<typeHeader | null>(null);
  const [statusForm, setStatusForm] = useState<number | null>(null);
  const [statusBtnheader, setstatusBtnheader] = useState<number>(1);
  const [flag, setFlag] = useState(false);
  const [getForm, setGetForm] = useState({
    nameBranch: "",
    nameGenealogyTree: "",
    address: "",
  });
  const dispatch = useDispatch();

  //  =================================================================> gọi API lần đầu
  const dataUser = localStorage.getItem("userLogin");
  const userId = dataUser ? JSON.parse(dataUser)?.id : null;
  const useRole = dataUser ? JSON.parse(dataUser)?.role : null;

  useEffect(() => {
    const fetchData = async () => {
      if (useRole === 2) {
        try {
          const response = await axiosClient.get(
            `api/v1/GenealogyTree/getGenealogyTree/${userId}`
          );
          setDataGenealogy(response.data.data);
          dispatch(setDataGenealogyTree(response.data.data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        try {
          const response = await axiosClient.get(
            `api/v1/GenealogyTree/getGenealogyTreeAll`
          );
          setDataGenealogy(response.data.data);
          dispatch(setDataGenealogyTree(response.data.data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
    setFlag(false);
  }, [flag]);

  const handlegetform = (e: ChangeEvent<HTMLInputElement>) => {
    setGetForm({
      ...getForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axiosClient.post(`api/v1/GenealogyTree/postNameGenealogyTree`, {
        ...getForm,
        id_use: userId,
      });

      toast.success("Đã lưu dữ liệu thành công", {
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
      toast.error("Lưu dữ liệu thất bại", {
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

  const handleEditHeader = async () => {
    setStatusForm(1);
    setstatusBtnheader(2);
    setGetForm({
      nameBranch: dataGenealogy?.nameBranch || "",
      nameGenealogyTree: dataGenealogy?.nameGenealogyTree || "",
      address: dataGenealogy?.address || "",
    });
  };

  const handleCloseForm = () => {
    setStatusForm(null);
  };

  const handleSaveHeader = async (id: number | null) => {
    try {
      const data = await axiosClient.patch(
        `api/v1/GenealogyTree/UpdateGenealogyTree/${id}`,
        {
          nameBranch: getForm.nameBranch.toUpperCase(),
          nameGenealogyTree: getForm.nameGenealogyTree.toUpperCase(),
          address: getForm.address.toUpperCase(),
        }
      );
      setGetForm({
        nameBranch: "",
        nameGenealogyTree: "",
        address: "",
      });
      setstatusBtnheader(1);
      setStatusForm(null);
      setFlag(true);
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
      toast.error("Lưu dữ liệu thất bại", {
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
    <>
      <div className="HeaderLayout">
        <div className="HeaderImage box1">
          <img src={images.lotus3} alt="" />
        </div>
        <div className="HeaderContent box2">
          <div className="HeaderConer1">
            <img src={images.coner1} alt="" />
          </div>
          <div className="HeaderConer2">
            <img src={images.coner2} alt="" />
          </div>
          <div className="HeaderConer3">
            <img src={images.coner3} alt="" />
          </div>
          <div className="HeaderConer4">
            <img src={images.coner4} alt="" />
          </div>
          {useRole === 2 && (
            <button
              className="btnEditHeader"
              onClick={() => handleEditHeader()}
            >
              <img src={images.Edit} alt="" />
            </button>
          )}

          <div className="HeaderContentText">
            <p>
              <b>{dataGenealogy?.nameBranch?.toUpperCase()}</b>
            </p>
            <p>
              <b>{dataGenealogy?.nameGenealogyTree?.toUpperCase()}</b>
            </p>
            <p>{dataGenealogy?.address?.toUpperCase()}</p>
          </div>
        </div>
        <div className="HeaderImage box3">
          <img src={images.lotus2} alt="" />
        </div>

        {useRole === 2 && (dataGenealogy === null || statusForm === 1) && (
          <>
            <div className="formGenelogyHero"></div>
            <div className="formGenelogy">
              <button
                className="CloseformGenelogy"
                onClick={() => handleCloseForm()}
              >
                <img src={images.Delete} alt="" />
              </button>
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
              <form onSubmit={handleSubmit}>
                <div className="formGenealogy1">
                  <div>
                    <label htmlFor="">TÊN NHÁNH (CHI)</label>
                  </div>
                  <div className="inputformGenelogy">
                    <input
                      type="text"
                      name="nameBranch"
                      placeholder="PHẢ ĐỒ CHI 3"
                      value={getForm.nameBranch}
                      onChange={handlegetform}
                    />
                  </div>
                  {/* <span id="spanerror">LỖI</span> */}
                </div>

                <div className="formGenealogy1">
                  <div>
                    <label htmlFor="">TÊN DÒNG HỌ</label>
                  </div>
                  <div className="inputformGenelogy">
                    <input
                      type="text"
                      name="nameGenealogyTree"
                      placeholder="DÒNG HỌ HOÀNG"
                      value={getForm.nameGenealogyTree}
                      onChange={handlegetform}
                    />
                  </div>
                  {/* <span id="spanerror">Loiix</span> */}
                </div>

                <div className="formGenealogy1">
                  <div>
                    <label htmlFor="">ĐỊA CHỈ</label>
                  </div>
                  <div className="inputformGenelogy">
                    <input
                      type="text"
                      name="address"
                      placeholder="KỲ LAM - ĐIỆN THỌ - QUẢNG NAM"
                      value={getForm.address}
                      onChange={handlegetform}
                    />
                  </div>
                  {/* <span id="spanerror">Loiix</span> */}
                </div>

                {statusBtnheader === 1 ? (
                  <div className="btnSupmitForm">
                    <button type="submit">ĐĂNG KÝ</button>
                  </div>
                ) : (
                  <div
                    className="btnSupmitForm"
                    onClick={() => handleSaveHeader(dataGenealogy?.id ?? null)}
                  >
                    <button type="button">LƯU</button>
                  </div>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HeaderComponent;
