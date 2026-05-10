import tg from "../services/tg.connect.js";

export default async function start(ctx, env) {
  const chat_id = ctx.chat.id;
  const username = ctx.from.username || "user";

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
