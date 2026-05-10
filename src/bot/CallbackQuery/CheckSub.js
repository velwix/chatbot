import { telegram } from "../services/tg.connect.js";
import { getDb } from "../database/db.connect.js";

export default async function checkSub(ctx, env) {
  const chat_id = ctx.message.chat.id;
  const user_id = ctx.from.id;
  const callback_query_id = ctx.id;
  const message_id = ctx.message.message_id;
  
  const bot = telegram(env);
  const db = getDb(env);

  const { data: channels } = await db.from('channels').select('username');
  
  let isAllSubscribed = true;

  if (channels && channels.length > 0) {
    const checkPromises = channels.map(chan => bot.getChatMember(chan.username, user_id));
    const results = await Promise.all(checkPromises);

    for (const res of results) {
      const isMember = res.ok && ['member', 'administrator', 'creator'].includes(res.result.status);
      if (!isMember) {
        isAllSubscribed = false;
        break;
      }
    }
  }

  if (isAllSubscribed) {
    await bot.answerCallbackQuery(callback_query_id, {
      text: "Obuna tasdiqlandi Davom etishingiz mumkun!🌠",
      show_alert: false
    });

    await bot.deleteMessage(chat_id, message_id);
    
    return { status: "success", user_id, chat_id };
  } else {
    return await bot.answerCallbackQuery(callback_query_id, {
      text: "Avval Obuna bo'ling!",
      show_alert: true
    });
  }
}
