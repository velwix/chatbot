import tg from "../services/tg.connect.js";
import checkSubscription from "../services/vw.connect.js";

export default async function checkSub(ctx, env) {

  const user_id = ctx.from?.id;
  const chat_id = ctx.message?.chat?.id;

  if (!user_id) {
    return await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "Xatolik: User ID topilmadi",
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
      text: "Kanal bazada topilmadi",
      show_alert: true
    });
  }

  // Tekshirish
  const sub = await checkSubscription(env, user_id, [channel]);
  
  console.log("Subscription natijasi:", JSON.stringify(sub)); // Debug uchun

  const isJoined = sub?.results?.[channel] === true || sub?.results?.[channel] === "true";

  if (isJoined) {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "✅ Obuna tasdiqlandi!\nBotdan foydalanish mumkin.",
      show_alert: true
    });
  } else {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "❌ Hali obuna bo'lmadingiz!\nIltimos kanalga obuna bo'ling.",
      show_alert: true
    });
  }
}