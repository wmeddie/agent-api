import React, { useState } from 'react';
import './App.css';
import Conversation from './components/Conversation';
import AgentSelection from './components/AgentSelection';
import AgentList from './components/AgentList'; // Import the new component

function App() {
  const initialConversations = [
    {
      title: 'User 1',
      messages: [
        { sender: 'Agent', text: 'Hi there! How can I help you today?' },
      ],
    },
    {
      title: 'User 2',
      messages: [
        { sender: 'Agent', text: 'Sure, what do you need help with?' },
      ],
    },
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

  const handleAddMessage = async (index, text) => {
    const newMessage = { sender: 'User', text };
    const updatedConversations = [...conversations];
    updatedConversations[index].messages.push(newMessage);
    setConversations(updatedConversations);

    // Make a POST request to the backend
    try {
      const response = await fetch(`http://localhost:3001/agents/1/conversations/${index}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.success) {
        const agentMessage = { sender: `Agent1`, text: data.message.text };
        updatedConversations[index].messages.push(agentMessage);
        setConversations([...updatedConversations]); // Ensure state is updated
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Conversation 
        conversation={conversations[0]} 
        onAddMessage={(text) => handleAddMessage(0, text)} 
        className="w-1/4"
      />
      <AgentList /> {/* Use the new component */}
      <Conversation 
        conversation={conversations[1]} 
        onAddMessage={(text) => handleAddMessage(1, text)} 
        className="w-1/4"
      />
    </div>
  );
}

export default App;