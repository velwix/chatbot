import { telegram } from "../services/tg.connect.js";

export default async function guide(ctx, env) {
  const chat_id = ctx.message.chat.id;
  const callback_query_id = ctx.id;
  const bot = telegram(env);

  await bot.answerCallbackQuery(callback_query_id);

  return await bot.sendMessage(chat_id, "Botdan foydalanish bo'yicha to'liq qo'llanma bilan quyidagi havola orqali tanishishingiz mumkin:👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Qo'llanmani o'qish📖",
            url: "https://t.me/VelWix_Ch/8"
          }
        ]
      ]
    }
  });
}
