import { ISong } from "./Song";

export class Node {
  song: ISong;
  prev: Node | null;
  next: Node | null;

  constructor(song: ISong) {
    this.song = song;
    this.prev = null;
    this.next = null;
  }
}