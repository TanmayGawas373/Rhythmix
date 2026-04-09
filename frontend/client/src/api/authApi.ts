import authAPI from "./axios";

export const loginUser = (data: any) =>
  authAPI.post("/auth/login", data);

export const getProfile = () =>
  authAPI.get("/user/profile");

// ✅ REGISTER
export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => authAPI.post("/auth/register", data);

export const verifyEmail = (token: string|undefined)=>authAPI.get(`/auth/verify/${token}`);
