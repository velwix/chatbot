import { tgConnect } from '../services/tg.connect.js';
import { handleStart } from '../commands/start.js';

export async function handleStartCallback(update, env) {
  const tg = tgConnect(env.BOT_TOKEN);
  const chat_id = update.callback_query.message.chat.id;
  const user_username = update.callback_query.from.username;
  const callback_query_id = update.callback_query.id;

  const res = await handleStart(chat_id, env, user_username);

  if (res?.result?.text?.includes("Obuna bo'ling")) {
    return await tg.request('answerCallbackQuery', {
      callback_query_id: callback_query_id,
      text: "Obuna bo'lmagansiz! Qaytadan tekshiring.",
      show_alert: true
    });
  }

  await tg.request('deleteMessage', {
    chat_id: chat_id,
    message_id: update.callback_query.message.message_id
  });

  return await tg.request('answerCallbackQuery', {
    callback_query_id: callback_query_id,
    text: "Muvaffaqiyatli tekshirildi!"
  });
}
