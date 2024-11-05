// salesforceIntegration.js

async function generateAccessToken() {
    const response = await fetch('https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com/iamessage/api/v2/authorization/unauthenticated/access-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orgId: "00Dbm0000084LF9",
            esDeveloperName: "GitHubSample",
            capabilitiesVersion: "1",
            platform: "Web"
        })
    });
    const data = await response.json();
    return data.accessToken;
}

async function createConversation(accessToken) {
    const conversationId = crypto.randomUUID(); // Generates a UUID
    const response = await fetch('https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com/iamessage/api/v2/conversation', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conversationId: conversationId,
            esDeveloperName: "GitHubSample"
        })
    });
    if (response.status === 201) {
        console.log("Conversation created successfully.");
        return conversationId;
    } else {
        console.error("Failed to create conversation.");
    }
}

async function subscribeToSSE(accessToken) {
    //const url = 'https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com/eventrouter/v1/sse';
    const url = 'https://proxysse-a1e7e16f5fa5.herokuapp.com';
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Org-Id': '00Dbm0000084LF9',
            'Accept': 'text/event-stream'
        }
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    // Asynchronously process the stream
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        console.log("SSE event:", chunk);  // This will log each SSE event as they are received
    }
}

async function sendMessage(accessToken, conversationId, messageText) {
    const messageId = crypto.randomUUID(); // Generates a unique message ID

    const response = await fetch(`https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com/iamessage/api/v2/conversation/${conversationId}/message`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: {
                inReplyToMessageId: "",
                id: messageId,
                messageType: "StaticContentMessage",
                staticContent: {
                    formatType: "Text",
                    text: messageText
                }
            },
            esDeveloperName: "GitHubSample",
            isNewMessagingSession: true,
            routingAttributes: {},
            language: "en"
        })
    });

    if (response.ok) {
        console.log("Message sent successfully.");
    } else {
        console.error("Failed to send message.");
    }
}

// To initiate SSE after access token is obtained
async function initiateChat() {
    const accessToken = await generateAccessToken();
    if (accessToken) {
        const conversationId = await createConversation(accessToken);
        if (conversationId) {
            subscribeToSSE(accessToken);
            await sendMessage(accessToken, conversationId, "Hello from the client!");
        }
    }
}
