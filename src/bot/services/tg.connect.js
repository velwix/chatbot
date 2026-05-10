export const tgConnect = (token) => {
  const baseUrl = `https://api.telegram.org/bot${token}`;

  const call = async (method, payload = {}) => {
    const response = await fetch(`${baseUrl}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  };

  return {
    sendMessage: (chat_id, text, options = {}) => 
      call('sendMessage', { chat_id, text, ...options }),
    
    request: (method, payload) => call(method, payload)
  };
};
