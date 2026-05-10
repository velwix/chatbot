export default async function checkSubscription(env, user_id, channels = []) {
  const apiKey = env.API_KEY;

  const url = `https://subscription-check.velwix.workers.dev/${apiKey}/check/channel`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id,
      channels
    })
  });

  const data = await res.json();

  if (data?.status !== "success") {
    return {
      ok: false,
      results: {}
    };
  }

  return {
    ok: true,
    results: data.results || {}
  };
}