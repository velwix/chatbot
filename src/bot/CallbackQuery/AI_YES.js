import tg from "../services/tg.connect.js";

export default async function AI_YES(ctx, env) {

  const chat_id = ctx.message.chat.id;
  const user_id = ctx.from.id;

  await env.DB.prepare(
    "UPDATE settings SET ai = 'ok' WHERE user_id = ?"
  ).bind(user_id).run();

  return await tg(env, "sendMessage", {
    chat_id,
    text:
      "Siz ai Funksiyasini yoqdingiz✅️\n" +
      "Endi sizga yozmoqchi bo'lgan foydalanuvchi\n" +
      "AI:Savol ko'rinishida yozsa ai javob beradi!🪐\n\n" +
      "Eslatma:Bu sizga yozadigan foydalanuvchi uchun bir marotaba ishlaydi!🏷"
  });
}