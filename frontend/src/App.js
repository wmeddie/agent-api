import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Conversation from './components/Conversation';

const sampleConversations = [
  {
    title: 'Conversation 1',
    messages: [
      { sender: 'User', text: 'Hello!' },
      { sender: 'Bot', text: 'Hi there!' },
    ],
  },
  {
    title: 'Conversation 2',
    messages: [
      { sender: 'User', text: 'How are you?' },
      { sender: 'Bot', text: 'I am fine, thank you!' },
    ],
  },
];

function App() {
  const [conversations, setConversations] = useState(sampleConversations);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

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

  return (
    <div className="flex h-screen">
      <Sidebar 
        conversations={conversations} 
        onSelectConversation={handleSelectConversation} 
        onNewConversation={handleNewConversation} 
      />
      <Conversation 
        conversation={conversations[selectedConversationIndex]} 
        onAddMessage={handleAddMessage} 
      />
    </div>
  );
}

export default App;