const fs = require('fs');
const path = require('path');

class CircuitBreaker {
  constructor(name) {
    this.name = name;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailure = null;
    this.failureThreshold = 5;
    this.coolDown = 30000; // 30 seconds
    this.halfOpenTested = false;
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailure = new Date();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.save();
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.halfOpenTested = false;
    this.save();
  }

  isOpen() {
    if (this.state === 'OPEN') {
      const timeSinceFailure = Date.now() - new Date(this.lastFailure).getTime();
      if (timeSinceFailure > this.coolDown) {
        if (!this.halfOpenTested) {
          this.state = 'HALF_OPEN';
          this.halfOpenTested = true;
          return false; // allow test request
        } else {
          return true;
        }
      }
      return true;
    }
    return false;
  }

  save() {
    const file = path.join(__dirname, '../data/state.json');
    fs.writeFileSync(file, JSON.stringify({
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      lastFailure: this.lastFailure
    }, null, 2));
  }
}

module.exports = CircuitBreaker;
