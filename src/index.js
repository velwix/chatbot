import start from "./bot/commands/start.js";
import callbackRouter from "./bot/actions/callbackRouter.js";

export default {
  async fetch(req, env) {

    const url = new URL(req.url);

    
    if (url.pathname === "/webhook-set") {
      const setUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`;

      const res = await fetch(setUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: `${env.BASE_URL}/webhook`
        })
      });

      return new Response(await res.text());
    }

    
    if (url.pathname === "/webhook") {

      const update = await req.json();

      
      if (update.message) {

        const text = update.message.text;

        if (text === "/start") {
          return start(update.message, env);
        }

      }

      
      if (update.callback_query) {
        return callbackRouter(update.callback_query, env);
      }

      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }
};