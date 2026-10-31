import { OPENROUTER_API_KEY, MODEL } from './config';

const SYSTEM_PROMPT = `أنت راوي كبير في السن يحكي حكاية عند النار في البر.
اكتب بالعربية بلهجة كويتية خفيفة مفهومة.
الطول من 4 إلى 5 فقرات قصيرة.
أجواء الكشتة: النار، القهوة والدلة، الخيمة، الرمل، النجوم، الليل البارد.
أضف تفاصيل بسيطة من الحياة الكويتية، وانهِ بعبرة أو لمسة طريفة.
لا تضف أي عنوان أو شرح أو مقدمة خارج القصة، فقط الحكاية نفسها.`;

const MIN_STORY_LENGTH = 40;
const TIMEOUT_MS = 60000;

export class StoryError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export async function tellStory(spark) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes('PUT_YOUR_KEY')) {
    throw new StoryError('ما لقيت مفتاح OpenRouter. حطه في ملف config.js.', 'no-key');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: spark },
        ],
      }),
    });
  } catch (e) {
    throw new StoryError(
      e.name === 'AbortError' ? 'الراوي تأخر علينا.' : 'ما قدرنا نوصل للراوي، شيك على النت.',
      e.name === 'AbortError' ? 'timeout' : 'network'
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new StoryError('الراوي مشغول شوي.', String(response.status));
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new StoryError('وصلنا رد غريب من الراوي.', 'bad-json');
  }

  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || text.trim().length < MIN_STORY_LENGTH) {
    throw new StoryError('الراوي سكت ولا قال شي.', 'empty');
  }
  return text.trim();
}
