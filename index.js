export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI is active!");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;
      if (!message || !message.text) return new Response("OK");

      const chatId = message.chat.id;
      const userText = message.text;
      const busConnId = payload.business_connection_id || null;

      // 1. "Typing" animatsiyasini tepada chiqarish
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          action: "typing",
          business_connection_id: busConnId
        })
      });

      // 2. "AI Javob bermoqda..." xabarini yuborish
      const initialRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "⏳ AI javob tayyorlamoqda...",
          business_connection_id: busConnId
        })
      });
      const initialMsg = await initialRes.json();
      const messageId = initialMsg.result.message_id;

      // 3. AI dan javob olish (Gemma modelini sinab ko'ramiz - muqobil sifatida)
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/google/gemma-7b-it-lora', {
          messages: [
            { role: 'system', content: 'Siz VelWix yordamchisiz. O\'zbek tilida qisqa javob bering.' },
            { role: 'user', content: userText }
          ]
        });
        aiReply = aiResponse.response;
      } catch (e) {
        aiReply = "Kechirasiz, tizimda yuklama yuqori.";
      }

      // 4. O'sha xabarni tahrirlash (AI javobini ko'rsatish)
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

      // 5. Logotipni yuborish
      const logoUrl = "https://raw.githubusercontent.com/VelWix/assets/main/vw.logo.png";
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
      console.error(err);
    }
    return new Response("OK");
  }
};
