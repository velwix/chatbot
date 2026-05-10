import tg from "../services/tg.connect.js";
import checkSubscription from "../services/vw.connect.js";

export default async function checkSub(ctx, env) {

  const user_id = ctx.from?.id;
  const chat_id = ctx.message?.chat?.id;

  const channel = "@VelWix_Ch";   // Hardcode qilingan kanal

  if (!user_id) {
    return await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "Xatolik yuz berdi",
      show_alert: true
    });
  }

  const sub = await checkSubscription(env, user_id, [channel]);
  
  const isJoined = sub?.results?.[channel] === true;

  if (isJoined) {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "✅ Obuna tasdiqlandi!\nBotdan foydalanish mumkin.",
      show_alert: true
    });
  } else {
    await tg(env, "answerCallbackQuery", {
      callback_query_id: ctx.id,
      text: "❌ Hali VelWix kanaliga obuna bo'lmadingiz!",
      show_alert: true
    });
  }
}