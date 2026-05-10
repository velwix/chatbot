import start from "./bot/commands/start.js";
import callbackRouter from "./bot/actions/callbackRouter.js";

export default {
  async fetch(req, env) {

    const url = new URL(req.url);

    
    if (url.pathname === "/set-webhook") {
      const webhookUrl = `${env.BASE_URL}/webhook`;

      const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["message", "callback_query"]
        })
      });

      const result = await res.json();
      return new Response(JSON.stringify(result, null, 2));
    }

    
    if (url.pathname === "/webhook") {
      const update = await req.json().catch(() => null);

      if (!update) {
        return new Response("OK");
      }

      try {
        if (update.message) {
          const text = update.message.text;

          if (text === "/start") {
            await start(update.message, env);   // await qo'shildi
          }
        }

        if (update.callback_query) {
          await callbackRouter(update.callback_query, env);   
        }

      } catch (err) {
        console.error(err);
      }

      
      return new Response("OK");
    }

    return new Response("Not found", { status: 404 });
  }
};