export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("OK");

    try {
      const data = await request.json();
      
      // Biznes yoki oddiy xabarni aniqlash
      const message = data.business_message || data.message;
      const busConnId = data.business_connection_id || (data.business_message ? data.business_message.business_connection_id : null);

      if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;

        const reply = `Salom! Men VelWix tomonidan ishlab chiqilgan botman🌐. \nSiz yozdingiz: ${text}`;

        await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply,
            business_connection_id: busConnId // Biznes akkaunt uchun shart
          })
        });
      }
    } catch (err) {
      // Xatoni yashirmaslik uchun (faqat test paytida)
      console.error(err);
    }

    return new Response("OK");
  }
};
