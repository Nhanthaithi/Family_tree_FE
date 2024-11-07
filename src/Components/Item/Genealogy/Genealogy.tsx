import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Genealogy.css";
import "react-toastify/dist/ReactToastify.css";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { images } from "../../../assets/img/img";
import { initialEdges, initialNodes, typeMoveNode } from "../../../types/types";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { axiosClient } from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Genealogy: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<initialNodes>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<initialEdges>([]);
  const movedNodesRef = useRef<typeMoveNode[]>([]);
  const [Form, setForm] = useState({ nameNode: "", deathDate: "", wife: "" });
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [formadd, setFormadd] = useState(false);
  const [statusformadd, setstatusformadd] = useState<number | null>();
  const [statusHideBtn, setstatusHideBtn] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [flag, setFlag] = useState(false);
  const [idNode, setIdNode] = useState<string>();
  const [showHidebtn, setshowHidebtn] = useState<number>(1);
  const dataGenealogy = useSelector((state: any) => state.dataGenealogy);
  const dataUser = localStorage.getItem("userLogin");
  const useRole = dataUser ? JSON.parse(dataUser)?.role : null;

  // ============================================================================================> lấy data node khi nhập file excel
  const mapDataToNodes = (data: any) => {
    const nodeSpacingX = 100;
    const nodeSpacingY = 100;

    const nodeMap: any = {};

    const nodes = data.map((item: any, index: number) => {
      const nodeId = uuidv4();
      nodeMap[item.name] = nodeId;

      const xPosition =
        (index % 2 === 0 ? 1 : -1) * Math.ceil(index / 2) * nodeSpacingX;
      const yPosition = index * nodeSpacingY;

      return {
        id: item.id_node || nodeId,
        position: {
          x: item.positionX || xPosition,
          y: item.positionY || yPosition,
        },
        data: {
          label: (
            <div className="flowNode">
              {useRole === 2 && (
                <>
                  <button
                    className="deleteNode"
                    onClick={() => handleDeleteNode(item.id_node)}
                  >
                    <img src={images.Delete} alt="" />
                  </button>
                  <button
                    className="editNode"
                    onClick={() => handleEditNode(item.id_node)}
                  >
                    <img src={images.Edit} alt="" />
                  </button>
                </>
              )}

              <div className="nodeImg5">
                <img src={images.coner5} alt="" />
              </div>
              <div className="nodeImg6">
                <img src={images.coner6} alt="" />
              </div>
              <div className="nodeImg7">
                <img src={images.coner7} alt="" />
              </div>
              <div className="nodeImg8">
                <img src={images.coner8} alt="" />
              </div>
              <div className="flowNodeContent">
                <p style={{ color: "#97060D" }}>
                  <b>{item.name || item.name_node}</b>
                </p>

                {(item.deathDate || item.day_node) && (
                  <p style={{ color: "red" }}>
                    Ngày Kỵ:{" "}
                    {(item.deathDate &&
                      item.deathDate.split("-").reverse().join("/")) ||
                      (item.day_node &&
                        new Date(item.day_node).toLocaleDateString("vi-VN"))}
                  </p>
                )}

                {(item.wife || item.nameWife_node) && (
                  <p style={{ color: "blue" }}>
                    <b>Vợ: {item.wife || item.nameWife_node}</b>
                  </p>
                )}
              </div>
            </div>
          ),
          originalData: {
            name: item.name || item.name_node,
            deathDate: item.deathDate || item.day_node,
            wife: item.wife || item.nameWife_node,
          },
        },
        style: {
          background: "white",
          color: "black",
          border: "5px double #97060D",
          borderRadius: "5px",
        },
      };
    });

    return { nodes, nodeMap };
  };

  // ============================================================================================> hàm tạo edge khi nhập file excel
  const mapDataToEdges = (data: any, nodeMap: any) => {
    const edges = data
      .filter((item: any) => item.parentId)
      .map((item: any) => {
        return {
          id: `edge-${nodeMap[item.parentId]}-${nodeMap[item.name]}`,
          source: nodeMap[item.parentId],
          target: nodeMap[item.name],
          type: "smoothstep",
          style: { stroke: "black", strokeWidth: 2 },
          animated: true,
        };
      });

    return edges;
  };

  // ============================================================================================> hàm tạo edge khi get dữ liệu từ server
  const mapDataToEdge = (data: any) => {
    const edges = data.map((item: any) => {
      return {
        id: item.id_edge,
        source: item.source_edge,
        target: item.target_edge,
        type: "smoothstep",
        style: { stroke: "black", strokeWidth: 2 },
        animated: true,
      };
    });

    return edges;
  };

  // ============================================================================================> hàm đọc file xlsx, xls
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const genealogyTree = dataGenealogy.dataGenealogy.id;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Lấy dữ liệu từ sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển sheet dữ liệu thành JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Chuyển đổi ngày tháng sang định dạng DD/MM/YYYY
        function excelDateToJSDate(excelDate: number) {
          const decode = new Date((excelDate - 25569) * 86400 * 1000);
          const date = decode.toISOString().split("T")[0];
          return date;
        }

        // Chuyển đổi thành cấu trúc serverDataNode
        const parsedData = jsonData.slice(1).map((row: any) => ({
          name: row["__EMPTY_1"] ? row["__EMPTY_1"].toUpperCase() : "",
          deathDate: excelDateToJSDate(row["__EMPTY_2"]),
          wife: row["__EMPTY_3"] ? row["__EMPTY_3"].toUpperCase() : "",
          parentId: row["__EMPTY_4"] ? row["__EMPTY_4"].toUpperCase() : null,
        }));

        // Tạo nodes và nodeMap
        const { nodes, nodeMap } = mapDataToNodes(parsedData);

        // Tạo edges dựa trên nodeMap
        const edges = mapDataToEdges(parsedData, nodeMap);

        const dataNode = nodes.map((node: any) => ({
          id_node: node.id,
          name_node: node.data.originalData.name,
          day_node: node.data.originalData.deathDate,
          nameWife_node: node.data.originalData.wife,
          positionX: node.position.x,
          positionY: node.position.y,
          genealogyTree: genealogyTree,
        }));
        const dataEdge = edges.map((edge: any) => ({
          id_edge: edge.id,
          source_edge: edge.source,
          target_edge: edge.target,
          genealogyTree: genealogyTree,
        }));

        await axiosClient.post(
          `api/v1/specificationsNode/postallNode`,
          dataNode
        );

        await axiosClient.post(
          `api/v1/specificationsEdge/postallEdge`,
          dataEdge
        );
        setFlag(true);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // ============================================================================================> hàm gọi data từ server
  useEffect(() => {
    const fetchDataFromServer = async () => {
      const data = await axiosClient.get(
        `api/v1/GenealogyTree/getGenealogyTreeAll`
      );
      const dataNode = data.data.data.specificationsNode;
      const dataEdge = data.data.data.specificationsEdge;
      const { nodes } = mapDataToNodes(dataNode);
      const edges = mapDataToEdge(dataEdge);
      setNodes(nodes);
      setEdges(edges);
      setFlag(false);
    };

    fetchDataFromServer();
  }, [flag, dataGenealogy]);

  // =========================================================================================> Hàm lắng nghe liên kết edge
  const onConnect = async (params: any) => {
    setEdges((edges) =>
      addEdge(
        {
          ...params,
          type: "smoothstep",
          style: { stroke: "black", strokeWidth: 2 },
          animated: true,
        },
        edges
      )
    );

    if (useRole === 2) {
      const genealogyTree = dataGenealogy.dataGenealogy.id;
      const newEdge = {
        id_edge: `edge-${params.source}-${params.target}`,
        source_edge: params.source,
        target_edge: params.target,
        genealogyTree: genealogyTree,
      };

      try {
        const respon = await axiosClient.post(
          `api/v1/specificationsEdge/postEdge`,
          newEdge
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
    }
  };

  // =========================================================================================> Hàm xóa node
  const handleDeleteNode = async (id: string) => {
    try {
      const respon = await axiosClient.delete(
        `api/v1/specificationsNode/deleteNode/${id}`
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
      toast.error("xóa dữ liệu thất bại", {
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

  // =========================================================================================> Hàm sửa node
  const handleEditNode = async (id: string) => {
    const data = await axiosClient.get(
      `/api/v1/specificationsNode/editNode/${id}`
    );
    const node = data.data.data;
    setIdNode(node.id_node);
    setForm({
      nameNode: node.name_node,
      deathDate: node.day_node.split("T")[0],
      wife: node.nameWife_node,
    });
    setFormadd(true);
    setstatusHideBtn(false);
    setstatusformadd(1);
    setshowHidebtn(2);
  };

  // =========================================================================================> Hàm post dữ liệu sửa node
  const handlePostEditNode = async () => {
    const dataNode = {
      name_node: Form.nameNode.toUpperCase(),
      day_node: Form.deathDate,
      nameWife_node: Form.wife.toUpperCase(),
    };

    try {
      const data = await axiosClient.patch(
        `/api/v1/specificationsNode/UpdateNode/${idNode}`,
        dataNode
      );
      setFlag(true);
      setshowHidebtn(1);
      setForm({ nameNode: "", deathDate: "", wife: "" });
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
      toast.error("sửa dữ liệu thất bại", {
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
    setFormadd(false);
    setstatusHideBtn(true);
    setstatusformadd(null);
  };

  // handle onchage
  const handlegetform = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  // =============================================================================> hàm add thêm node
  const handleAddNode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const genealogyTree = dataGenealogy.dataGenealogy.id;
      const newNode = [
        {
          id_node: uuidv4(),
          name_node: Form.nameNode.toUpperCase(),
          day_node: Form.deathDate,
          nameWife_node: Form.wife.toUpperCase(),
          positionX: Math.random() * 500,
          positionY: Math.random() * 500,
          genealogyTree: genealogyTree,
        },
      ];

      const respon = await axiosClient.post(
        `api/v1/specificationsNode/postallNode`,
        newNode
      );
      setFlag(true);
      setForm({ nameNode: "", deathDate: "", wife: "" });
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

  //============================================================================> Hàm xử lý sự kiện nhấp vào edge
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      if (selectedEdge === edge.id) {
        setSelectedEdge(null);
      } else {
        setSelectedEdge(edge.id);
      }
    },
    [selectedEdge]
  );

  //=============================================================================> Hàm xóa edge đã chọn

  const handleDeleteEdge = async () => {
    try {
      const respon = await axiosClient.delete(
        `api/v1/specificationsEdge/deleteEdge/${selectedEdge}`
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
      setFlag(true);
      setSelectedEdge(null);
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

  // =========================================================================================> Hàm lắng nghe di chuyển Node
  const handleNodeDragStop = (event: any, node: any) => {
    // Kiểm tra và thêm node vào danh sách movedNodes nếu nó đã di chuyển
    const nodeAlreadyMoved = movedNodesRef.current.some(
      (movedNode) => movedNode.id === node.id
    );
    if (!nodeAlreadyMoved) {
      movedNodesRef.current.push({ id: node.id, position: node.position });
    } else {
      // Cập nhật vị trí cho node đã có trong danh sách
      movedNodesRef.current = movedNodesRef.current.map((movedNode) =>
        movedNode.id === node.id
          ? { ...movedNode, position: node.position }
          : movedNode
      );
    }

    setShowSaveButton(true);
  };

  //=============================================================================> Hàm để lưu sự di chuyển của node
  const handleSave = async () => {
    const data = movedNodesRef.current.map((node) => ({
      id_node: node.id,
      positionX: node.position.x,
      positionY: node.position.y,
    }));

    try {
      const respon = await axiosClient.patch(
        `api/v1/specificationsNode/patchPositionNode`,
        data
      );
      movedNodesRef.current = [];
      setShowSaveButton(false);
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
    } catch (error: any) {
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

  //============================================================================> Hàm xử lý ẩn hiện form thêm node
  const handleShowHideAddForm = () => {
    setFormadd(!formadd);
    setstatusHideBtn(true);
    setstatusformadd(null);
    setForm({ nameNode: "", deathDate: "", wife: "" });
  };

  const handleShowHideBtnAddOne = () => {
    setstatusHideBtn(false);
    setstatusformadd(1);
  };

  const handleShowHideBtnAddMany = () => {
    setstatusHideBtn(false);
    setstatusformadd(2);
  };

  const handleBack = () => {
    setstatusformadd(null);
    setstatusHideBtn(true);
    setshowHidebtn(1);
    setForm({ nameNode: "", deathDate: "", wife: "" });
  };

  return (
    <div className="GenealogyLayout">
      {useRole === 2 && (
        <button className="addNode" onClick={() => handleShowHideAddForm()}>
          <img src={images.Add} alt="" />
        </button>
      )}

      {formadd && (
        <div className="formAddNode">
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
          {statusHideBtn && (
            <div className="ChooseAdd">
              <button
                className="btnChooseAdd"
                onClick={() => handleShowHideBtnAddOne()}
              >
                THÊM TỪNG NGƯỜI
              </button>
              <button
                className="btnChooseAdd"
                onClick={() => handleShowHideBtnAddMany()}
              >
                THÊM NHIỀU NGƯỜI
              </button>
            </div>
          )}

          {statusformadd === null ? (
            ""
          ) : statusformadd === 1 ? (
            <>
              <div className="backHero">
                <button className="btnBack" onClick={() => handleBack()}>
                  <img src={images.Back} alt="" />
                </button>
              </div>
              <form onSubmit={handleAddNode}>
                <div className="formAddNodeContent">
                  <label htmlFor="">HỌ VÀ TÊN :</label>
                  <input
                    type="text"
                    name="nameNode"
                    value={Form.nameNode}
                    onChange={handlegetform}
                    required
                  />
                </div>

                <div className="formAddNodeContent">
                  <label htmlFor="">NGÀY GIỖ :</label>
                  <input
                    type="date"
                    name="deathDate"
                    value={Form.deathDate}
                    onChange={handlegetform}
                  />
                </div>

                <div className="formAddNodeContent">
                  <label htmlFor="">HỌ VÀ TÊN VỢ :</label>
                  <input
                    type="text"
                    name="wife"
                    value={Form.wife}
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
                    onClick={() => handlePostEditNode()}
                  >
                    <button type="button">SỬA DỮ LIỆU</button>
                  </div>
                )}
              </form>
            </>
          ) : (
            <div>
              <div className="backHero">
                <button className="btnBack" onClick={() => handleBack()}>
                  <img src={images.Back} alt="" />
                </button>
              </div>

              <div className="btnChooseFile">
                <div className="btnExcel">
                  <p>
                    <b>Hãy tải file excel mẫu ở đây:</b>
                  </p>
                  <a href="../../../../public/files/example.xlsx" download>
                    <button>File Excel</button>
                  </a>
                </div>

                <div>
                  <p>
                    <b>Chọn file excel bạn đã chỉnh sửa vào đây:</b>
                  </p>
                  <input
                    className="inputChooseFile"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {useRole === 2 && (
        <>
          {" "}
          {selectedEdge && (
            <button className="btnDeleteEdge" onClick={handleDeleteEdge}>
              <b>Xóa liên kết</b>
            </button>
          )}
          {showSaveButton && (
            <button className="btnSave" onClick={() => handleSave()}>
              <b>Lưu Dữ Liệu</b>
            </button>
          )}
        </>
      )}

      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={handleNodeDragStop}
      >
        {useRole === 2 && (
          <Background
            gap={11}
            size={1}
            color="#B1B1B7"
            variant={BackgroundVariant.Lines}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default Genealogy;
