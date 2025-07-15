require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const PaymentService = require('./services/PaymentService');
const LLMReporter = require('./services/LLMReporter');

const app = express();
const port = 3000;
app.use(bodyParser.json());

const paymentService = new PaymentService();
const llmReporter = new LLMReporter(paymentService);

app.post('/pay', async (req, res) => {
  const result = await paymentService.processPayment(req.body);
  res.status(result.success ? 200 : 500).json(result);
});

app.get('/status/summary', async (req, res) => {
  const summary = await llmReporter.generateSummary();
  res.json({ summary });
});

app.get('/status', (req, res) => {
  res.json(paymentService.getStatus());
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
