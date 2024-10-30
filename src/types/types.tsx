//========================================> type menu ẩn
export interface MenuItem {
  name: string;
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
