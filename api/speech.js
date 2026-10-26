// Vercel Function: secure proxy for Microsoft Azure Speech (Arabic TTS).
// Configure AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in Vercel Project Settings.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    return res.status(503).json({
      error: "Speech service is not configured yet.",
      code: "SPEECH_NOT_CONFIGURED"
    });
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 300) {
    return res.status(400).json({ error: "Text must contain 1–300 characters." });
  }

  const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  const ssml = `<speak version="1.0" xml:lang="ar-TN"><voice name="ar-TN-ReemNeural">${safeText}</voice></speak>`;

  try {
    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "WaelGameLab"
      },
      body: ssml
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Azure Speech request failed:", response.status, detail.slice(0, 300));
      return res.status(502).json({ error: "The online speech service could not generate audio." });
    }
    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", String(audio.length));
    return res.status(200).send(audio);
  } catch (error) {
    console.error("Azure Speech connection failed:", error);
    return res.status(502).json({ error: "Unable to reach the online speech service." });
  }
}
