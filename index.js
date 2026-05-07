export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Bot is running!");
    }

    try {
      const payload = await request.json();
      console.log("Kelgan ma'lumot:", JSON.stringify(payload)); // 1-qadam: Telegram nima yuborganini ko'ramiz

      // Xabarni aniqlash
      const message = payload.business_message || payload.message;
      const busConnId = payload.business_connection_id || (payload.business_message ? payload.business_message.business_connection_id : null);

      if (!message) {
        console.log("Xabar topilmadi (balki bu boshqa turdagi update'dir)");
        return new Response("No message");
      }

      const chatId = message.chat.id;
      const userText = message.text || "(matnli xabar emas)";
      
      console.log(`Chat ID: ${chatId}, Text: ${userText}`); // 2-qadam

      const replyText = `Salom! Men VelWix botiman🌐.\nSiz yozdingiz: ${userText}`;

      // Telegramga yuborish
      console.log("Telegramga yuborilmoqda...");
      const tgResponse = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          business_connection_id: busConnId
        }),
      });

      const tgResult = await tgResponse.json();
      console.log("Telegram javobi:", JSON.stringify(tgResult)); // 3-qadam: Telegram nima dedi?

      return new Response("OK");
    } catch (e) {
      console.error("Worker ichidagi xato:", e.message);
      return new Response("Error", { status: 200 });
    }
  },
};
