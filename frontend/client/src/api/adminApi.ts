import type { UserEditProps } from "../types/User";
import authAPI from "./axios";


//admin route
export const getUsers = async (search = "") => {
  const res = await authAPI.get(`/admin/users?search=${search}`);
  return res.data;
};

export const deleteUsers = async (id: string) => {
  const res = await authAPI.delete(`/admin/users/${id}`);
  return res.data;
}

export const updateUsers = async (id: string, data:UserEditProps) => {
  const res = await authAPI.put(`/admin/users/${id}`,data);
  return res.data;
}

export const getDashboardStats = async () =>{
  const res = await authAPI.get(`/admin/stats`);
  return res.data;
}

export const getSongs = async () => {
  const res = await authAPI.get("/admin/songs");
  return res.data;
};

export const deleteSong = async (id: string) => {
  await authAPI.delete(`/admin/songs/${id}`);
};

export const uploadSong = async (formData: FormData) => {
  const res = await authAPI.post("/admin/songs", formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });

  return res.data;
};

export const updateSong = async (id: string, data: FormData) => {
  const res = await authAPI.put(`/admin/songs/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  return res.data;
};