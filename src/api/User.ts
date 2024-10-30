import axios from "axios";

import { GetformRegister, GetformLogin } from "../types/types";

export class UserAPI {
  static register(param: GetformRegister) {
    const url = "http://localhost:8888/api/v1/user/register";
    return axios.post(url, param);
  }
  static login(param: GetformLogin) {
    const url = "http://localhost:8888/api/v1/user/login";
    return axios.post(url, param, { withCredentials: true });
  }
}
