const messagesDiv = document.getElementById('messages');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, sender = 'You') {
    const p = document.createElement('p');
    p.textContent = `${sender}: ${text}`;
    messagesDiv.appendChild(p);
}

sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) {
        appendMessage(text);
        input.value = '';
        // TODO: send message to backend or chat service
    }
});
