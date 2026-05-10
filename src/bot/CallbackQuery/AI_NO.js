import tg from "../services/tg.connect.js";

export default async function AI_NO(ctx, env) {

  const chat_id = ctx.message.chat.id;
  const user_id = ctx.from.id;

  await env.DB.prepare(
    "UPDATE settings SET ai = 'off' WHERE user_id = ?"
  ).bind(user_id).run();

  return await tg(env, "sendMessage", {
    chat_id,
    text: "Siz Ai Tugmasini bekor qildingiz Va asosiy menu ga qaytdingiz✅️🌀"
  });
}