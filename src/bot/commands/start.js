import tg from "../services/tg.connect.js";
import checkSubscription from "../services/vw.connect.js";

export default async function start(ctx, env) {

  const chat_id = ctx.chat.id;
  const user_id = ctx.from.id;
  const username = ctx.from.username || "user";

  const channelRow = await env.DB.prepare(
    "SELECT username FROM channels LIMIT 1"
  ).first();

  const channel = channelRow?.username;

  const sub = await checkSubscription(env, user_id, [channel]);
  const isJoined = sub.results?.[channel] || false;

  if (!isJoined) {
    return await tg(env, "sendMessage", {
      chat_id,
      text: "Botimizdan to'liq foydalanish uchun kanallarimizga obuna bo'ling!✨️",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: channel || "Kanalga obuna bo'ling",
              url: channel ? `https://t.me/${channel.replace("@", "")}` : "https://t.me/",
              style: "danger"
            }
          ],
          [
            {
              text: "Obunamni tekshirish✅️",
              callback_data: "check_sub",
              style: "success"
            }
          ]
        ]
      }
    });
  }

  return await tg(env, "sendMessage", {
    chat_id,
    text:
      `Salom @${username},😊👋\n` +
      `Bu Sizning yordamchi chatBotingiz🛰\n` +
      `Bu bot bilan chatlarni avtomatlashtiring!🌠🌐\n` +
      `Xoziroq boshlash uchun tugmalardan foydalaning!👇🏿`,
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: "Qo'llanma📒", 
            callback_data: "guide", 
            style: "primary" 
          }
        ],
        [
          { 
            text: "Avto xabar📧", 
            callback_data: "auto_msg", 
            style: "primary" 
          },
          { 
            text: "Kalit so'z🔑", 
            callback_data: "keyword", 
            style: "primary" 
          }
        ],
        [
          { 
            text: "AI🌀", 
            callback_data: "ai", 
            style: "primary" 
          },
          { 
            text: "Yozish Animatsiya🌠", 
            callback_data: "typing_anim", 
            style: "primary" 
          }
        ],
        [
          { 
            text: "Cheklov🔒", 
            callback_data: "limit", 
            style: "primary" 
          },
          { 
            text: "Soat🕚", 
            callback_data: "time", 
            style: "primary" 
          }
        ]
      ]
    }
  });
}