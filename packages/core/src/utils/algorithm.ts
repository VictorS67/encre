export class Queue<T> {
  private items: T[] = [];

  // Add an element to the end of the queue
  enqueue(item: T): void {
    this.items.push(item);
  }

  // Remove and return the first element from the queue
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items.shift();
  }

  // Return the first element from the queue without removing it
  peek(): T | undefined {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Return the size of the queue
  size(): number {
    return this.items.length;
  }

  // Clear the queue
  clear(): void {
    this.items = [];
  }
}
