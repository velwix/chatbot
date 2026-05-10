import { telegram } from "../services/tg.connect.js";
import start from "../Commands/start.js";
import checkSub from "../CallbackQuery/CheckSub.js";
import guide from "../CallbackQuery/guide.js";
import autoMessage from "../CallbackQuery/AutoMessage.js";
import addAutoMessage from "../CallbackQuery/AddAutoMessage.js";
import editAutoMessage from "../CallbackQuery/EditAutoMessage.js"; 
import AI from "../CallbackQuery/AI.js";
import AI_YES from "../CallbackQuery/AI_YES.js";
import AI_NO from "../CallbackQuery/AI_NO.js";

export default async function callbackRouter(ctx, env) {
  const data = ctx.data;
  const bot = telegram(env);
  const chat_id = ctx.message.chat.id;
  const message_id = ctx.message.message_id;

  switch (data) {
    case "check_sub":
      const result = await checkSub(ctx, env);
      if (result && result.status === "success") {
        await start(ctx, env);
      }
      break;

    case "guide":
      await guide(ctx, env);
      break;

    case "auto_msg":
      await autoMessage(ctx, env);
      break;

    case "add_auto_msg":
      await addAutoMessage(ctx, env);
      break;

    case "edit_auto_msg":
      await editAutoMessage(ctx, env);
      break;

    case "back_to_menu":
      await bot.answerCallbackQuery(ctx.id);
      await bot.deleteMessage(chat_id, message_id);
      await start(ctx, env);
      break;

    case "ai":
      await AI(ctx, env);
      break;

    case "ai_yes":
      await AI_YES(ctx, env);
      break;

    case "ai_no":
      await AI_NO(ctx, env);
      break;

    default:
      await bot.answerCallbackQuery(ctx.id, {
        text: "Noma'lum buyruq",
        show_alert: false
      });
  }
}
