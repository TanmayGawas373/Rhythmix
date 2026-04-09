import SongModel, { ISong } from "../models/Song";
import { DoublyLinkedList } from "../dataStructures/DoublyLinkedList";
import { Stack } from "../dataStructures/Stack";
import { Queue } from "../dataStructures/Queue";
import { Node } from "../models/Node";

export class PlaylistService {
  private playlist = new DoublyLinkedList();
  private history = new Stack<ISong>();
  private queue = new Queue<ISong>();
  private songMap = new Map<string, Node>();

  // 🎵 Load songs from DB and build playlist
  async initialize(): Promise<void> {
    const songs = await SongModel.find();

    songs.forEach((song) => {
      this.playlist.append(song);
      const node = this.playlist.tail!;
      this.songMap.set(song._id.toString(), node);
    });
  }

  // ▶️ Get current song
  getCurrent(): ISong | null {
    return this.playlist.getCurrent();
  }

  // ⏭ Play next song
  next(): ISong | null {
    const current = this.playlist.getCurrent();
    if (!current) return null;

    this.history.push(current);

    // Priority: queue first
    if (!this.queue.isEmpty()) {
      const nextSong = this.queue.dequeue()!;
      this.playlist.insertAfterCurrent(nextSong);
      this.playlist.next();
      return nextSong;
    }

    return this.playlist.next();
  }

  // ⏮ Play previous song
  previous(): ISong | null {
    if (this.history.isEmpty()) return null;

    const prevSong = this.history.pop()!;
    const node = this.songMap.get(prevSong._id.toString());

    if (node) {
      this.playlist.current = node;
      return node.song;
    }

    return null;
  }

  // ➕ Add song to queue
  enqueue(songId: string, playNext = false): ISong | null {
  const node = this.songMap.get(songId);
  if (!node) return null;

  if (playNext) {
    this.queue.enqueueFront(node.song);   // ⭐ Play Next
  } else {
    this.queue.enqueue(node.song);        // ⭐ Add to End
  }

  return node.song;
}

  removeFromQueue(index: number): ISong | null {
  const removed = this.queue.remove(index);
  return removed || null;
}

  // 🔍 Search song by ID
  search(songId: string): ISong | null {
    const node = this.songMap.get(songId);
    return node ? node.song : null;
  }

  // ❌ Remove current song
  removeCurrent(): ISong | null {
    return this.playlist.removeCurrent();
  }

  // 📜 Get full playlist
  getPlaylist(): ISong[] {
    return this.playlist.toArray();
  }

  // 📥 Get queue
  getQueue(): ISong[] {
    return this.queue.toArray();
  }

  // 📜 Get history
  getHistory(): ISong[] {
    return this.history.toArray();
  }

  moveQueueItem(from: number, to: number): boolean {
  this.queue.move(from, to);
  return true;
}
}