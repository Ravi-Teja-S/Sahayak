require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend from /public

// Chat route
app.post('/chat', async (req, res) => {
  const { prompt, context } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mixtral-8x7b',
        messages: [
          { role: 'system', content: context || "You are a helpful assistant." },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0]?.message?.content || "No valid response.";
    res.json({ response: reply });
  } catch (error) {
    console.error('❌ OpenRouter API Error:', error?.response?.data || error.message);
    res.status(500).json({ response: "❌ Assistant failed to respond. Please try again later." });
  }
});

// Fallback route to handle undefined routes (useful for serving frontend routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Default to frontend's main file
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
