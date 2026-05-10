import tg from "../services/tg.connect.js";
import checkSub from "../CallbackQuery/CheckSub.js";
import AI from "../CallbackQuery/AI.js";
import AI_YES from "../CallbackQuery/AI_YES.js";
import AI_NO from "../CallbackQuery/AI_NO.js";

export default async function callbackRouter(ctx, env) {

  const data = ctx.data;

  // Debug uchun
  console.log("Callback keldi:", data);

  if (data === "check_sub") {
    return checkSub(ctx, env);
  }

  if (data === "ai") {
    return AI(ctx, env);
  }

  if (data === "ai_yes") {
    return AI_YES(ctx, env);
  }

  if (data === "ai_no") {
    return AI_NO(ctx, env);
  }

  
  return await tg(env, "answerCallbackQuery", {
    callback_query_id: ctx.id,
    text: "✅ Ishlayapti"
  });
}