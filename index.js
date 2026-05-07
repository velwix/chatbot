export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI is Online!");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;
      
      // Xabarda matn bo'lmasa to'xtatamiz
      if (!message || !message.text) return new Response("OK");

      const chatId = message.chat.id;
      const userText = message.text;
      const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

      // 1. TOKEN va URL (Setting-dan olingan BOT_TOKEN)
      if (!env.BOT_TOKEN) return new Response("Error: BOT_TOKEN topilmadi!");
      const token = env.BOT_TOKEN.trim().replace("bot", "");
      const tgBase = `https://api.telegram.org/bot${token}`;

      // 2. Typing... (Animatsiya)
      await fetch(`${tgBase}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: chatId, 
          action: "typing", 
          business_connection_id: busConnId 
        })
      });

      // 3. Birinchi xabarni yuborish (Kutish effekti)
      const initialRes = await fetch(`${tgBase}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "⏳ VelWix AI o'ylamoqda...",
          business_connection_id: busConnId
        })
      });
      const initialData = await initialRes.json();
      if (!initialData.ok) return new Response("OK");
      const messageId = initialData.result.message_id;

      // 4. AI so'rovi (Llama-3 modeli)
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: "Siz VelWix loyihasining aqlli yordamchisiz. O'zbek tilida qisqa, aniq va foydali javob bering. Foydalanuvchiga 'Siz' deb murojaat qiling." 
            },
            { role: 'user', content: userText }
          ]
        });
        aiReply = aiResponse.response || "Xato: AI javob bera olmadi.";
      } catch (aiErr) {
        aiReply = "Hozirda AI xizmati band. Iltimos, birozdan so'ng urinib ko'ring.";
      }

      // 5. Xabarni AI javobi bilan yangilash (Edit)
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
      console.error("Global xato:", err.message);
    }

    return new Response("OK");
  }
};

