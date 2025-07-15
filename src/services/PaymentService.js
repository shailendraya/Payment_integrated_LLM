const FlakyProvider = require('../providers/FlakyProvider');
const CircuitBreaker = require('./CircuitBreaker');
const RetryHandler = require('./RetryHandler');

class PaymentService {
  constructor() {
    this.provider = new FlakyProvider();
    this.breaker = new CircuitBreaker('FlakyProvider');
    this.retryHandler = new RetryHandler(this.provider, this.breaker);
    this.successCount = 0;
    this.failureCount = 0;
  }

  async processPayment(payload) {
    if (this.breaker.isOpen()) {
      return { success: false, error: 'Circuit is open, retry later' };
    }

    const result = await this.retryHandler.retryWithBackoff(payload);

    if (result.success) this.successCount++;
    else this.failureCount++;

    return result;
  }

  getStatus() {
    return {
      circuitState: this.breaker.state,
      failureCount: this.breaker.failureCount,
      lastFailure: this.breaker.lastFailure,
      successCount: this.successCount,
      failureCountTotal: this.failureCount
    };
  }
}

module.exports = PaymentService;
