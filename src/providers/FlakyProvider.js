class FlakyProvider {
    async process(payload) {
      const fail = Math.random() < 0.3;
      if (fail) throw new Error('Provider Error');
      return { id: Math.random().toString(36).substring(7), status: 'processed' };
    }
  }
  
  module.exports = FlakyProvider;
  