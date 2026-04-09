// export class Queue<T> {
//   private items: T[] = [];

//   enqueue(item: T): void {
//     this.items.push(item);
//   }

//   dequeue(): T | undefined {
//     return this.items.shift();
//   }

//   peek(): T | undefined {
//     return this.items[0];
//   }

//   isEmpty(): boolean {
//     return this.items.length === 0;
//   }

//   size(): number {
//     return this.items.length;
//   }

//   toArray(): T[] {
//     return [...this.items];
//   }
// }

export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  enqueueFront(item: T): void {
    this.items.unshift(item);   // ⭐ Play Next
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  remove(index: number): T | undefined {
    if (index < 0 || index >= this.items.length) return undefined;
    return this.items.splice(index, 1)[0];
  }

  move(from: number, to: number): void {
    if (
      from < 0 || from >= this.items.length ||
      to < 0 || to >= this.items.length
    ) return;

    const [item] = this.items.splice(from, 1);
    this.items.splice(to, 0, item);
  }

  toArray(): T[] {
    return [...this.items];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}