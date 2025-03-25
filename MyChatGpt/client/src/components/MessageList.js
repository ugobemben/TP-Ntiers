import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Commencez la conversation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-3/4 rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
          >
            <div className="markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            <div
              className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {format(new Date(message.createdAt), 'HH:mm', { locale: fr })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;