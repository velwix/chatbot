export const mainMenu = {
  (env, user_id) {
  const settings = await env.DB.prepare(
    "SELECT auto_msg, keyword, ai, reply FROM user_settings WHERE user_id = ?"
  ).bind(user_id).first() || { auto_msg: 'off', keyword: 'off', ai: 'off', reply: 'off' };

  const auto_msg_isOn = settings.auto_msg === 'on';
  const keyword_isOn = settings.keyword === 'on';
  const ai_isOn = settings.ai === 'on';
  const reply_isOn = settings.reply === 'on';

  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Qo'llanma📒",
            url: "https://t.me/VelWix_Ch/7",
            style: "primary"
          }
        ],
        [
          {
            text: `Avto Xabar🛰 | ${auto_msg_isOn ? 'on' : 'off'}`,
            callback_data: "toggle_auto_msg",
            style: auto_msg_isOn ? "danger" : "primary"
          },
          {
            text: `Kalit So'z🔑 | ${keyword_isOn ? 'on' : 'off'}`,
            callback_data: "toggle_keyword",
            style: keyword_isOn ? "danger" : "primary"
          }
        ],
        [
          {
            text: `AI🌀 | ${ai_isOn ? 'on' : 'off'}`,
            callback_data: "toggle_ai",
            style: ai_isOn ? "danger" : "primary"
          },
          {
            text: `Reply📌 | ${reply_isOn ? 'on' : 'off'}`,
            callback_data: "toggle_reply",
            style: reply_isOn ? "danger" : "primary"
          }
        ]
      ]
    }
  };
}
