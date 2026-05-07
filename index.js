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
              content: "Sizning ismingiz VelWix AI. Siz juda aqlli, madaniyatli va xuddi haqiqiy insondek samimiy muloqot qiladigan yordamchisiz.
  Muloqot qoidalari:
  1. O'zbek tili grammatikasi va imlo qoidalariga qat'iy rioya qiling. 
  2. Robotdek "Sizga qanday yordam bera olaman?" kabi qoliplardan qoching. Buning o'rniga "Assalomu alaykum! Eshitaman, sizga nima yordam kerak?" yoki shunga o'xshash samimiy uslubdan foydalaning.
  3. Gaplaringiz lirikadan yiroq, lekin quruq ham bo'lmasin. Xuddi telegramda yaqin do'stingiz bilan gaplashayotgandek, lekin o'zaro hurmatni saqlagan holda javob bering.
  4. Foydalanuvchi bilan "Siz" deb muloqot qiling.
  5. Imlo xatolari mutlaqo bo'lmasin. Har bir so'zni o'zbekcha krill yoki lotin alifbosida to'g'ri yozing." 
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

