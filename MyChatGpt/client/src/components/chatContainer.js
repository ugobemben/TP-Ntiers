import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationsList from './ConversationsList';
import ConversationService from '../services/ConversationService';

const ChatContainer = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Charger les conversations au démarrage
  useEffect(() => {
    loadConversations();
  }, []);

  // Charger les messages lorsque la conversation change
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  // Défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await ConversationService.getConversations();
      setConversations(response.data);
      
      // Sélectionner la conversation la plus récente s'il y en a
      if (response.data.length > 0) {
        setCurrentConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await ConversationService.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await ConversationService.createConversation({
        title: `Nouvelle conversation ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      });
      
      setConversations([response.data, ...conversations]);
      setCurrentConversation(response.data);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim() || !currentConversation) return;
    
    try {
      setLoading(true);
      
      // Ajouter le message utilisateur à l'interface
      const userMessage = {
        id: 'temp-' + Date.now(),
        content,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      setMessages([...messages, userMessage]);
      
      // Envoyer le message au serveur
      const response = await ConversationService.sendMessage(
        currentConversation.id,
        content
      );
      
      // Mettre à jour les messages avec la réponse du modèle
      setMessages([...messages, userMessage, response.data.aiMessage]);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Liste des conversations */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Conversations</h2>
          <button
            onClick={createNewConversation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
          >
            Nouvelle
          </button>
        </div>
        <ConversationsList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={selectConversation}
        />
      </div>
      
      {/* Zone de chat principale */}
      <div className="flex flex-col w-3/4 h-full">
        {currentConversation ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200">
              <h3 className="text-lg font-medium">{currentConversation.title}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <MessageList messages={messages} />
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <MessageInput onSendMessage={sendMessage} disabled={loading} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-600 mb-4">
                Pas de conversation sélectionnée
              </h3>
              <button
                onClick={createNewConversation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Démarrer une nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;