class RetryHandler {
    constructor(provider, breaker) {
      this.provider = provider;
      this.breaker = breaker;
    }
  
    async retryWithBackoff(payload) {
      const delays = [500, 1000, 2000];
      for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
          const response = await this.provider.process(payload);
          this.breaker.reset();
          return { success: true, response };
        } catch (err) {
          this.breaker.recordFailure();
          if (attempt < delays.length) await new Promise(r => setTimeout(r, delays[attempt]));
        }
      }
      return { success: false, error: 'Provider failed after retries' };
    }
  }
  
  module.exports = RetryHandler;
  