// Simple in-memory store for messages
const store = {
    messages: {} // { chatId: [messages...] }
};

// Save new messages into store
function addMessage(chatId, msg) {
    if (!store.messages[chatId]) store.messages[chatId] = [];
    store.messages[chatId].push(msg);

    // Optional: limit history to last 100 messages per chat
    if (store.messages[chatId].length > 100) {
        store.messages[chatId] = store.messages[chatId].slice(-100);
    }
}

module.exports = {
    store,
    addMessage
};
