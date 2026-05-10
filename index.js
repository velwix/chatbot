import { tgConnect } from './src/bot/services/tg.connect.js';
import { handleStart } from './src/bot/commands/start.js';
import { handleStartCallback } from './src/bot/CallbackQuery/StartButton.js';

export default {
  async fetch(request, env) {
    const tg = tgConnect(env.BOT_TOKEN);
    const url = new URL(request.url);

    if (url.pathname === "/webhook") {
      const webhookUrl = `${url.origin}/`;
      const res = await tg.request('setWebhook', { url: webhookUrl });
      return new Response(JSON.stringify(res), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST") {
      try {
        const update = await request.json();

        if (update.message?.text === "/start") {
          await handleStart(
            update.message.chat.id, 
            env, 
            update.message.from.username
          );
        }

        if (update.callback_query?.data === "check_sub") {
          await handleStartCallback(update, env);
        }

      } catch (e) {
        return new Response("OK", { status: 200 });
      }
    }

    return new Response("Bot is running...", { status: 200 });
  }
};
