const axios = require('axios');
const logger = require('../utils/logger');

class HuggingFaceService {
  constructor() {
    this.apiToken = process.env.HUGGINGFACE_API_TOKEN;
    this.model = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-Nemo-Instruct-2407';
    this.apiUrl = `https://api-inference.huggingface.co/models/${this.model}`;
    this.headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  async generateResponse(messages) {
    try {
      // Formater les messages pour le modèle
      const prompt = this.formatMessagesForModel(messages);
      
      logger.info(`Sending request to Hugging Face API for model: ${this.model}`);
      
      const response = await axios.post(
        this.apiUrl,
        { 
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true
          }
        },
        { headers: this.headers }
      );
      
      // Obtenir la réponse générée
      let generatedText = response.data[0]?.generated_text || '';
      
      // Nettoyer la réponse si nécessaire
      generatedText = this.cleanModelResponse(generatedText, prompt);
      
      return generatedText;
    } catch (error) {
      logger.error('Error generating response from Hugging Face:', error);
      if (error.response) {
        logger.error('API response:', error.response.data);
      }
      throw new Error('Erreur lors de la génération de la réponse');
    }
  }

  formatMessagesForModel(messages) {
    // Formater les messages pour le modèle Mistral
    // Format attendu par Mistral-Nemo-Instruct:
    // <|im_start|>user
    // Message de l'utilisateur<|im_end|>
    // <|im_start|>assistant
    // Réponse de l'assistant<|im_end|>
    
    let formattedPrompt = '';
    
    messages.forEach(message => {
      formattedPrompt += `<|im_start|>${message.role}\n${message.content}<|im_end|>\n`;
    });
    
    // Ajouter l'amorce de réponse pour l'assistant
    formattedPrompt += '<|im_start|>assistant\n';
    
    return formattedPrompt;
  }

  cleanModelResponse(response, prompt) {
    // Vérifier si la réponse contient le prompt initial et le supprimer
    if (response.startsWith(prompt)) {
      response = response.substring(prompt.length);
    }
    
    // Supprimer les balises de fin si présentes
    response = response.replace(/<\|im_end\|>/g, '');
    
    // Nettoyer tout texte après une nouvelle demande utilisateur
    const nextUserIndex = response.indexOf('<|im_start|>user');
    if (nextUserIndex !== -1) {
      response = response.substring(0, nextUserIndex);
    }
    
    return response.trim();
  }
}

module.exports = new HuggingFaceService();