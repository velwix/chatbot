export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI System Active");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;
      if (!message || !message.text) return new Response("OK");

      // TOKEN TEKSHIRUVI
      if (!env.BOT_TOKEN) {
        console.error("XATO: BOT_TOKEN topilmadi. Cloudflare Settings'dan qo'shing!");
        return new Response("Token Missing", { status: 200 });
      }

      const chatId = message.chat.id;
      const userText = message.text;
      const fromId = message.from.id;
      const busConnId = payload.business_connection_id || null;

      const MY_ID = 6088684635; 
      const token = env.BOT_TOKEN.trim().replace("bot", "");
      const tgBase = `https://api.telegram.org/bot${token}`;

      // Faqat boshqalarga javob berish
      if (fromId === MY_ID) return new Response("OK");

      // 1. Animatsiya
      await fetch(`${tgBase}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, action: "typing", business_connection_id: busConnId })
      });

      // 2. Initial Message
      const initialRes = await fetch(`${tgBase}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: "⏳ VelWix AI fikrlamoqda...", business_connection_id: busConnId })
      });
      
      const initialData = await initialRes.json();
      if (!initialData.ok) return new Response("OK");
      const messageId = initialData.result.message_id;

      // 3. AI Request
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: "Siz VelWix loyihasining rasmiy va aqlli yordamchisisiz. Faqat o'zbek tilida, qisqa va aniq javob bering. Foydalanuvchiga 'Siz' deb murojaat qiling." 
            },
            { role: 'user', content: userText }
          ]
        });
        aiReply = aiResponse.response;
      } catch (e) {
        aiReply = "Hozirda tizim band. Birozdan so'ng urinib ko'ring.";
      }

      // 4. Edit Message
      await fetch(`${tgBase}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: `${aiReply}\n\nVelWix🪐🌠`,
          business_connection_id: busConnId
        })
      });

    } catch (err) {
      console.error("Global Error:", err.message);
    }
    return new Response("OK");
  }
};


