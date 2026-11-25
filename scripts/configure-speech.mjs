import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseEnv} from 'node:util';
import {SPEECH_DEFAULTS} from '../config/speech.mjs';

const root=new URL('../',import.meta.url);
let local={};
try{local=parseEnv(await readFile(new URL('.env',root),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
const key=local.MINIMAX_API_KEY||process.env.MINIMAX_API_KEY;
if(!key){
  console.log('No local MiniMax key; keeping the existing Netlify environment configuration.');
}else{
  const voice=local.MINIMAX_VOICE_ID||process.env.MINIMAX_VOICE_ID||SPEECH_DEFAULTS.voiceId;
  const englishVoice=local.MINIMAX_ENGLISH_VOICE_ID||process.env.MINIMAX_ENGLISH_VOICE_ID||SPEECH_DEFAULTS.englishVoiceId;
  if(/[\r\n]/.test(key+voice+englishVoice))throw new Error('Invalid multiline speech configuration.');
  const temp=await mkdtemp(join(tmpdir(),'panda-speech-env-'));
  try{
    const file=join(temp,'.env');
    await writeFile(file,`MINIMAX_API_KEY=${JSON.stringify(key)}\nMINIMAX_VOICE_ID=${JSON.stringify(voice)}\nMINIMAX_ENGLISH_VOICE_ID=${JSON.stringify(englishVoice)}\n`,{mode:0o600});
    const executable=new URL('../node_modules/.bin/netlify',import.meta.url);
    const result=spawnSync(fileURLToPath(executable),['env:import',file,'--json'],{
      cwd:fileURLToPath(root),encoding:'utf8',timeout:60000,
    });
    // CLI output may contain values: never forward its raw stdout or stderr.
    if(result.status!==0)throw new Error('Could not save speech configuration to Netlify. Check the Netlify login and retry.');
    console.log('Saved MiniMax key and Chinese/English voices to Netlify. Secret values were not printed.');
  }finally{await rm(temp,{recursive:true,force:true});}
}
