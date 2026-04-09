import User from "../models/User";
import { Request, Response } from "express";

// GET all users
export const getAllUsers = async (req:Request, res:Response) => {
  const { search } = req.query;

  let filter = {};

  if (search) {
    filter = {
      email: { $regex: search, $options: "i" }, // case-insensitive
    };
  }

  const users = await User.find(filter).select("-password");

  res.json(users);
};

// GET single user
export const getUser = async (req:Request, res:Response) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
};

export const getStats = async (req:Request, res:Response) => {
  const users = await User.countDocuments();
  const songs = await Song.countDocuments();

  res.json({ users, songs });
}

// UPDATE user
export const updateUser = async (req:Request, res:Response) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id); // ✅ await

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(400).json({ message: "Cannot delete admin" });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User deleted" });
};

import Song from "../models/Song";

// CREATE

import mm from "music-metadata";
import axios from 'axios';


export const createSong = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const audioFile = files["audio"]?.[0];
    const posterFile = files["poster"]?.[0];

    let duration = 0;

    // 🎧 Extract duration
    if (audioFile?.path) {
      const response = await axios.get(audioFile.path, {
        responseType: "arraybuffer",
      });

      const metadata = await mm.parseBuffer(
        response.data,
        audioFile.mimetype
      );

      duration = metadata.format.duration || 0;
    }

    const song = await Song.create({
      title: req.body.title,
      artist: req.body.artist,
      genre: req.body.artist,
      duration: Math.floor(duration), 
      url: audioFile?.path,
      poster: posterFile?.path,
    });

    res.status(201).json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

// READ
export const getSongs = async (req:Request, res:Response) => {
  const songs = await Song.find();
  res.json(songs);
};

// UPDATE
export const updateSong = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const updateData: any = {};

    // ✅ Only update if present
    if (req.body?.title) updateData.title = req.body.title;
    if (req.body?.artist) updateData.artist = req.body.artist;
    if (req.body?.genre) updateData.genre = req.body.genre;

    if (files?.audio) {
      updateData.url = files.audio[0].path;
    }

    if (files?.poster) {
      updateData.poster = files.poster[0].path;
    }

    const updated = await Song.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed", err });
  }
};

// DELETE
export const deleteSong = async (req:Request, res:Response) => {
  await Song.findByIdAndDelete(req.params.id);
  res.json({ message: "Song deleted" });
};