import { Node } from "../models/Node";
import { ISong } from "../models/Song";

export class DoublyLinkedList {
  head: Node | null = null;
  tail: Node | null = null;
  current: Node | null = null;
  size: number = 0;

  // 🎵 Add song to end of playlist
  append(song: ISong): void {
    const newNode = new Node(song);

    if (!this.head) {
      this.head = this.tail = this.current = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  // ➕ Insert song after current
  insertAfterCurrent(song: ISong): void {
    if (!this.current) return;

    const newNode = new Node(song);

    newNode.prev = this.current;
    newNode.next = this.current.next;

    if (this.current.next) {
      this.current.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    this.current.next = newNode;
    this.size++;
  }

  // ⏭ Move to next song
  next(): ISong | null {
    if (!this.current || !this.current.next) return null;

    this.current = this.current.next;
    return this.current.song;
  }

  // ⏮ Move to previous song
  previous(): ISong | null {
    if (!this.current || !this.current.prev) return null;

    this.current = this.current.prev;
    return this.current.song;
  }

  // ❌ Remove current song
  removeCurrent(): ISong | null {
    if (!this.current) return null;

    const removedSong = this.current.song;

    if (this.current.prev) {
      this.current.prev.next = this.current.next;
    } else {
      this.head = this.current.next;
    }

    if (this.current.next) {
      this.current.next.prev = this.current.prev;
      this.current = this.current.next;
    } else {
      this.tail = this.current.prev;
      this.current = this.current.prev;
    }

    this.size--;
    return removedSong;
  }

  // 🔍 Get current song
  getCurrent(): ISong | null {
    return this.current ? this.current.song : null;
  }

  // 📜 Convert playlist to array (useful for API)
  toArray(): ISong[] {
    const songs: ISong[] = [];
    let temp = this.head;

    while (temp) {
      songs.push(temp.song);
      temp = temp.next;
    }

    return songs;
  }
}

