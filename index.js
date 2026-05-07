export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("VelWix AI Bot is active!", { status: 200 });
    }

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;

      if (message && message.text) {
        const chatId = message.chat.id;
        const userText = message.text;
        const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

        // 1. AI ga so'rov yuborish
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { role: 'system', content: 'Siz VelWix loyihasining aqlli yordamchisiz. O\'zbek tilida qisqa, aniq va xushmuomala javob bering.' },
            { role: 'user', content: userText }
          ]
        });

        // 2. AI javobiga majburiy matnni qo'shish
        const finalReply = `${aiResponse.response}\n\nVelWix🪐🌠`;

        // 3. Matnli xabarni yuborish
        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: finalReply,
            business_connection_id: busConnId
          }),
        });

        // 4. Logotipni (vw.logo.png) yuborish
        // Izoh: Rasm internetda ochiq manzilda (URL) bo'lishi kerak
        const logoUrl = "https://store-88w.pages.dev/assets/PubgmUc-LD39Avrp.png"; // O'zingizning real rasm manzilingizni qo'ying
        
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

      return new Response("OK", { status: 200 });
    } catch (e) {
      console.error("Xato yuz berdi:", e.message);
      return new Response("Error", { status: 200 });
    }
  },
};

