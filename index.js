export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("VelWix AI Bot is active!");
    }

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;

      if (message && message.text) {
        const chatId = message.chat.id;
        const userText = message.text;
        const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

        console.log("AI ishga tushmoqda...");

        // 1. AI ga so'rov (Llama-3 modelidan foydalanamiz)
        let aiText = "";
        try {
          const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages: [
              { role: 'system', content: 'Siz VelWix loyihasining aqlli yordamchisiz. O\'zbek tilida qisqa javob bering.' },
              { role: 'user', content: userText }
            ]
          });
          aiText = aiResponse.response;
        } catch (aiErr) {
          console.error("AI Xatosi:", aiErr.message);
          aiText = "Hozircha javob bera olmayman, texnik nosozlik.";
        }

        // 2. AI javobi + Majburiy matn
        const finalReply = `${aiText}\n\nVelWix🪐🌠`;

        // 3. Matnni yuborish
        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: finalReply,
            business_connection_id: busConnId
          }),
        });

        // 4. Logotipni yuborish
        const logoUrl = "https://files.catbox.moe/j74g4z.jpg"; // O'zingizning rasm linkini qo'ying
        
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

      return new Response("OK");
    } catch (e) {
      console.error("Umumiy xato:", e.message);
      return new Response("OK");
    }
  },
};

