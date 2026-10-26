// Vercel serverless proxy for Arabic TTS. Keep MUNSIT_API_KEY in Vercel Environment Variables.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // Limit browser requests to the deployed site's own origin when Origin is present.
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ error: "origin_not_allowed" });
      }
    } catch {
      return res.status(403).json({ error: "origin_not_allowed" });
    }
  }

  const apiKey = process.env.MUNSIT_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "tts_not_configured" });
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 300) {
    return res.status(400).json({ error: "text_must_be_1_to_300_characters" });
  }

  try {
    const upstream = await fetch("https://api.munsit.com/api/v1/text-to-speech/faseeh-v1-preview", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/wav"
      },
      body: JSON.stringify({
        voice_id: "ar-najdi-male-2",
        text,
        stability: 0.5,
        speed: 0.9,
        streaming: false
      })
    });

    if (!upstream.ok) {
      // Do not leak provider responses, credentials, or request details to visitors.
      console.error("Munsit TTS request failed with status", upstream.status);
      return res.status(502).json({ error: "tts_provider_failed" });
    }

    const audio = Buffer.from(await upstream.arrayBuffer());
    if (!audio.length) {
      return res.status(502).json({ error: "empty_audio" });
    }
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/wav");
    res.setHeader("Content-Length", String(audio.length));
    return res.status(200).send(audio);
  } catch (error) {
    console.error("Arabic TTS upstream request failed");
    return res.status(502).json({ error: "tts_provider_unreachable" });
  }
}
