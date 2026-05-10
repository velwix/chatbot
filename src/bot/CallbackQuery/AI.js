import tg from "../services/tg.connect.js";

export default async function AI(ctx, env) {

  const chat_id = ctx.message.chat.id;
  const username = ctx.from.username || "user";

  return await tg(env, "sendMessage", {
    chat_id,
    text: `@${username}, Siz Ai Funksiyasini yoqishga rozimisiz?`,
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: "Xa✅️", 
            callback_data: "ai_yes", 
            style: "primary" 
          },
          { 
            text: "Yo'q❎️", 
            callback_data: "ai_no", 
            style: "danger" 
          }
        ]
      ]
    }
  });
}