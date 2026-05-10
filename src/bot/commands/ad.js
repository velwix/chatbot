import tg from "../services/tg.connect.js";

const ADMIN_ID = 7098943602;

export default async function ad(ctx, env) {

  const chat_id = ctx.chat.id;
  const user_id = ctx.from.id;

  if (user_id !== ADMIN_ID) {
    return await tg(env, "sendMessage", {
      chat_id,
      text: "❌ Bu buyruq faqat admin uchun!"
    });
  }

  const text = ctx.text || "";

  // Parametrlarni olish
  const match = text.match(/name=(.+?)&username=(.+)/);
  
  if (!match) {
    return await tg(env, "sendMessage", {
      chat_id,
      text: "❌ Noto'g'ri format!\n\nTo'g'ri ishlatish:\n`/ad name=VelWix&username=@VelWix_Ch`",
      parse_mode: "Markdown"
    });
  }

  const name = match[1].trim();
  const username = match[2].trim();

  try {
    await env.DB.prepare(`
      INSERT INTO channels (name, username)
      VALUES (?, ?)
      ON CONFLICT(username) DO UPDATE SET name = excluded.name
    `).bind(name, username).run();

    return await tg(env, "sendMessage", {
      chat_id,
      text: `✅ Kanal muvaffaqiyatli qo'shildi!\n\n` +
            `📛 Nomi: ${name}\n` +
            `🔗 Username: ${username}`
    });

  } catch (error) {
    console.error(error);
    return await tg(env, "sendMessage", {
      chat_id,
      text: "❌ Ma'lumotlar bazasiga qo'shishda xatolik yuz berdi."
    });
  }
}