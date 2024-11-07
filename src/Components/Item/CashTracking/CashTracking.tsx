import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./CashTracking.css";
import ReactPaginate from "react-paginate";
import { images } from "../../../assets/img/img";
import { toast } from "react-toastify";
import { axiosClient } from "../../../api/axiosClient";
import { useSelector } from "react-redux";
import { typeCashSearch, typeCashTraking } from "../../../types/types";

const CashTracking: React.FC = () => {
  const [Form, setForm] = useState({
    id: Number(""),
    dayCash: "",
    description: "",
  });
  const [showHideFormHero, setshowHideFormHero] = useState(false);
  const [dataServer, setDataServer] = useState<typeCashTraking>();
  const [transactionType, setTransactionType] = useState<string>("");
  const [showHidebtn, setShowHideBtn] = useState(1);
  const startDateInput = useRef<HTMLInputElement>(null);
  const endDateInput = useRef<HTMLInputElement>(null);
  const [DateSearch, setDateSearch] = useState<typeCashSearch>({
    startDate: "",
    endDate: "",
  });
  const [errorFilter, setErrorFilter] = useState<string>("");
  const [flag, setFlag] = useState(false);
  const [valueMoney, setValueMoney] = useState("");
  const dataGenealogy = useSelector((state: any) => state.dataGenealogy);

  // =================================================================> hàm validate lọc ngày

  const validateYear = () => {
    const startDateValue = startDateInput.current?.value;
    const endDateValue = endDateInput.current?.value;

    if (!startDateValue || !endDateValue) {
      setErrorFilter("Vui lòng nhập đầy đủ cả ' Từ ngày ' và ' Đến ngày '");
      return;
    }

    if (startDateValue && endDateValue) {
      const startDate = new Date(startDateValue);
      const endDate = new Date(endDateValue);

      const startYear = startDate?.getFullYear();
      const endYear = endDate?.getFullYear();
      if (startYear !== endYear) {
        setErrorFilter("Hai ngày phải nằm trong cùng một năm.");
      } else if (startDate > endDate) {
        setErrorFilter("' Từ ngày ' phải nhỏ hơn ' Đến ngày '");
      } else {
        setDateSearch({ startDate: startDateValue, endDate: endDateValue });
        setErrorFilter("");
      }
    }
  };

  // =================================================================> hàm gọi data
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        startDate: DateSearch.startDate,
        endDate: DateSearch.endDate,
      };

      try {
        const response = await axiosClient.get(
          `api/v1/CashTracking/getAllCashTracking`,
          { params }
        );
        setDataServer(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setFlag(false);
  }, [flag]);

  // =================================================================> hàm ẩn hiện form thêm vào sổ quỹ
  const handleShowHideForm = () => {
    setshowHideFormHero(!showHideFormHero);
    setForm({ id: Number(""), dayCash: "", description: "" });
    setTransactionType("");
    setValueMoney("");
    setShowHideBtn(1);
  };

  //================================================================> thêm dấu phẩy ở số tiền nhập vào

  const formatNumber = (num: string) => {
    const [integer] = num.split(".");
    return integer.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatNumber(inputValue);
    setValueMoney(formattedValue);
  };

  // =================================================================>

  const handlegetform = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTransactionType(e.target.value);
  };

  // ========================================================================> hàm post sổ quỹ
  const handleAddTracking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const genealogyTree = dataGenealogy.dataGenealogy.id;
    const data = {
      dayCash: Form.dayCash,
      money: valueMoney.replace(/,/g, ""),
      description: Form.description,
      selectCash: Number(transactionType),
      genealogyTree: genealogyTree,
    };

    setForm({ id: Number(""), dayCash: "", description: "" });
    setTransactionType("");
    setValueMoney("");
    setFlag(true);

    try {
      const respon = await axiosClient.post(
        `api/v1/CashTracking/postCashTracking`,
        data
      );
      toast.success(respon.data.message, {
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

  // ============================================================================> hàm post dữ liệu để sửa form
  const handlePostEditCashTracking = async () => {
    setshowHideFormHero(!showHideFormHero);
    const data = {
      id: Form.id,
      dayCash: Form.dayCash,
      money: valueMoney.replace(/,/g, ""),
      description: Form.description,
      selectCash: Number(transactionType),
    };
    setForm({ id: Number(""), dayCash: "", description: "" });
    setTransactionType("");
    setValueMoney("");
    setFlag(true);

    try {
      const respon = await axiosClient.patch(
        `api/v1/CashTracking/patchCashTracking`,
        data
      );
      toast.success(respon.data.message, {
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

  // =================================================================> hàm thay đổi nội dung sổ quỹ
  const handleEdit = async (id: number | undefined) => {
    setshowHideFormHero(!showHideFormHero);
    const filteredData = dataServer?.records?.filter(
      (item) => item.id === id
    )[0];

    const dayCash = filteredData?.dayCash
      ? new Date(filteredData.dayCash)
          .toLocaleDateString("vi-VN")
          .split("/")
          .map((part, index) => (index < 2 ? part.padStart(2, "0") : part))
          .reverse()
          .join("-")
      : "";

    setForm({
      id: filteredData?.id || 0,
      dayCash: dayCash,
      description: filteredData?.description || "",
    });

    setTransactionType(String(filteredData?.selectCash));
    const formattedValue = formatNumber(filteredData?.money || "");
    setValueMoney(formattedValue);
    setShowHideBtn(2);
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      const respon = await axiosClient.delete(
        `api/v1/CashTracking/deleteCashTracking/${id}`
      );
      setFlag(true);
      toast.success(respon.data.message, {
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

  const handleSearch = () => {
    setFlag(true);
  };

  //==============================================================================================>phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10; // Số sản phẩm hiển thị trên mỗi trang

  const data1 =
    dataServer?.records?.filter((data: any) => data?.status !== 2) ?? [];

  // Tính tổng số trang dựa trên dữ liệu sản phẩm và số sản phẩm trên mỗi trang
  const pageCount = Math.ceil(data1.length / productsPerPage);

  // Tính chỉ số của sản phẩm đầu tiên trên trang hiện tại
  const offset = currentPage * productsPerPage;
  const currentProducts = data1?.slice(offset, offset + productsPerPage);

  // Hàm xử lý khi người dùng chuyển trang
  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className="cashTracking">
      <div className="CashTrackingAdd">
        <button
          className="btnCashTrackingAdd"
          onClick={() => handleShowHideForm()}
        >
          <img src={images.Add} alt="" />
        </button>
      </div>

      {showHideFormHero && (
        <div className="formAddCashTraking">
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

          <form className="formCashtraking" onSubmit={handleAddTracking}>
            <div className="formAddNodeContent">
              <label htmlFor="">
                <b>THỜI GIAN :</b>
              </label>
              <input
                type="date"
                name="dayCash"
                value={Form.dayCash}
                onChange={handlegetform}
                required
              />
            </div>

            <div className="formAddNodeContent">
              <label htmlFor="">
                <b>LOẠI GIAO DỊCH :</b>
              </label>
              <select
                className="selectCash"
                value={transactionType}
                onChange={handleSelectChange}
              >
                <option value="">--Select--</option>
                <option value="1">THU</option>
                <option value="2">CHI</option>
              </select>
            </div>

            <div className="formAddNodeContent">
              <label htmlFor="">
                <b>SỐ TIỀN :</b>
              </label>
              <input
                value={valueMoney}
                onChange={handleChange}
                type="text"
                placeholder="VND"
                required
              />
            </div>

            <div className="formAddNodeContent">
              <label htmlFor="">
                <b>NỘI DUNG :</b>
              </label>
              <input
                type="text"
                name="description"
                value={Form.description}
                onChange={handlegetform}
              />
            </div>

            {showHidebtn === 1 ? (
              <div className="btnFormAddNode">
                <button type="submit">THÊM DỮ LIỆU</button>
              </div>
            ) : (
              <div
                className="btnFormAddNode"
                onClick={() => handlePostEditCashTracking()}
              >
                <button type="button">SỬA DỮ LIỆU</button>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="cashHero">
        <b>SỔ QUỸ NĂM {dataServer?.currentYear}</b>
      </div>
      <div className="filterCashHero">
        <div className="filterCash">
          <img src={images.Filter} alt="" />
        </div>
        <div className="chooseFilter">
          <label htmlFor="">
            <b>Từ ngày :</b>
          </label>
          <input type="date" ref={startDateInput} onChange={validateYear} />
        </div>
        <div className="chooseFilter">
          <label htmlFor="">
            <b>Đến ngày :</b>
          </label>
          <input type="date" ref={endDateInput} onChange={validateYear} />
        </div>
        <button className="btnSearch" onClick={() => handleSearch()}>
          {" "}
          <img src={images.Search} alt="" />
        </button>
      </div>
      <div className="errorFilter">
        {errorFilter && <p style={{ color: "red" }}>{errorFilter}</p>}
      </div>

      <div>
        <div className="cashLish">
          <p style={{ color: "green" }}>
            <b>
              TỔNG THU {dataServer?.currentYear} :{" "}
              {Number(dataServer?.totalIncome).toLocaleString("vi-VN")} đ
            </b>
          </p>
          <p style={{ color: "green" }}>
            <b>
              TỔNG CHI {dataServer?.currentYear} :{" "}
              {Number(dataServer?.totalExpense).toLocaleString("vi-VN")} đ
            </b>
          </p>
          <p style={{ color: "green" }}>
            <b>
              QUỸ CÒN :{" "}
              {Number(dataServer?.actualBalance).toLocaleString("vi-VN")} đ
            </b>
          </p>
        </div>
        {dataServer?.startDate && (
          <div className="cashLishFilter">
            <p style={{ color: "green" }}>
              <b>
                Từ :{" "}
                {new Date(dataServer?.startDate as string).toLocaleDateString(
                  "vi-VN"
                )}{" "}
                - Đến :{" "}
                {new Date(dataServer?.endDate as string).toLocaleDateString(
                  "vi-VN"
                )}{" "}
                :
              </b>
            </p>
            <p style={{ color: "green" }}>
              <b>Tổng thu:</b>{" "}
              {Number(dataServer?.totalsFilter?.totalIncome).toLocaleString(
                "vi-VN"
              )}{" "}
              đ
            </p>
            <p style={{ color: "green" }}>
              <b>Tổng chi:</b>{" "}
              {Number(dataServer?.totalsFilter?.totalExpense).toLocaleString(
                "vi-VN"
              )}{" "}
              đ
            </p>
          </div>
        )}
      </div>

      <table className="cashTable">
        <thead>
          <tr>
            <th>THỜI GIAN</th>
            <th>TIỀN THU</th>
            <th>TIỀN CHI</th>
            <th>NỘI DUNG</th>
            <th>THAO TÁC</th>
          </tr>
        </thead>
        {currentProducts.length > 0 ? (
          <tbody>
            {currentProducts?.map((item, index) => (
              <tr key={index}>
                <td>
                  {item?.dayCash &&
                    new Date(item?.dayCash).toLocaleDateString("vi-VN")}
                </td>

                {item.selectCash === 1 ? (
                  <td>+ {Number(item.money).toLocaleString("vi-VN")}</td>
                ) : (
                  <td>{""}</td>
                )}
                {item.selectCash === 2 ? (
                  <td>- {Number(item.money).toLocaleString("vi-VN")}</td>
                ) : (
                  <td>{""}</td>
                )}
                <td>{item?.description}</td>
                <td>
                  <button
                    className="btnEdit"
                    onClick={() => handleEdit(item?.id)}
                  >
                    <b>SỬA</b>
                  </button>

                  <button
                    className="btnDelete"
                    onClick={() => handleDelete(item?.id)}
                  >
                    <b>XÓA</b>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={5}
                style={{
                  textAlign: "center",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  border: "none",
                }}
              >
                <p>KHÔNG CÓ LỊCH SỬ GIAO DỊCH</p>
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {currentProducts.length > 0 ? (
        <div className="CustomPagination">
          <ReactPaginate
            className="pagination"
            previousLabel={"TRANG TRƯỚC"}
            nextLabel={"TRANG SAU"}
            pageCount={pageCount as number}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CashTracking;
