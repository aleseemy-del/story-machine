// انسخ هذا الملف إلى config.js وضع مفتاحك. config.js مستثنى من Git.
export const OPENROUTER_API_KEY = 'sk-or-v1-ضع-مفتاحك-هنا';
export const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
// نماذج احتياطية تُجرَّب بالترتيب إذا كان النموذج الأول مزدحماً (429) أو فيه خطأ من الخادم
export const FALLBACK_MODELS = [
  'nvidia/nemotron-3.5-super-vl:free',
  'google/gemma-4-31b-it:free',
];
