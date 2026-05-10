import tg from "../services/tg.connect.js";

const ADMIN_ID = 7098943602;

export default async function ad(ctx, env) {

  const chat_id = ctx.chat.id;
  const user_id = ctx.from.id;
  const text = ctx.text || "";

  // Admin tekshirish
  if (user_id !== ADMIN_ID) {
    return await tg(env, "sendMessage", {
      chat_id,
      text: "❌ Bu buyruq faqat admin uchun!"
    });
  }

  // Format: name=Test Kanal&username=@testchannel
  if (!text.includes("name=") || !text.includes("username=")) {
    return await tg(env, "sendMessage", {
      chat_id,
      text: "❌ Noto'g'ri format!\n\nTo'g'ri format:\n`name=Kanal Nomi&username=@username`",
      parse_mode: "Markdown"
    });
  }

  try {
    const params = new URLSearchParams(text.split(' ').slice(1).join(' '));
    const name = params.get("name");
    const username = params.get("username");

    if (!name || !username) {
      throw new Error("Parametrlar to'liq emas");
    }

    // DB ga qo'shish
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
    return await tg(env, "sendMessage", {
      chat_id,
      text: "❌ Xatolik yuz berdi!\n\nTo'g'ri formatdan foydalaning:\n`name=Kanal Nomi&username=@username`"
    });
  }
}