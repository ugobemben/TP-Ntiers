const { Conversation, Message } = require('../models');
const HuggingFaceService = require('../services/huggingFaceService');
const logger = require('../utils/logger');

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Vérifier si la conversation existe
    const conversation = await Conversation.findByPk(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }
    
    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']],
    });
    
    return res.json(messages);
  } catch (error) {
    logger.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, role } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Le contenu est requis' });
    }
    
    if (role !== 'user') {
      return res.status(400).json({ error: 'Seul le rôle "user" est autorisé pour les messages entrants' });
    }
    
    // Vérifier si la conversation existe
    const conversation = await Conversation.findByPk(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }
    
    // Créer le message de l'utilisateur
    const userMessage = await Message.create({
      content,
      role: 'user',
      conversationId,
    });
    
    // Récupérer tous les messages précédents pour le contexte
    const previousMessages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']],
    });
    
    // Formater les messages pour l'API Hugging Face
    const messagesForAPI = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // Générer une réponse avec l'API Hugging Face
    const aiResponse = await HuggingFaceService.generateResponse(messagesForAPI);
    
    // Créer le message de réponse
    const aiMessage = await Message.create({
      content: aiResponse,
      role: 'assistant',
      conversationId,
    });
    
    // Mettre à jour la date de la conversation
    await conversation.update({ updatedAt: new Date() });
    
    return res.status(201).json({
      userMessage,
      aiMessage,
    });
  } catch (error) {
    logger.error('Error creating message:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
};