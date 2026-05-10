export default async function tg(env, method, payload = {}) {
  const token = env.BOT_TOKEN;

  const url = `https://api.telegram.org/bot${token}/${method}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return await res.json();
}