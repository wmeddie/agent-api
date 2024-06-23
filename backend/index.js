const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Import cors

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware

// New Agent Routes
app.post('/agents/:agentId/conversations/:userId', async (req, res) => {
  const { agentId, userId } = req.params;
  const randomMessages = [
    "How can I assist you today?",
    "What can I do for you?",
    "Is there anything you need help with?",
    "How may I help you?",
    "What do you need assistance with?"
  ];
  const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  const message = {
    role: `Agent${agentId}`,
    text: randomMessage
  };

  // Simulate creating a conversation and appending a message
  // In a real application, you would interact with your database here

  res.status(200).json({ message, success: true });
});

// sanity check agents route
app.get('/agents', async (req, res) => {
    // return an array of static data
    res.json([
        { id: 1, name: 'Email Sender' },
        { id: 2, name: 'Calendar Scheduler' },
        { id: 3, name: 'Internet Search' },
    ]);
});

const server = app.listen(3001, () =>
  console.log('Server is running on http://localhost:3001')
);