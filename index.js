export default {
  async fetch(request, env) {
    // Faqat POST so'rovlarini qabul qilamiz (Telegram Webhook uchun)
    if (request.method === "POST") {
      try {
        const payload = await request.json();
        
        // Telegramdan kelgan xabar ma'lumotlarini olish
        // Biznes xabarlar uchun 'business_message' obyekti ishlatiladi
        const isBusiness = !!payload.business_message;
        const message = isBusiness ? payload.business_message : payload.message;

        if (message && message.text) {
          const chatId = message.chat.id;
          const userText = message.text;
          const businessConnectionId = message.business_connection_id; // Biznes uchun muhim

          // Telegramga yuboriladigan javob matni
          const replyText = `Salom! Men VelWix Tomonidan Ishlab Chiqarilgan botman🌐 vazifam Chatlarni avtomatlashtirish Va vaqtingizni tejash⏰️🪐⭐️. \nSiz yozdingiz: ${userText}`;

          // Telegram API'ga so'rov yuborish
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: replyText,
              business_connection_id: businessConnectionId // Agar biznes xabar bo'lsa, kerak
            }),
          });
        }
      } catch (e) {
        return new Response("Xato: " + e.message, { status: 500 });
      }
    }
    return new Response("Bot ishlamoqda!", { status: 200 });
  },
};
