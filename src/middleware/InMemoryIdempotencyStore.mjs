export class InMemoryIdempotencyStore {
  records = new Map();
  ttlMs;
  cleanupIntervalM;

  defaultOptions = {
    ttlMs: 24 * 60 * 60 * 1000,
    cleanupIntervalM: 60
  };

  constructor(options = {}) {  // 24 hours default
    const config = { ...this.defaultOptions, ...options}
    this.ttlMs = config.ttlMs;
    this.cleanupIntervalM = config.cleanupIntervalM;
console.log(this.ttlMs)
console.log(this.cleanupIntervalM)
    // Clean up expired records periodically (hourly)
    this.cleanupIntervalm = setInterval(() => this.cleanup(), this.cleanupIntervalM * 60 * 1000);
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
        if (process.env?.NODE_ENV === "development") {
          console.log(`** Idempotency Middleware ** Key expired - ${key}`);
        }
        this.records.delete(key);
      }
    }
  }

  stop() {
    clearInterval(this.cleanupInterval);
  }
}

