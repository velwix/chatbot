export const telegram = (env) => {
  const baseUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}`;

  const call = async (method, params = {}) => {
    const response = await fetch(`${baseUrl}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.json();
  };

  return {
    call,
    sendMessage: (chatId, text, extra = {}) => 
      call("sendMessage", { chat_id: chatId, text, ...extra }),
    
    getChatMember: (chatId, userId) => 
      call("getChatMember", { chat_id: chatId, user_id: userId }),
    
    answerCallbackQuery: (callbackQueryId, extra = {}) => 
      call("answerCallbackQuery", { callback_query_id: callbackQueryId, ...extra }),
    
    editMessageText: (chatId, messageId, text, extra = {}) => 
      call("editMessageText", { chat_id: chatId, message_id: messageId, text, ...extra }),
    
    deleteMessage: (chatId, messageId) => 
      call("deleteMessage", { chat_id: chatId, message_id: messageId })
  };
};
