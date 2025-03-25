const { Conversation, Message } = require('../models');
const logger = require('../utils/logger');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      order: [['updatedAt', 'DESC']],
    });
    
    return res.json(conversations);
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findByPk(id, {
      include: [
        {
          model: Message,
          as: 'messages',
          order: [['createdAt', 'ASC']],
        },
      ],
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }
    
    return res.json(conversation);
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la conversation' });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }
    
    const conversation = await Conversation.create({
      title,
    });
    
    return res.status(201).json(conversation);
  } catch (error) {
    logger.error('Error creating conversation:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }
};

exports.updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    const conversation = await Conversation.findByPk(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }
    
    await conversation.update({ title });
    
    return res.json(conversation);
  } catch (error) {
    logger.error('Error updating conversation:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de la conversation' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findByPk(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }
    
    await conversation.destroy();
    
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de la conversation' });
  }
};