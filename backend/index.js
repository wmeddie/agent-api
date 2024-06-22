const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Import cors

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware

// Route to fetch all agents with their conversations
app.get('/agents', async (req, res) => {
  const agents = await prisma.agent.findMany({
    include: {
      conversations: true, // Include conversations in the result
    },
  });
  res.json(agents);
});

// Route to fetch a specific conversation
app.get('/conversations/:id', async (req, res) => {
  const { id } = req.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id: parseInt(id) },
  });
  if (conversation) {
    res.json(conversation);
  } else {
    res.status(404).send('Conversation not found');
  }
});

const server = app.listen(3001, () =>
  console.log('Server is running on http://localhost:3001')
);