import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConversationsList = ({ conversations, currentConversation, onSelectConversation }) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`p-3 rounded-md cursor-pointer transition-colors ${
            currentConversation && currentConversation.id === conversation.id
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <h4 className="font-medium truncate">{conversation.title}</h4>
          <p className="text-xs text-gray-500">
            {format(new Date(conversation.updatedAt), 'dd MMM yyyy HH:mm', {
              locale: fr,
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;