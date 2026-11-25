// Shared server defaults. The API key lives only in .env / Netlify environment variables.
export const SPEECH_DEFAULTS = Object.freeze({
  endpoint: 'https://api.minimax.cn/v1/t2a_v2',
  model: 'speech-2.8-turbo',
  voiceId: 'Chinese (Mandarin)_Wise_Women',
  speed: 0.95,
  englishVoiceId: 'English_Graceful_Lady',
  englishSpeed: 0.9,
  sampleRate: 32000,
  stream: true,
  maxTextLength: 800,
});
