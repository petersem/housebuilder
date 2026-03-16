export class InMemoryIdempotencyStore {
  records = new Map();
  ttlMs;
  cleanupInterval;

  constructor(ttlMs = 24 * 60 * 60 * 1000) {  // 24 hours default
    this.ttlMs = ttlMs;

    // Clean up expired records periodically
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  get(key) {
    return this.records.get(key);
  }

  set(key, record) {
    this.records.set(key, record);
  }

  delete(key) {
    this.records.delete(key);
  }

  cleanup() {
    const cutoff = Date.now() - this.ttlMs;

    for (const [key, record] of this.records.entries()) {
      if (record.createdAt.getTime() < cutoff) {
        this.records.delete(key);
      }
    }
  }

  stop() {
    clearInterval(this.cleanupInterval);
  }
}

