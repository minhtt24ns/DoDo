import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials:true,
});

// gắn access token vào mỗi request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if(accessToken){
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

//tự động gọi refresh token khi access token hết hạn (nhận lỗi 401)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Những api không cần check
    if(originalRequest.url.includes('/auth/signin') || 
       originalRequest.url.includes('/auth/signup') ||
       originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;


    // refresh token khi access token hết hạn (403) hoặc không tồn tại (401)
    if((error.response?.status === 401 || error.response?.status === 403) && originalRequest._retryCount < 4){
      originalRequest._retryCount+=1;
      try{
        const res = await api.post('/auth/refresh',{withCredentials: true });
        const newAccessToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      }catch(refreshError){
        useAuthStore.getState().clearState()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error);
  }
);

export default api;