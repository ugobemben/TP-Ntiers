const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');

// Routes pour les conversations
router.get('/', conversationController.getConversations);
router.post('/', conversationController.createConversation);
router.get('/:id', conversationController.getConversation);
router.put('/:id', conversationController.updateConversation);
router.delete('/:id', conversationController.deleteConversation);

// Routes pour les messages dans une conversation
router.get('/:conversationId/messages', messageController.getMessages);
router.post('/:conversationId/messages', messageController.createMessage);

module.exports = router;