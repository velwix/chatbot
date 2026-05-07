export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI is running!");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;

      if (message && message.text) {
        const chatId = message.chat.id;
        const userText = message.text;
        const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

        let aiReply = "";

        try {
          // AI modelini ishga tushirish (timeout ehtimolini kamaytirish uchun)
          const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages: [
              { role: 'system', content: 'Siz VelWix yordamchisiz. O\'zbek tilida qisqa javob bering.' },
              { role: 'user', content: userText }
            ],
            max_tokens: 256 // Javob juda uzun bo'lib ketmasligi uchun
          });
          aiReply = response.response;
        } catch (aiError) {
          console.error("AI Error:", aiError.message);
          aiReply = "Hozircha xizmatda uzilish bor, birozdan so'ng urinib ko'ring.";
        }

        // 1. Matnni yuborish
        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `${aiReply}\n\nVelWix🪐🌠`,
            business_connection_id: busConnId
          }),
        });

        // 2. Rasmni yuborish (Rasm linkini tekshiring!)
        const logoUrl = "https://files.catbox.moe/j74g4z.jpg";
        
        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            photo: logoUrl,
            business_connection_id: busConnId
          }),
        });
      }
    } catch (e) {
      console.error("Global Error:", e.message);
    }

    return new Response("OK");
  },
};
