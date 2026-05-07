export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI System Active");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;
      if (!message || !message.text) return new Response("OK");

      const chatId = message.chat.id;
      const userText = message.text;
      const fromId = message.from.id; // Xabar yuborgan shaxsning ID raqami
      const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

      // --- SOZLAMALAR ---
      const MY_ID = 6088684635; // BU YERGA O'ZINGIZNING TELEGRAM ID RAQAMINGIZNI YOZING
      const token = env.BOT_TOKEN.trim().replace("bot", "");
      const tgBase = `https://api.telegram.org/bot${token}`;

      // 1. Agar xabar o'zingizdan kelgan bo'lsa, AI javob bermaydi
      if (fromId === MY_ID) {
        return new Response("OK");
      }

      // 2. "Typing" animatsiyasi
      await fetch(`${tgBase}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          action: "typing",
          business_connection_id: busConnId
        })
      });

      // 3. "AI javob bermoqda..." xabari
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
      if (!initialData.ok) return new Response("OK");
      const messageId = initialData.result.message_id;

      // 4. MUKAMMAL SYSTEM PROMPT bilan AI so'rovi
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: `Siz VelWix loyihasining rasmiy va aqlli yordamchisisiz. 
              Sizning ismingiz: VelWix AI. 
              Vazifangiz: Foydalanuvchilarga texnologiyalar, biznesni avtomatlashtirish va chatbotlar haqida yordam berish. 
              Qoidalaringiz:
              1. Faqat o'zbek tilida gapiring.
              2. Javoblaringiz qisqa, lirikadan yiroq va juda aniq bo'lsin.
              3. Agar savolga javobni bilmasangiz, muloyimlik bilan adminga bog'lanishni maslahat bering.
              4. Foydalanuvchiga "Siz" deb murojaat qiling.` 
            },
            { role: 'user', content: userText }
          ],
          max_tokens: 1000
        });
        aiReply = aiResponse.response;
      } catch (e) {
        aiReply = "Hozirda tizim bandligi sababli javob bera olmayman. Birozdan so'ng urinib ko'ring.";
      }

      // 5. Xabarni tahrirlash (AI javobini ko'rsatish)
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


