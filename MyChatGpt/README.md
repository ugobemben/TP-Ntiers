# Mon ChatGPT - Application N-Tiers

Application de chat intelligente basée sur le modèle Mistral-Nemo-Instruct-2407 de Hugging Face.

## Architecture

Ce projet est construit avec une architecture N-Tiers :

1. **Frontend** : Interface utilisateur React permettant d'écrire des messages et de gérer les conversations
2. **Backend** : API RESTful qui communique avec Hugging Face et gère les conversations
3. **Base de données** : PostgreSQL pour stocker l'historique des conversations

## Installation et démarrage

### Prérequis
- Node.js (v14+)
- PostgreSQL
- Compte et token API Hugging Face

### Configuration de la base de données

```bash
# Connexion à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE chatgpt_db;

# Quitter
\q