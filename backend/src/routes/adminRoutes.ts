import express from "express";
import { protect, isAdmin } from "../middlewares/auth.middleware";
import { getAllUsers, getUser, updateUser, deleteUser, createSong, getSongs, updateSong, deleteSong, getStats  } from "../controllers/AdminController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({ message: "Admin Access Granted" });
});

// Get all users
router.get("/users", protect, isAdmin, getAllUsers);

// Get single user
router.get("/users/:id", protect, isAdmin, getUser);

// Update user
router.put("/users/:id", protect, isAdmin, updateUser);

// Delete user
router.delete("/users/:id", protect, isAdmin, deleteUser);

// Create song
router.post(
  "/songs",
  protect,
  isAdmin,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  createSong
);

// Get all songs
router.get("/songs", protect, isAdmin, getSongs);

// Update song
router.put(
  "/songs/:id",
  protect,
  isAdmin,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  updateSong
);

// Delete song
router.delete("/songs/:id", protect, isAdmin, deleteSong);

router.get("/stats", protect, isAdmin, getStats);


export default router;