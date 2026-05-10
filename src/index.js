import start from "./bot/commands/start.js";
import ad from "./bot/commands/ad.js";
import callbackRouter from "./bot/actions/callbackRouter.js";

export default {
  async fetch(req, env) {

    const url = new URL(req.url);

    if (url.pathname === "/webhook") {
      
      const update = await req.json().catch(() => null);
      
      if (!update) {
        return new Response("OK");
      }

      try {
        if (update.message) {
          const text = update.message.text;
          const chatId = update.message.chat.id;

          if (text === "/start") {
            await start(update.message, env);
          } 
          else if (text.startsWith("/ad")) {
            await ad(update.message, env);
          }
        }

        if (update.callback_query) {
          await callbackRouter(update.callback_query, env);
        }

      } catch (error) {
        console.error("Bot xatosi:", error);
      }

      return new Response("OK");
    }

    return new Response("Not found", { status: 404 });
  }
};