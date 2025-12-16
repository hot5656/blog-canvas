import { useEffect } from 'react';

const N8nChatWidget = () => {
  useEffect(() => {
    // Load n8n chat CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/style.css';
    document.head.appendChild(link);

    // Load and initialize n8n chat
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://hot5656.app.n8n.cloud/webhook/3ed8be09-7f9d-4ffd-b387-0632a4417dd9/chat',
        mode: 'window',
        chatInputKey: 'chatInput',
        chatSessionKey: 'sessionId',
        initialMessages: ['Hi! 👋 How can I help you today?'],
        i18n: {
          en: {
            title: 'Chat with us',
            subtitle: 'Ask me anything about the blog',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your message...',
          },
        },
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default N8nChatWidget;
