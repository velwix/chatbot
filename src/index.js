import { telegram } from "./bot/services/tg.connect.js";
import { getDb } from "./bot/database/db.connect.js";
import start from "./bot/Commands/start.js";
import callbackRouter from "./bot/actions/CallbackRouter.js";
import textHandler from "./bot/Commands/textHandler.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Bot is running...");
    }

    try {
      const update = await request.json();
      const bot = telegram(env);
      const db = getDb(env);

      if (update.callback_query) {
        await callbackRouter(update.callback_query, env);
      }

      if (update.message) {
        const msg = update.message;
        if (msg.text === "/start") {
          await start(msg, env);
        } else {
          await textHandler(msg, env);
        }
      }

      if (update.business_message) {
        const bMsg = update.business_message;
        const business_connection_id = bMsg.business_connection_id;
        const sender_id = bMsg.from.id;
        const chat_id = bMsg.chat.id;

        const { data: settings } = await db.from('settings')
          .select('auto_msg')
          .eq('user_id', sender_id)
          .single();

        if (settings && settings.auto_msg === true) {
          const { data: msgData } = await db.from('message')
            .select('auto_msg')
            .eq('user_id', sender_id)
            .single();

          if (msgData && msgData.auto_msg) {
            await bot.call("sendMessage", {
              business_connection_id: business_connection_id,
              chat_id: chat_id,
              text: msgData.auto_msg
            });
          }
        }
      }

      return new Response("OK", { status: 200 });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }
};
