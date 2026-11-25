import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const exists=existsSync(new URL('netlify/functions/speech.mjs',root));
const api=exists?await import(new URL('netlify/functions/speech.mjs',root)):{};
const request=(body={text:'小朋友你好'},origin='https://math-wonderland.netlify.app')=>new Request('https://math-wonderland.netlify.app/.netlify/functions/speech',{
  method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)
});

test('server adds its secret and fixed voice while streaming audio without buffering',async()=>{
  assert.equal(typeof api.createSpeechHandler,'function');
  let resolveNext,options;
  const handler=api.createSpeechHandler({env:{MINIMAX_API_KEY:'server-only-test-secret'},fetchImpl:async(url,init)=>{
    assert.equal(url,'https://api.minimax.cn/v1/t2a_v2');options=init;
    return new Response(new ReadableStream({start(controller){
      controller.enqueue(new TextEncoder().encode('data: first\n\n'));
      resolveNext=()=>{controller.enqueue(new TextEncoder().encode('data: last\n\n'));controller.close();};
    }}),{headers:{'content-type':'text/event-stream'}});
  }});
  const response=await handler(request({text:'你好',voice_setting:{voice_id:'untrusted-voice'},apiKey:'untrusted-key'}));
  assert.equal(response.status,200);assert.equal(options.headers.Authorization,'Bearer server-only-test-secret');
  const body=JSON.parse(options.body);assert.equal(body.voice_setting.voice_id,'Chinese (Mandarin)_Wise_Women');assert.equal(body.voice_setting.speed,0.95);assert.equal(body.stream,true);
  assert.equal(body.audio_setting.format,'pcm');assert.equal(body.audio_setting.sample_rate,32000);
  const reader=response.body.getReader();assert.match(new TextDecoder().decode((await reader.read()).value),/first/);
  resolveNext();assert.match(new TextDecoder().decode((await reader.read()).value),/last/);
  assert.ok(!JSON.stringify([...response.headers]).includes('server-only-test-secret'));
});

test('invalid text and cross-site requests do not call the paid upstream',async()=>{
  assert.equal(typeof api.createSpeechHandler,'function');let calls=0;
  const handler=api.createSpeechHandler({env:{MINIMAX_API_KEY:'secret'},fetchImpl:async()=>{calls++;throw Error('should not call');}});
  for(const text of ['', ' '.repeat(4), '字'.repeat(801)])assert.equal((await handler(request({text}))).status,400);
  for(const language of ['French', 'en-US', {}, 1])assert.equal((await handler(request({text:'Hello',language}))).status,400);
  assert.equal((await handler(request({text:'你好'},'https://unrelated.example'))).status,403);
  assert.equal(calls,0);
});

test('English requests use an English character, English pronunciation and a slower reading speed',async()=>{
  let sent;
  const handler=api.createSpeechHandler({env:{MINIMAX_API_KEY:'test-secret'},fetchImpl:async(url,init)=>{
    sent=JSON.parse(init.body);
    return new Response('data: done\n\n',{headers:{'content-type':'text/event-stream'}});
  }});
  const response=await handler(request({text:'The cat is small.',language:'en',voice_setting:{voice_id:'Chinese (Mandarin)_Cute_Spirit'}}));
  assert.equal(response.status,200);
  assert.equal(sent.voice_setting.voice_id,'English_Graceful_Lady');
  assert.equal(sent.voice_setting.speed,0.9);
  assert.equal(sent.language_boost,'English');
  await response.body.cancel();
});

test('English and Chinese server voice overrides are independent',async()=>{
  const sent=[];
  const handler=api.createSpeechHandler({env:{MINIMAX_API_KEY:'test-secret',MINIMAX_VOICE_ID:'chinese-server-voice',MINIMAX_ENGLISH_VOICE_ID:'english-server-voice'},fetchImpl:async(url,init)=>{
    sent.push(JSON.parse(init.body));
    return new Response('data: done\n\n',{headers:{'content-type':'text/event-stream'}});
  }});
  for(const data of [{text:'Apple',language:'en'},{text:'你好',language:'zh'},{text:'中文默认'}]){
    const response=await handler(request(data));await response.body.cancel();
  }
  assert.deepEqual(sent.map(body=>body.voice_setting.voice_id),['english-server-voice','chinese-server-voice','chinese-server-voice']);
  assert.deepEqual(sent.map(body=>body.voice_setting.speed),[0.9,0.95,0.95]);
});

test('game reading uses the shared Chinese site service and its sound switch still mutes reading',async()=>{
  let sent,calls=0;
  class AudioContext {
    constructor(){this.currentTime=0;this.destination={};}
    async resume(){} async close(){}
    createBuffer(){return {duration:0.001,copyToChannel(){}};}
    createBufferSource(){return {connect(){},disconnect(){},stop(){},start(){this.onended?.();}};}
  }
  const context=vm.createContext({window:{AudioContext},sfx:{enabled:true},AbortController,TextDecoder,TextEncoder,Blob,performance,
    fetch:async(url,options)=>{calls++;sent={url,body:JSON.parse(options.body)};return new Response('data: {"data":{"audio":"00000100","status":2},"base_resp":{"status_code":0}}\n\n',{headers:{'content-type':'text/event-stream'}});}});
  vm.runInContext(readFileSync(new URL('assets/speech-client.js',root),'utf8'),context);
  const html=readFileSync(new URL('games/cyberhop.html',root),'utf8');
  const begin=html.indexOf('    const gameSpeech ='),end=html.indexOf('\n    /**************************************************************',begin);
  assert.ok(begin>0,'game creates the shared speech client');
  vm.runInContext(html.slice(begin,end),context);
  await vm.runInContext("speakGameText('18 − 7 = ?')",context);
  assert.equal(sent.url,'/.netlify/functions/speech');assert.equal(sent.body.language,undefined, 'Chinese uses the default server voice route');
  assert.equal(sent.body.text.replace(/\s/g,''),'18减7等于几');
  vm.runInContext('sfx.enabled=false',context);await vm.runInContext("speakGameText('2 + 3 = ?')",context);
  assert.equal(calls,1);
});

test('Chinese native fallback prefers an available adult female voice at natural pitch',()=>{
  const male={name:'Li-mu',lang:'zh-CN'},female={name:'Tingting',lang:'zh-CN'};let utterance;
  const client=speechClient({window:{speechSynthesis:{cancel(){},getVoices:()=>[male,female],speak:value=>utterance=value}},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}});
  client.run("siteSpeech.nativeSpeak('小朋友，请读题。','zh-CN')");
  assert.equal(utterance.voice,female);assert.equal(utterance.pitch,1);assert.equal(utterance.rate,0.95);
});

function speechClient(extra={}){
  const html=readFileSync(new URL('index.html',root),'utf8');
  const begin=html.indexOf('    const siteSpeech ='),end=html.indexOf('    // 3. HELPERS',begin);
  const context=vm.createContext({window:{},console,AbortController,TextDecoder,TextEncoder,Blob,performance,...extra});
  vm.runInContext('var soundEnabled=true;',context);
  vm.runInContext(readFileSync(new URL('assets/speech-client.js',root),'utf8'),context);
  vm.runInContext(html.slice(begin,end),context);
  return {context,run:code=>vm.runInContext(code,context)};
}

test('English reading carries the language through the real client player to the site endpoint',async()=>{
  let sent;
  class AudioContext {
    constructor(){this.currentTime=0;this.destination={};}
    async resume(){} async close(){}
    createBuffer(){return {duration:0.001,copyToChannel(){}};}
    createBufferSource(){return {connect(){},disconnect(){},stop(){},start(){this.onended?.();}};}
  }
  const client=speechClient({window:{AudioContext},fetch:async(url,options)=>{
    sent={url,body:JSON.parse(options.body)};
    return new Response('data: {"data":{"audio":"00000100","status":2},"base_resp":{"status_code":0}}\n\n',{headers:{'content-type':'text/event-stream'}});
  }});
  await client.run("speakEnglishText('Apple. I like apples.')");
  assert.equal(sent.url,'/.netlify/functions/speech');
  assert.deepEqual(sent.body,{text:'Apple. I like apples.',language:'en'});
});

test('browser fallback picks an available English voice even without a preferred brand name',()=>{
  const chinese={name:'Chinese Voice',lang:'zh-CN'},english={name:'Alex',lang:'en-US'};let utterance;
  const client=speechClient({window:{speechSynthesis:{cancel(){},getVoices:()=>[chinese,english],speak:value=>utterance=value}},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}});
  client.run("siteSpeech.nativeSpeak('Apple','en-US')");
  assert.equal(utterance.voice,english);assert.equal(utterance.lang,'en-US');
});

test('English lesson steps read English words and examples while Chinese lesson steps keep Chinese explanations',()=>{
  const client=speechClient();
  assert.equal(client.run('typeof getAnimationStepSpeech'),'function');
  const word=client.run("getAnimationStepSpeech({type:'en_word_card',word:'cat 🐱',example:'The cat is small.',steps:[{title:'认识单词',desc:'跟着读'},{title:'例句',desc:'这只猫很小'}]},0)");
  assert.equal(word.lang,'en-US');assert.equal(word.text,'cat');
  const example=client.run("getAnimationStepSpeech({type:'en_word_card',word:'cat',example:'The cat is small.',steps:[{},{}]},1)");
  assert.equal(example.text,'The cat is small.');
  const phonics=client.run("getAnimationStepSpeech({type:'en_phonics_train',partA:'b',partB:'at',resultWord:'bat 🦇',steps:[{},{}]},1)");
  assert.equal(phonics.lang,'en-US');assert.equal(phonics.text,'bat');
  const chinese=client.run("getAnimationStepSpeech({type:'mixed_ops',steps:[{title:'先算括号',desc:'括号里面得六'}]},0)");
  assert.equal(chinese.lang,'zh-CN');assert.equal(chinese.text,'先算括号。括号里面得六');
});

test('upstream authentication errors and missing configuration stay private',async()=>{
  assert.equal(typeof api.createSpeechHandler,'function');
  const unavailable=api.createSpeechHandler({env:{}});
  assert.equal((await unavailable(request())).status,503);
  const handler=api.createSpeechHandler({env:{MINIMAX_API_KEY:'private-test-value'},fetchImpl:async()=>new Response('private-test-value',{status:401})});
  const response=await handler(request());assert.equal(response.status,502);
  assert.ok(!(await response.text()).includes('private-test-value'));
});

test('fresh browsers use the site endpoint with no API key or settings dialog',async()=>{
  const html=readFileSync(new URL('index.html',root),'utf8');
  assert.ok(!html.includes('id="openTtsSettingsBtn"'));
  assert.ok(!html.includes('id="ttsSettingsDialog"'));
  const begin=html.indexOf('    const siteSpeech =');
  const end=html.indexOf('    // 3. HELPERS',begin);
  let sent;
  const context=vm.createContext({window:{},console,AbortController,TextDecoder,TextEncoder,Blob,
    fetch:async(url,options)=>{sent={url,options};return new Response('data: {"data":{"audio":"00000100","status":2},"base_resp":{"status_code":0}}\n\n',{headers:{'content-type':'text/event-stream'}});},performance});
  vm.runInContext('var soundEnabled=true;',context);
  vm.runInContext(readFileSync(new URL('assets/speech-client.js',root),'utf8'),context);
  vm.runInContext(html.slice(begin,end),context);
  const result=await vm.runInContext("siteSpeech.measure({text:'你好'})",context);
  assert.equal(sent.url,'/.netlify/functions/speech');assert.equal(sent.options.headers.Authorization,undefined);
  assert.deepEqual(JSON.parse(sent.options.body),{text:'你好'});assert.equal(result.state,'completed');assert.equal(result.audioBytes,4);
});
