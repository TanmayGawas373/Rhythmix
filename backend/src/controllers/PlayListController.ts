import { Request, Response } from "express";
import { PlaylistService } from "../services/PlayListService";
const playlistService = new PlaylistService();

// Initialize once when server starts
playlistService.initialize();

interface IdParams {
  id: string;
}

export class PlaylistController {

  // ▶️ Get current song
  static getCurrent(req: Request, res: Response) {
    const song = playlistService.getCurrent();
    res.json(song);
  }

  // ⏭ Next song
  static next(req: Request, res: Response) {
    const song = playlistService.next();
    if (!song) return res.status(404).json({ message: "No next song" });

    res.json(song);
  }

  // ⏮ Previous song
  static previous(req: Request, res: Response) {
    const song = playlistService.previous();
    if (!song) return res.status(404).json({ message: "No previous song" });

    res.json(song);
  }

  // ➕ Add to queue
  static enqueue(req: Request<IdParams>, res: Response) {
  const { id } = req.params;
  const playNext = req.query.playNext === "true";

  const song = playlistService.enqueue(id, playNext);

  if (!song)
    return res.status(404).json({ message: "Song not found" });

  res.json({
    message: playNext ? "Added as next song" : "Added to queue",
    song
  });
}

  // 🔍 Search song
  static search(req: Request<IdParams>, res: Response) {
    const { id } = req.params;
    const song = playlistService.search(id);

    if (!song) return res.status(404).json({ message: "Song not found" });

    res.json(song);
  }

  // ❌ Remove current
  static removeCurrent(req: Request, res: Response) {
    const song = playlistService.removeCurrent();
    if (!song) return res.status(404).json({ message: "Nothing to remove" });

    res.json({ message: "Removed", song });
  }

  // 📜 Full playlist
  static getPlaylist(req: Request, res: Response) {
    res.json(playlistService.getPlaylist());
  }

  // 📥 Queue
  static getQueue(req: Request, res: Response) {
    res.json(playlistService.getQueue());
  }

  // 📜 History
  static getHistory(req: Request, res: Response) {
    res.json(playlistService.getHistory());
  }

  static removeFromQueue(req: Request, res: Response) {
  const index = Number(req.params.index);
  const song = playlistService.removeFromQueue(index);

  if (!song)
    return res.status(404).json({ message: "Invalid index" });

  res.json({ message: "Removed from queue", song });
}

static reorderQueue(req: Request, res: Response) {
  const { from, to } = req.body;

  playlistService.moveQueueItem(from, to);

  res.json({ message: "Queue reordered" });
}
}