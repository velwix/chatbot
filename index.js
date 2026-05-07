export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI is active!");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;
      if (!message || !message.text) return new Response("OK");

      const chatId = message.chat.id;
      const userText = message.text;
      const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

      // 1. "Typing" holatini ko'rsatish
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          action: "typing",
          business_connection_id: busConnId
        })
      });

      // 2. Birinchi xabarni yuborish va xatoni tekshirish
      const initialRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "⏳ VelWix AI javob tayyorlamoqda...",
          business_connection_id: busConnId
        })
      });
      
      const initialData = await initialRes.json();
      
      // Agar xabar yuborishda xato bo'lsa, logga yozamiz
      if (!initialData.ok) {
        console.error("Telegram Error (Initial):", initialData.description);
        return new Response("OK");
      }

      const messageId = initialData.result.message_id;

      // 3. AI dan javob olish
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
          messages: [
            { role: 'system', content: 'Siz VelWix aqlli yordamchisiz. O\'zbek tilida qisqa javob bering.' },
            { role: 'user', content: userText }
          ]
        });
        aiReply = aiResponse.response;
      } catch (e) {
        aiReply = "Hozircha tizimda yuklama yuqori, javob bera olmayman.";
      }

      // 4. Xabarni tahrirlash
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: `${aiReply}\n\nVelWix🪐🌠`,
          business_connection_id: busConnId
        })
      });

      // 5. Rasm yuborish
      const logoUrl = "https://files.catbox.moe/j74g4z.jpg";
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          photo: logoUrl,
          business_connection_id: busConnId
        })
      });

    } catch (err) {
      console.error("Global Catch:", err.message);
    }
    return new Response("OK");
  }
};

