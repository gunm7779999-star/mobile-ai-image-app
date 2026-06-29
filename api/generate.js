const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const ALLOWED_SIZES = new Set(['1024x1024', '1024x1536', '1536x1024']);
const ALLOWED_COUNTS = new Set([1, 2, 4]);
const STYLE_HINTS = {
  '写真': 'Photorealistic, natural light, detailed photography.',
  'イラスト': 'Polished editorial illustration, expressive colors and clean composition.',
  'アニメ': 'High-quality Japanese anime-style illustration, dynamic composition.',
  '3Dレンダー': 'High-end 3D render, cinematic lighting, detailed materials.',
};

module.exports = async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'POSTメソッドを使用してください。' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: 'サーバーにOPENAI_API_KEYが設定されていません。' });
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {};
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const style = typeof body.style === 'string' ? body.style : '写真';
  const size = ALLOWED_SIZES.has(body.size) ? body.size : '1024x1024';
  const count = ALLOWED_COUNTS.has(Number(body.count)) ? Number(body.count) : 1;

  if (!prompt || prompt.length > 2000) {
    return response.status(400).json({ error: '画像の説明を1〜2000文字で入力してください。' });
  }

  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1-mini';
  const styledPrompt = `${STYLE_HINTS[style] || STYLE_HINTS['写真']}\n\nUser request: ${prompt}`;

  try {
    const openAIResponse = await fetch(OPENAI_IMAGES_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: styledPrompt,
        n: count,
        size,
        quality: 'low',
        output_format: 'jpeg',
        output_compression: 80,
      }),
    });

    const data = await openAIResponse.json().catch(() => ({}));
    if (!openAIResponse.ok) {
      console.error('OpenAI Images API error', openAIResponse.status, data?.error?.type || 'unknown');
      const message = openAIResponse.status === 429
        ? 'APIの利用上限に達しました。しばらく待ってからお試しください。'
        : 'OpenAI Images APIで画像を生成できませんでした。';
      return response.status(openAIResponse.status === 429 ? 429 : 502).json({ error: message });
    }

    const images = Array.isArray(data.data)
      ? data.data.filter((item) => item.b64_json).map((item) => ({ url: `data:image/jpeg;base64,${item.b64_json}` }))
      : [];
    if (images.length === 0) return response.status(502).json({ error: 'OpenAIから画像データが返されませんでした。' });

    return response.status(200).json({ images, model, usage: data.usage || null });
  } catch (error) {
    console.error('Image generation request failed', error instanceof Error ? error.message : 'unknown');
    return response.status(502).json({ error: '画像生成サービスへ接続できませんでした。' });
  }
};
