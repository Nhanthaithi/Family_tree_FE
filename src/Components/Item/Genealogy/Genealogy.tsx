import React, { FormEvent, useCallback, useEffect, useState } from "react";
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
import { initialEdges, initialNodes } from "../../../types/types";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { axiosClient } from "../../../api/axiosClient";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Genealogy: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<initialNodes>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<initialEdges>([]);
  const [newNode, setNewNode] = useState<initialNodes[]>([]);
  const [newEdge, setNewEdge] = useState<initialEdges[]>([]);
  const [nameNode, setnameNode] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [wife, setWife] = useState("");
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [formadd, setFormadd] = useState(false);
  const [statusformadd, setstatusformadd] = useState<number | null>();
  const [statusHideBtn, setstatusHideBtn] = useState(true);
  const dataGenealogy = useSelector((state: any) => state.dataGenealogy);

  console.log(statusformadd);

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
              <button className="deleteNode">
                <img src={images.Delete} alt="" />
              </button>
              <button className="editNode">
                <img src={images.Edit} alt="" />
              </button>
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
          id: `edge-${uuidv4()}`,
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
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
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
        setNodes((nds) => nds.concat(nodes));
        setEdges((nds) => nds.concat(edges));
        setNewNode((nds) => nds.concat(nodes));
        setNewEdge((nds) => nds.concat(edges));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // ============================================================================================> hàm gọi data từ server
  useEffect(() => {
    const fetchDataFromServer = async () => {
      const genealogyTreeId = dataGenealogy?.dataGenealogy?.id;
      const data = await axiosClient.get(
        `api/v1/GenealogyTree/getGenealogyTreeAll/${genealogyTreeId}`
      );
      const dataNode = data.data.data.specificationsNode;
      const dataEdge = data.data.data.specificationsEdge;
      const { nodes } = mapDataToNodes(dataNode);
      const edges = mapDataToEdge(dataEdge);
      setNodes(nodes);
      setEdges(edges);
      console.log(nodes);
      console.log(edges);
    };

    fetchDataFromServer();
  }, [dataGenealogy]);

  // =========================================================================================> Hàm lắng nghe liên kết edge
  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { stroke: "black", strokeWidth: 2 },
            animated: true,
          },
          eds
        )
      ),
        setNewEdge((nds) => nds.concat(edges));
    },
    [setEdges]
  );

  // =============================================================================> hàm add thêm node
  const handleAddNode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newNode = {
      id: uuidv4(),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: (
          <div className="flowNode">
            <button className="deleteNode">
              <img src={images.Delete} alt="" />
            </button>
            <button className="editNode">
              <img src={images.Edit} alt="" />
            </button>
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
              <p style={{ color: "#97060D", textTransform: "uppercase" }}>
                <b>{nameNode}</b>
              </p>
              {deathDate && (
                <p style={{ color: "red" }}>
                  Ngày Kỵ: {deathDate.split("-").reverse().join("/")}
                </p>
              )}

              {wife && (
                <p style={{ color: "blue", textTransform: "uppercase" }}>
                  <b>Vợ: {wife}</b>
                </p>
              )}
            </div>
          </div>
        ),
        originalData: {
          // Lưu trữ dữ liệu gốc tại đây
          name: nameNode,
          deathDate: deathDate,
          wife: wife,
        },
      },
      style: {
        background: "white",
        color: "black",
        border: "5px double #97060D",
        borderRadius: "5px",
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNewNode((nds) => nds.concat(newNode));
    setnameNode("");
    setDeathDate("");
    setWife("");
  };

  //============================================================================> Hàm xử lý sự kiện nhấp vào edge
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation(); // Ngăn việc xử lý sự kiện trên phần tử cha
      if (selectedEdge === edge.id) {
        setSelectedEdge(null); // Nếu nhấn lần nữa, ẩn nút Delete
      } else {
        setSelectedEdge(edge.id); // Chọn edge và hiển thị nút Delete
      }
    },
    [selectedEdge]
  );

  //=============================================================================> Hàm xóa edge đã chọn

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge));
      setNewEdge((eds) => eds.filter((edge) => edge.id !== selectedEdge));
      setSelectedEdge(null);
    }
  };

  //=============================================================================> Hàm để lấy dữ liệu nodes và edges
  const handleSave = async () => {
    const genealogyTree = dataGenealogy.dataGenealogy.id;
    try {
      const dataNode = newNode.map((node) => ({
        id_node: node.id,
        name_node: node.data.originalData.name,
        day_node: node.data.originalData.deathDate,
        nameWife_node: node.data.originalData.wife,
        positionX: node.position.x,
        positionY: node.position.y,
        genealogyTree: genealogyTree,
      }));
      const dataEdge = newEdge.map((edge) => ({
        id_edge: edge.id,
        source_edge: edge.source,
        target_edge: edge.target,
        genealogyTree: genealogyTree,
      }));

      await axiosClient.post(`api/v1/specificationsNode/postallNode`, dataNode);

      await axiosClient.post(`api/v1/specificationsEdge/postallEdge`, dataEdge);
      setNewNode([]);
      setNewEdge([]);
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
  };

  return (
    <div className="GenealogyLayout">
      <button className="addNode" onClick={() => handleShowHideAddForm()}>
        <img src={images.Add} alt="" />
      </button>

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

          {statusformadd === 1 ? (
            ""
          ) : statusformadd === null ? (
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
                    value={nameNode}
                    onChange={(e) => setnameNode(e.target.value)}
                    required
                  />
                </div>

                <div className="formAddNodeContent">
                  <label htmlFor="">NGÀY GIỖ :</label>
                  <input
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                  />
                </div>

                <div className="formAddNodeContent">
                  <label htmlFor="">HỌ VÀ TÊN VỢ :</label>
                  <input
                    type="text"
                    value={wife}
                    onChange={(e) => setWife(e.target.value)}
                  />
                </div>

                <div className="btnFormAddNode">
                  <button type="submit">THÊM DỮ LIỆU</button>
                </div>
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

      {selectedEdge && (
        <button className="btnDeleteEdge" onClick={handleDeleteEdge}>
          <b>Xóa liên kết</b>
        </button>
      )}

      {(newNode.length > 0 || newEdge.length > 0) && (
        <button className="btnSave" onClick={() => handleSave()}>
          <b>Lưu Dữ Liệu</b>
        </button>
      )}

      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
      >
        <Background
          gap={11}
          size={1}
          color="#B1B1B7"
          variant={BackgroundVariant.Lines}
        />
      </ReactFlow>
    </div>
  );
};

export default Genealogy;
