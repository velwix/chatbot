import AI from "../CallbackQuery/AI.js";
import AI_YES from "../CallbackQuery/AI_YES.js";
import AI_NO from "../CallbackQuery/AI_NO.js";
import checkSub from "../CallbackQuery/checkSub.js";

export default async function callbackRouter(ctx, env) {

  const data = ctx.data;

  if (data === "ai") {
    return AI(ctx, env);
  }

  if (data === "ai_yes") {
    return AI_YES(ctx, env);
  }

  if (data === "ai_no") {
    return AI_NO(ctx, env);
  }

  if (data === "check_sub") {
    return checkSub(ctx, env);
  }

}