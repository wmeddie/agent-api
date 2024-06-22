import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Conversation from './components/Conversation';
import AgentSelection from './components/AgentSelection';

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/agents`)
      .then(response => response.json())
      .then(data => setAgents(data));
  }, []);

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
        <AgentSelection agents={agents} onSelectAgent={handleSelectAgent} />
      )}
    </div>
  );
}

export default App;