export const telegram = (env) => {
  const baseUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}`;

  const call = async (method, params = {}) => {
    const url = `${baseUrl}/${method}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.json();
  };

  return {
    sendMessage: (chatId, text, extra = {}) => 
      call("sendMessage", { chat_id: chatId, text, ...extra }),
    
    answerCallbackQuery: (callbackQueryId, text, showAlert = false) =>
      call("answerCallbackQuery", { callback_query_id: callbackQueryId, text, show_alert: showAlert }),
    
    editMessageText: (chatId, messageId, text, extra = {}) =>
      call("editMessageText", { chat_id: chatId, message_id: messageId, text, ...extra }),
    
    deleteMessage: (chatId, messageId) =>
      call("deleteMessage", { chat_id: chatId, message_id: messageId }),
    
    sendPhoto: (chatId, photo, caption, extra = {}) =>
      call("sendPhoto", { chat_id: chatId, photo, caption, ...extra }),

    custom: (method, params) => call(method, params)
  };
};
