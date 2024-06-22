import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Conversation from './components/Conversation';
import AgentSelection from './components/AgentSelection';

const sampleAgents = [
  { name: 'Email Sender', id: '1' },
  { name: 'Calendar Scheduler', id: '2' },
  { name: 'Internet Browser', id: '3' },
];

const sampleConversations = [];

function App() {
  const [conversations, setConversations] = useState(sampleConversations);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleNewConversation = () => {
    const newConversation = {
      title: `Conversation ${conversations.length + 1}`,
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setSelectedConversationIndex(conversations.length);
  };

  const handleSelectConversation = (index) => {
    setSelectedConversationIndex(index);
  };

  const handleAddMessage = (text) => {
    const newMessage = { sender: 'User', text };
    const updatedConversations = [...conversations];
    updatedConversations[selectedConversationIndex].messages.push(newMessage);
    setConversations(updatedConversations);
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    handleNewConversation();
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        conversations={conversations} 
        onSelectConversation={handleSelectConversation} 
        onNewConversation={handleNewConversation} 
      />
      {selectedConversationIndex !== null ? (
        <Conversation 
          conversation={conversations[selectedConversationIndex]} 
          onAddMessage={handleAddMessage} 
        />
      ) : (
        <AgentSelection agents={sampleAgents} onSelectAgent={handleSelectAgent} />
      )}
    </div>
  );
}

export default App;