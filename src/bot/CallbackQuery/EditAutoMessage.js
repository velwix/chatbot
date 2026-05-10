import { telegram } from "../services/tg.connect.js";
import { getDb } from "../database/db.connect.js";

export default async function editAutoMessage(ctx, env) {
  const chat_id = ctx.message.chat.id;
  const user_id = ctx.from.id;
  const bot = telegram(env);
  const db = getDb(env);

  await bot.answerCallbackQuery(ctx.id);

  await db.from('settings').update({ step: 'waiting_auto_msg' }).eq('user_id', user_id);

  await bot.deleteMessage(chat_id, ctx.message.message_id);

  return await bot.sendMessage(chat_id, 
    "Mavjud avto xabarni tahrirlash uchun yangi matnni yuboring!✏️\n" +
    "Emoji va havolalar ishlatish mumkin✅", 
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Bekor qilish❌", callback_data: "auto_msg" }]]
      }
    }
  );
}
