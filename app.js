class WhatsAppInterface {
    constructor() {
        this.chatList = document.querySelector('.chat-list');
        this.messagesContainer = document.querySelector('.messages');
        this.messageInput = document.querySelector('.message-input input');
        this.initializeEventListeners();
        this.loadMockChats();

        // Initialize SSE for receiving messages
        this.initializeSSE();
    }

    initializeEventListeners() {
        // Listener for sending messages
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.messageInput.value.trim()) {
                this.sendMessage(this.messageInput.value);
                this.messageInput.value = '';
            }
        });
    }

    async sendMessage(text) {
        try {
            // Use Salesforce integration function to send the message
            const messageId = await client.sendMessage(text, false); // Modify this as per actual function in salesforceIntegration.js
            this.addMessage(text, 'sent', messageId);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    initializeSSE() {
        // Establish connection to the SSE endpoint for real-time updates
        //const BASE_URL = 'https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com';
        
        //const eventSource = new EventSource(`${BASE_URL}/eventrouter/v1/sse`, {
            //headers: { 'Accept': 'text/event-stream' }
        //}); 
        const sseUrl = 'https://seu-app-heroku.herokuapp.com/sse-proxy';
        
        const eventSource = new EventSource(sseUrl, {
        headers: {
            'Authorization': 'Bearer seu-token-aqui',
            'X-Org-Id': 'seu-org-id-aqui'
            }
        });

        // Handle incoming messages
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleIncomingMessage(data);
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            // Optionally add reconnection logic if needed
        };
    }

    handleIncomingMessage(data) {
        // Parse incoming message from Salesforce
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
        // Add sample conversations to the chat list
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

// Initialize WhatsApp interface
document.addEventListener("DOMContentLoaded", () => {
    new WhatsAppInterface();
});
