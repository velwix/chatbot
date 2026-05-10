import tg from "../services/tg.connect.js";
import checkSubscription from "../services/vw.connect.js";

export default async function checkSub(ctx, env) {

  const user_id = ctx.from?.id;
  const chat_id = ctx.message?.chat?.id;

  const channelRow = await env.DB.prepare(
    "SELECT username FROM channels LIMIT 1"
  ).first();

  const channel = channelRow?.username;

  if (!channel) {
    return await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "Kanal topilmadi",
      show_alert: true
    });
  }

  const sub = await checkSubscription(env, user_id, [channel]);
  const isJoined = sub.results?.[channel] || false;

  if (isJoined) {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "✅ Obuna tasdiqlandi!",
      show_alert: true
    });
  } else {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "❌ Hali obuna bo'lmadingiz!",
      show_alert: true
    });
  }
}