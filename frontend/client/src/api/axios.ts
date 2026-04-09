import axios from "axios";

let accessToken: string | null = localStorage.getItem("accessToken");
let setAccessTokenFn: any;

// 🔥 Set token globally
export const setAuthToken = (token: string, setter: any) => {
  accessToken = token;
  setAccessTokenFn = setter;

  // ✅ also persist
  localStorage.setItem("accessToken", token);
};

const authAPI = axios.create({
  baseURL: "http://localhost:3000/authAPI",
  withCredentials: true,
});

// 🔥 REQUEST INTERCEPTOR
authAPI.interceptors.request.use((config) => {
  // Always get latest token
  const token = accessToken || localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (REFRESH LOGIC)
authAPI.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 403 && !original._retry) {
      original._retry = true;

      try {
        const res = await authAPI.get("/auth/refresh");

        accessToken = res.data.accessToken;

        // ✅ update context + localStorage
        setAccessTokenFn(accessToken);
        if (accessToken) {
  setAccessTokenFn(accessToken);
  localStorage.setItem("accessToken", accessToken);
}

        original.headers.Authorization = `Bearer ${accessToken}`;

        return authAPI(original);
      } catch (refreshErr) {
        // ❌ refresh failed → logout
        accessToken = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default authAPI;