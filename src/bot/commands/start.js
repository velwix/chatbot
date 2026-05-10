import { telegram } from "../services/tg.connect.js";
import { getDb } from "../database/db.connect.js";

export default async function start(ctx, env) {
  const chat_id = ctx.chat.id;
  const user_id = ctx.from.id;
  const username = ctx.from.username || "user";
  
  const bot = telegram(env);
  const db = getDb(env);

  const { data: channels } = await db.from('channels').select('username, name');
  
  if (channels && channels.length > 0) {
    let subStatus = true;
    const keyboard = [];

    for (const chan of channels) {
      const res = await bot.getChatMember(chan.username, user_id);
      const isMember = res.ok && ['member', 'administrator', 'creator'].includes(res.result.status);
      
      if (!isMember) {
        subStatus = false;
        keyboard.push([{ 
          text: chan.name, 
          url: `https://t.me/${chan.username.replace('@', '')}`,
          style: "danger"
        }]);
      }
    }

    if (!subStatus) {
      keyboard.push([{ 
        text: "Davom etish✅", 
        callback_data: "check_sub",
        style: "success" 
      }]);

      return await bot.sendMessage(chat_id, "Botimiz to'liq ishlashi uchun kannallarga obuna bo'ling!👇🏿📢", {
        reply_markup: { inline_keyboard: keyboard }
      });
    }
  }

  const { data: settings } = await db.from('settings').select('*').eq('user_id', user_id).single();

  const getLabel = (key, originalLabel, emoji) => {
    if (settings && settings[key] === true) {
      return `${originalLabel}✅`;
    }
    return `${originalLabel}${emoji}`;
  };

  return await bot.sendMessage(chat_id, 
    `Salom @${username},😊👋\n` +
    `Bu Sizning yordamchi chatBotingiz🛰\n` +
    `Bu bot bilan chatlarni avtomatlashtiring!🌠🌐\n` +
    `Xoziroq boshlash uchun tugmalardan foydaning!👇🏿`, 
    {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: getLabel('guide_status', "Qo'llanma", "📒"), 
              callback_data: "guide" 
            }
          ],
          [
            { 
              text: getLabel('auto_msg_status', "Avto xabar", "📧"), 
              callback_data: "auto_msg" 
            },
            { 
              text: getLabel('keyword_status', "Kalit so'z", "🔑"), 
              callback_data: "keyword" 
            }
          ],
          [
            { 
              text: getLabel('ai_status', "AI", "🌀"), 
              callback_data: "ai" 
            },
            { 
              text: getLabel('typing_anim_status', "Yozish Animatsiya", "🌠"), 
              callback_data: "typing_anim" 
            }
          ],
          [
            { 
              text: getLabel('limit_status', "Cheklov", "🔒"), 
              callback_data: "limit" 
            },
            { 
              text: getLabel('time_status', "Soat", "🕚"), 
              callback_data: "time" 
            }
          ]
        ]
      }
    }
  );
}
