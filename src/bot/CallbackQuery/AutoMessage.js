import { telegram } from "../services/tg.connect.js";
import { getDb } from "../database/db.connect.js";

export default async function autoMessage(ctx, env) {
  const chat_id = ctx.message.chat.id;
  const user_id = ctx.from.id;
  const callback_query_id = ctx.id;
  const message_id = ctx.message.message_id;
  
  const bot = telegram(env);
  const db = getDb(env);

  await bot.answerCallbackQuery(callback_query_id);

  const { data: settings } = await db.from('settings').select('auto_msg').eq('user_id', user_id).single();
  const { data: msgData } = await db.from('message').select('auto_msg').eq('user_id', user_id).single();

  const backButton = { text: "Ortga qaytish🛰", callback_data: "back_to_menu" 
style: "primary"};

  if (settings && settings.auto_msg === true && msgData && msgData.auto_msg) {
    return await bot.sendMessage(chat_id, 
      `Sizda Avto Xabar yoniq✅\n` +
      `Xabar matni:${msgData.auto_msg}`, 
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Taxrirlash✏️", callback_data: "edit_auto_msg"
style: "danger" }],
            [backButton]
          ]
        }
      }
    );
  } else {
    return await bot.sendMessage(chat_id, 
      `Sizda avto xabar qo'shilmagan!\n` +
      `Qo'shish uchun pastdagi Tugmani bosing👇🏿`, 
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Xabar qo'shish📧🔑", callback_data: "add_auto_msg"
style: "succes" }],
            [backButton]
          ]
        }
      }
    );
  }
}
