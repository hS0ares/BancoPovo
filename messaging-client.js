class SalesforceMessagingClient {
  constructor(baseUrl, orgId, esDeveloperName) {
    this.baseUrl = baseUrl;
    this.orgId = orgId;
    this.esDeveloperName = esDeveloperName;
    this.accessToken = null;
    this.conversationId = null;
    this.eventSource = null;
  }

  // Método auxiliar para criar headers padrão
  getDefaultHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://hs0ares.github.io',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Org-Id',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Step 1: Generate access token
  async generateAccessToken() {
    const response = await fetch(`${this.baseUrl}/iamessage/api/v2/authorization/unauthenticated/access-token`, {
        method: 'POST',
        headers: this.getDefaultHeaders(),
        body: JSON.stringify({
            orgId: this.orgId,
            esDeveloperName: this.esDeveloperName,
            capabilitiesVersion: "1",
            platform: "Web"
        }),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to generate access token: ${response.status}`);
    }

    const data = await response.json();
    this.accessToken = data.accessToken;
    return data;
  } 

  // Step 2: Create conversation
  async createConversation() {
    if (!this.accessToken) {
        throw new Error('Access token not available. Call generateAccessToken first.');
    }

    this.conversationId = this.generateUUID();
    const response = await fetch(`${this.baseUrl}/iamessage/api/v2/conversation`, {
        method: 'POST',
        headers: this.getDefaultHeaders(),
        body: JSON.stringify({
            conversationId: this.conversationId,
            esDeveloperName: this.esDeveloperName
        }),
        credentials: 'include'
    });

    if (response.status !== 201) {
        throw new Error(`Failed to create conversation: ${response.status}`);
    }

    return this.conversationId;
  }

  // Step 3: Subscribe to Server-Sent Events
  subscribeToSSE(eventCallback) {
    if (!this.accessToken) {
        throw new Error('Access token not available. Call generateAccessToken first.');
    }

    if (this.eventSource) {
        this.eventSource.close();
    }

    const url = new URL(`${this.baseUrl}/eventrouter/v1/sse`);
    url.searchParams.append('access_token', this.accessToken);

    this.eventSource = new EventSource(url, {
        headers: this.getDefaultHeaders(),
        withCredentials: true
    });

    ['ping', 'CONVERSATION_ROUTING_RESULT', 'CONVERSATION_MESSAGE'].forEach(eventType => {
        this.eventSource.addEventListener(eventType, (event) => {
            eventCallback(eventType, JSON.parse(event.data));
        });
    });

    this.eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        this.eventSource.close();
        // Tentar reconectar após 5 segundos
        setTimeout(() => this.subscribeToSSE(eventCallback), 5000);
    };
  }

  // Step 4: Send message
  async sendMessage(text, isNewMessagingSession = false) {
    if (!this.accessToken || !this.conversationId) {
      throw new Error('Access token and conversation ID required. Initialize conversation first.');
    }

    const messageId = this.generateUUID();
    const response = await fetch(`${this.baseUrl}/iamessage/api/v2/conversation/${this.conversationId}/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          inReplyToMessageId: "",
          id: messageId,
          messageType: "StaticContentMessage",
          staticContent: {
            formatType: "Text",
            text: text
          }
        },
        esDeveloperName: this.esDeveloperName,
        isNewMessagingSession: isNewMessagingSession,
        routingAttributes: {},
        language: "en"
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    return messageId;
  }

  // Utility method to generate UUID v4
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Cleanup method
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}