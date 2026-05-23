const TG_TOKEN = process.env.TG_TOKEN
const TG_CHATID = process.env.TG_CHATID

export async function sendTelegram(msg: string) {
  if (!TG_TOKEN || !TG_CHATID) return
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHATID, text: msg, parse_mode: 'HTML' }),
    })
  } catch {}
}
