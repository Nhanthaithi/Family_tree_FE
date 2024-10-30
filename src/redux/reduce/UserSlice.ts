import { UserAPI } from "../../api/User";
import { GetformLogin } from "../../types/types";
import { createAsyncThunk } from "./../../../node_modules/@reduxjs/toolkit/src/createAsyncThunk";

export const register = createAsyncThunk(
  "register/fecthauthAPI",
  async (payload: any) => {
    try {
      const response = await UserAPI.register(payload);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: GetformLogin) => {
    try {
      const response = await UserAPI.login(userData);
      localStorage.setItem("userLogin", JSON.stringify(response.data.data));
      localStorage.setItem("accessToken", response.data.accessToken);
      return response;
    } catch (error) {
      return error;
    }
  }
);
