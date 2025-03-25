import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ConversationService = {
  getConversations: () => {
    return axios.get(`${API_URL}/conversations`);
  },

  getConversation: (id) => {
    return axios.get(`${API_URL}/conversations/${id}`);
  },

  createConversation: (data) => {
    return axios.post(`${API_URL}/conversations`, data);
  },

  getMessages: (conversationId) => {
    return axios.get(`${API_URL}/conversations/${conversationId}/messages`);
  },

  sendMessage: (conversationId, content) => {
    return axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
      content,
      role: 'user',
    });
  },
};

export default ConversationService;