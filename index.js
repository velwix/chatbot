export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("VelWix AI is Online!");

    try {
      const payload = await request.json();
      const message = payload.business_message || payload.message;

      if (!message || !message.text) return new Response("OK");

      const chatId = message.chat.id;
      const userText = message.text;
      const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

      if (!env.BOT_TOKEN) return new Response("Error: BOT_TOKEN topilmadi!");
      const token = env.BOT_TOKEN.trim().replace("bot", "");
      const tgBase = `https://api.telegram.org/bot${token}`;

      // 1. Animatsiya
      await fetch(`${tgBase}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: chatId, 
          action: "typing", 
          business_connection_id: busConnId 
        })
      });

      // 2. Birinchi xabar
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

      // 3. AI so'rovi (Llama 3.1 modeli - aqlli va tabiiy)
      let aiReply = "";
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: `Sizning ismingiz VelWix AI. Siz juda aqlli, madaniyatli va xuddi haqiqiy insondek samimiy muloqot qiladigan yordamchisiz.
Muloqot qoidalari:
1. O'zbek tili grammatikasi va imlo qoidalariga qat'iy rioya qiling. 
2. Robotdek qoliplardan qoching. Buning o'rniga samimiy va jonli tilda javob bering.
3. Telegramda yaqin do'stingiz bilan gaplashayotgandek, lekin o'zaro hurmatni saqlagan holda muloqot qiling.
4. Foydalanuvchi bilan "Siz" deb gaplashing.
5. Imlo xatolari mutlaqo bo'lmasin. So'zlarni o'zbek tili qoidalariga mos yozing.` 
            },
            { role: 'user', content: userText }
          ]
        });
        aiReply = aiResponse.response || "Xato: AI javob bera olmadi.";
      } catch (aiErr) {
        aiReply = "Hozirda AI xizmati band. Iltimos, birozdan so'ng urinib ko'ring.";
      }

      // 4. Xabarni yangilash
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

