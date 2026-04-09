import axios from "axios";
import type { Song } from "../types/Song";

const API = "http://localhost:3000/api/playlist";

export const getCurrent = async (): Promise<Song> => {
  const res = await axios.get(`${API}/current`);
  return res.data;
};

export const nextSong = async (): Promise<Song> => {
  const res = await axios.get(`${API}/next`);
  return res.data;
};

export const previousSong = async (): Promise<Song> => {
  const res = await axios.get(`${API}/previous`);
  return res.data;
};

export const getPlaylist = async (): Promise<Song[]> => {
  const res = await axios.get(`${API}`);
  return res.data;
};

export const getQueue = async (): Promise<Song[]> => {
  const res = await axios.get(`${API}/queue`);
  return res.data;
};

export const enqueueSong = async (
  id: string,
  playNext = false
) => {
  const res = await axios.post(
    `${API}/queue/${id}?playNext=${playNext}`
  );
  return res.data;
};

export const removeFromQueue = async (index: number) => {
  const res = await axios.delete(
    `${API}/queue/${index}`
  );
  return res.data;
};

export const reorderQueue = async (from: number, to: number) => {
  const res = await axios.put(
    `${API}/queue/reorder`,
    { from, to }
  );
  return res.data;
};

export const getHistory = async (limit?: number): Promise<Song[]> => {
  const res = await axios.get(`${API}/history`);
  const data: Song[] = res.data;

  return limit ? data.slice(0, limit) : data;
};

export const removeFromHistory = async (index: number) => {
  const res = await axios.delete(`${API}/history/${index}`);
  return res.data;
};

import authAPI from "./axios";

// export const getPlaylist = () => API.get("/playlist");

export const addSong = (data: any) =>
  authAPI.post("/playlist", data); // admin only

export const deleteSong = (id: string) =>
  authAPI.delete(`/playlist/${id}`);