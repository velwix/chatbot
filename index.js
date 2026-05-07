export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI is Online!");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;
      if (!message || !message.text) return new Response("OK");

      const chatId = message.chat.id;
      const userText = message.text;
      const fromId = message.from.id;
      const busConnId = payload.business_connection_id || null;

      // 1. O'ZINGIZGA JAVOB BERMASLIK (ID ni tekshiring)
      const MY_ID = 6088684635; 
      if (fromId === MY_ID) {
        console.log("Xabar o'zimdan keldi, javob berilmaydi.");
        return new Response("OK");
      }

      // 2. TOKENNI TOZALASH
      if (!env.BOT_TOKEN) return new Response("BOT_TOKEN is missing in Settings!");
      const token = env.BOT_TOKEN.trim().replace("bot", "");
      const tgBase = `https://api.telegram.org/bot${token}`;

      // 3. ANIMATSIYA (Typing...)
      await fetch(`${tgBase}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, action: "typing", business_connection_id: busConnId })
      });

      // 4. BIRINCHI XABAR (⏳ ...)
      const initialRes = await fetch(`${tgBase}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "⏳ VelWix AI fikrlamoqda...",
          business_connection_id: busConnId
        })
      });
      const initialData = await initialRes.json();
      if (!initialData.ok) {
        console.error("Telegram xatosi:", initialData.description);
        return new Response("OK");
      }
      const messageId = initialData.result.message_id;

      // 5. AI SO'ROVI (Llama-3)
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: "Siz VelWix loyihasining rasmiy va aqlli yordamchisisiz. Faqat o'zbek tilida, juda qisqa va foydali javob bering. Foydalanuvchiga 'Siz' deb murojaat qiling." 
            },
            { role: 'user', content: userText }
          ]
        });
        aiReply = aiResponse.response || "Javob tayyorlashda xatolik yuz berdi.";
      } catch (aiErr) {
        aiReply = "Hozirda AI xizmati band, birozdan so'ng urinib ko'ring.";
      }

      // 6. XABARNI TAHRIRLASH
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

