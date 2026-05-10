import { telegram } from "../services/tg.connect.js";
import { getDb } from "../database/db.connect.js";
import start from "./start.js";

export default async function textHandler(ctx, env) {
  const chat_id = ctx.chat.id;
  const user_id = ctx.from.id;
  const text = ctx.text;
  const bot = telegram(env);
  const db = getDb(env);

  const { data: settings } = await db.from('settings').select('step').eq('user_id', user_id).single();

  if (settings && settings.step === 'waiting_auto_msg') {
    
    await db.from('message').upsert({ 
      user_id: user_id, 
      auto_msg: text 
    });

    await db.from('settings').update({ 
      step: 'idle', 
      auto_msg: true 
    }).eq('user_id', user_id);

    const info = await bot.sendMessage(chat_id, "Xabar muvaffaqiyatli saqlandi!✅");
    
    setTimeout(async () => {
      await bot.deleteMessage(chat_id, info.result.message_id);
    }, 2000);

    return await start(ctx, env);
  }
}
