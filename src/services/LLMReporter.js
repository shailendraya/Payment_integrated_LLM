const { Configuration, OpenAIApi } = require('openai');

class LLMReporter {
  constructor(paymentService) {
    this.paymentService = paymentService;
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    this.openai = new OpenAIApi(config);
  }

  async generateSummary() {
    const status = this.paymentService.getStatus();
    const prompt = `Summarize this payment system state:
Circuit State: ${status.circuitState}
Failures: ${status.failureCountTotal}
Successes: ${status.successCount}
Last Failure: ${status.lastFailure}`;

    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      return `LLM failed: ${error.message}`;
    }
  }
}

module.exports = LLMReporter;
