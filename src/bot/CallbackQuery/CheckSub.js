import tg from "../services/tg.connect.js";
import checkSubscription from "../services/vw.connect.js";

export default async function checkSub(ctx, env) {

  const chat_id = ctx.message?.chat?.id;
  const user_id = ctx.from?.id;

  if (!chat_id || !user_id) {
    return await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "Xatolik yuz berdi",
      show_alert: true
    });
  }

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
      text: "✅ Obuna tasdiqlandi! Botdan foydalanishingiz mumkin.",
      show_alert: true
    });
  } else {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "❌ Hali obuna bo'lmadingiz! Iltimos kanalga obuna bo'ling.",
      show_alert: true
    });
  }
}