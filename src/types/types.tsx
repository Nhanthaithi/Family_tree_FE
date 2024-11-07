//========================================> type menu ẩn
export interface MenuItem {
  name: Date;
  path: string;
}

//========================================> type form register
export interface GetformRegister {
  fullname: string;
  email: string;
  passwords: string;
  phoneNumber: string;
}

//========================================> type form login
export interface GetformLogin {
  passwords: string;
  email: string;
}

//========================================> type Node reactflow
export interface initialNodes {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: JSX.Element;
    originalData: {
      name: string;
      deathDate: string;
      wife: string;
    };
  };
  style: {
    background: string;
    color: string;
    border: string;
    borderRadius: string;
  };
}

//========================================> type edge reactflow
export interface initialEdges {
  id: string;
  source: string;
  target: string;
  type: string;
  style: {
    stroke: string;
    strokeWidth: number;
  };
}

//========================================> type header
export interface typeHeader {
  id?: number;
  id_use?: number;
  address?: string;
  nameBranch?: string;
  nameGenealogyTree?: string;
}

//========================================> type di chuyển của node
export interface typeMoveNode {
  id?: string; // Cho phép id có thể không tồn tại
  position: {
    x: number | string;
    y: number | string;
  };
}

//========================================> type get sỗ quỹ
export interface typeCashTraking {
  currentYear?: number;
  records?: [
    {
      id?: number;
      dayCash?: Date;
      description: string;
      money?: string;
      selectCash?: number;
    }
  ];
  totalIncome?: string;
  totalExpense?: string;
  actualBalance?: number;
  startDate?: string;
  endDate?: string;
  totalsFilter?: { totalIncome?: string; totalExpense?: string };
}

//========================================> type lọc ngày
export interface typeCashSearch {
  startDate?: string;
  endDate?: string;
}
