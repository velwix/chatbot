import { tgConnect } from '../services/tg.connect.js';
import { mainMenu } from '../buttons/inline/menu.js';

export async function handleStart(chat_id, env, user_username) {
  const tg = tgConnect(env.BOT_TOKEN);
  const channel = await env.DB.prepare("SELECT username FROM channels LIMIT 1").first();
  
  const checkResponse = await fetch(`https://subscription-check.velwix.workers.dev/${env.API_KEY}/check/channel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: chat_id,
      channels: [channel.username]
    })
  });

  const checkData = await checkResponse.json();
  const isSubscribed = checkData.results[channel.username];

  if (!isSubscribed) {
    return await tg.sendMessage(chat_id, "Botni to'liq ishlatish uchun Kanalimizga Obuna bo'ling!📢", {
      reply_markup: {
        inline_keyboard: [
          [{ text: channel.username, url: `https://t.me/${channel.username.replace('@', '')}` }],
          [{ text: "Obunamni Tekshirish✅", callback_data: "check_sub" }]
        ]
      }
    });
  }

  const welcomeText = `Salom @${user_username}👋!\nMen Sizning Yordamchi botingizman,\nMen Sizga Xabarlarni avtomatlashtirishga yordam beraman🌐\nBoshlash uchun shunchaki Pastdagi tugmalardan foydalaning!👇🏿\nOmad!🌠`;

  return await tg.sendMessage(chat_id, welcomeText, mainMenu);
}
