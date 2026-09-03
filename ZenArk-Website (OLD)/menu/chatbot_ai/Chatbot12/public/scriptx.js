const chatBox = document.getElementById('chat-box');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let messageHistory = []; 

async function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user-msg');
    inputField.value = '';
    messageHistory.push({ role: "user", content: userText });

    const loadingId = appendMessage("AI sedang berpikir...", 'bot-msg loading');

    try {
        // Melakukan request ke Backend kita sendiri (server.js), bukan langsung ke OpenRouter
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: messageHistory })
        });

        const data = await response.json();
        document.getElementById(loadingId).remove();

        if (response.ok) {
            const botText = data.choices.message.content;
            appendMessage(botText, 'bot-msg');
            messageHistory.push({ role: "assistant", content: botText });
        } else {
            const errorMsg = data.error?.message || "Terjadi kesalahan pada AI.";
            appendMessage("Error: " + errorMsg, 'bot-msg');
        }
    } catch (error) {
        document.getElementById(loadingId).remove();
        appendMessage("Gagal terhubung ke server backend.", 'bot-msg');
    }
}

function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`; 
    msgDiv.textContent = text;
    msgDiv.id = 'msg-' + Date.now();
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv.id;
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});