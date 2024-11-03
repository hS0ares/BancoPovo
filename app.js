// Inicialização do cliente de mensagens
const client = new SalesforceMessagingClient(
    'https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com',
    '00Dbm0000084LF9',
    'GitHubSample'
);

class WhatsAppInterface {
    constructor() {
        this.chatList = document.querySelector('.chat-list');
        this.messagesContainer = document.querySelector('.messages');
        this.messageInput = document.querySelector('.message-input input');
        this.initializeEventListeners();
        this.loadMockChats();
    }

    initializeEventListeners() {
        // Listener para envio de mensagens
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.messageInput.value.trim()) {
                this.sendMessage(this.messageInput.value);
                this.messageInput.value = '';
            }
        });

        // Inicializar conexão com Salesforce
        this.initializeSalesforceConnection();
    }

    async initializeSalesforceConnection() {
        try {
            await client.generateAccessToken();
            await client.createConversation();
            
            client.subscribeToSSE((eventType, data) => {
                if (eventType === 'CONVERSATION_MESSAGE') {
                    this.handleIncomingMessage(data);
                }
            });
        } catch (error) {
            console.error('Erro ao conectar com Salesforce:', error);
        }
    }

    async sendMessage(text) {
        try {
            const messageId = await client.sendMessage(text, false);
            this.addMessage(text, 'sent', messageId);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    }

    handleIncomingMessage(data) {
        const messageData = JSON.parse(data.conversationEntry.entryPayload);
        if (messageData.abstractMessage.staticContent) {
            this.addMessage(
                messageData.abstractMessage.staticContent.text,
                'received',
                messageData.id
            );
        }
    }

    addMessage(text, type, messageId) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.dataset.messageId = messageId;
        
        const currentTime = new Date().toLocaleTimeString().slice(0, 5);
        
        messageDiv.innerHTML = `
            ${text}
            <span class="time">${currentTime}</span>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    loadMockChats() {
        // Adiciona algumas conversas de exemplo à lista
        const mockChats = [
            { name: 'Família', lastMessage: 'Oi, tudo bem?', time: '10:30' },
            { name: 'Trabalho', lastMessage: 'A reunião foi remarcada', time: '09:15' },
            { name: 'Amigos', lastMessage: 'Vamos sair hoje?', time: '08:45' }
        ];

        mockChats.forEach(chat => {
            const chatDiv = document.createElement('div');
            chatDiv.classList.add('chat-item');
            chatDiv.innerHTML = `
                <img src="https://hs0ares.github.io/Cloudy-Kicks/eintein-ico.png" alt="${chat.name}" class="profile-img">
                <div class="chat-info">
                    <h4>${chat.name}</h4>
                    <p>${chat.lastMessage}</p>
                </div>
                <span class="time">${chat.time}</span>
            `;
            this.chatList.appendChild(chatDiv);
        });
    }
}

// Inicializar a interface quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppInterface();
});