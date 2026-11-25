import {SPEECH_DEFAULTS as defaults} from '../config/speech.mjs';

const privateHeaders = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const errorResponse = (message,status) => Response.json({error:message},{status,headers:privateHeaders});

export function createSpeechHandler({env={},fetchImpl=globalThis.fetch}={}) {
  return async function speech(request) {
    if(request.method!=='POST')return new Response(null,{status:405,headers:{...privateHeaders,Allow:'POST'}});
    const origin=request.headers.get('origin');
    if((origin && origin!==new URL(request.url).origin) || request.headers.get('sec-fetch-site')==='cross-site') {
      return errorResponse('请从乐园页面使用读题功能。',403);
    }
    if(!request.headers.get('content-type')?.includes('application/json'))return errorResponse('请求格式不正确。',415);
    let data;
    try {
      const body=await request.text();
      if(body.length>12000)return errorResponse('读题内容过长。',400);
      data=JSON.parse(body);
    }catch{return errorResponse('请求格式不正确。',400);}
    const text=typeof data?.text==='string'?data.text.trim():'';
    if(!text || Array.from(text).length>defaults.maxTextLength)return errorResponse('请提供 1 至 800 字的读题内容。',400);
    if(data.language!==undefined && data.language!=='zh' && data.language!=='en')return errorResponse('请选择中文或英文朗读。',400);
    const english=data.language==='en';
    const voiceId=english ? env.MINIMAX_ENGLISH_VOICE_ID?.trim()||defaults.englishVoiceId : env.MINIMAX_VOICE_ID?.trim()||defaults.voiceId;
    const key=env.MINIMAX_API_KEY?.trim();
    if(!key)return errorResponse('语音服务暂时不可用。',503);
    try {
      const upstream=await fetchImpl(defaults.endpoint,{
        method:'POST',
        headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
        redirect:'manual',
        signal:AbortSignal.any([request.signal,AbortSignal.timeout(55000)]),
        body:JSON.stringify({
          model:defaults.model,text,stream:defaults.stream,
          stream_options:{exclude_aggregated_audio:true},
          voice_setting:{voice_id:voiceId,speed:english?defaults.englishSpeed:defaults.speed,vol:1,pitch:0},
          ...(english?{language_boost:'English'}:{}),
          audio_setting:{sample_rate:defaults.sampleRate,format:'pcm',channel:1},
        }),
      });
      if(!upstream.ok || !upstream.body){
        await upstream.body?.cancel();
        return errorResponse('语音服务暂时不可用，请稍后重试。',502);
      }
      const type=upstream.headers.get('content-type')||'text/event-stream';
      if(type.includes('application/json')){
        const packet=await upstream.json();
        if(Number(packet.base_resp?.status_code||0)!==0)return errorResponse('语音服务暂时不可用，请稍后重试。',502);
        return Response.json(packet,{headers:privateHeaders});
      }
      // Forward chunks as they arrive so the existing PCM player can start promptly.
      return new Response(upstream.body,{headers:{...privateHeaders,'Content-Type':'text/event-stream; charset=utf-8'}});
    }catch{
      return errorResponse('语音服务暂时不可用，请稍后重试。',request.signal.aborted?499:502);
    }
  };
}
