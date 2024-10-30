import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosClient = axios.create({
  baseURL: "http://localhost:8888",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//tạo api refreshToken
axios.defaults.withCredentials = true;
const refreshToken = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8888/api/v1/user/refreshtoken",
      {
        withCredentials: true,
      }
    );
    localStorage.setItem("accessToken", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

let isRefreshing = false; // Biến cờ để kiểm tra xem cuộc gọi refreshToken đã được thực hiện hay chưa
let refreshPromise: Promise<any> | null = null; // Biến lưu trữ promise của cuộc gọi refreshToken
axiosClient.interceptors.request.use(
  async (config) => {
    let token;
    try {
      let date = new Date(); //Tạo ngày giờ hiện tại kiểm tra
      token = localStorage.getItem("accessToken") as any;
      const decodedToken: any = await jwtDecode(token); //giải mã token
      // console.log(decodedToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        //Kiểm tra xem giờ hết hạn token vs giờ hiện tại nếu hết thì phải gọi refreshToken để nhận token mới

        if (!isRefreshing) {
          // Nếu chưa có cuộc gọi refreshToken nào được thực hiện
          isRefreshing = true; // Đánh dấu rằng đang thực hiện cuộc gọi refreshToken
          // Tạo promise cho cuộc gọi refreshToken
          refreshPromise = refreshToken()
            .then((data) => {
              token = data;
            })
            .finally(() => {
              isRefreshing = false; // Sau khi thực hiện xong, đặt lại biến cờ
              refreshPromise = null; // Đặt lại promise thành null
            });
        }

        // Chờ cho đến khi promise của refreshToken hoàn thành
        await refreshPromise;
      }
    } catch (e) {}

    if (token !== null) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// after send request
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosClient };
