import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {existsSync,readFileSync} from 'node:fs';

function setup(){
  const url=new URL('../assets/practice-timing.js',import.meta.url);
  const timers=new Map();let seq=0;const window={};
  const context=vm.createContext({
    window,setInterval:fn=>{timers.set(++seq,fn);return seq;},clearInterval:id=>timers.delete(id),
  });
  if(existsSync(url))vm.runInContext(readFileSync(url,'utf8'),context);
  return {api:window.PracticeTiming,timers,run:code=>vm.runInContext(code,context),tick(n){for(let i=0;i<n;i++)for(const fn of [...timers.values()])fn();}};
}

test('unlimited is the default and never automatically submits after 20 minutes',()=>{
  const h=setup();assert.ok(h.api);let expired=0,last;
  const clock=h.api.createClock({onTick:s=>{last=s;},onExpire:()=>expired++});
  assert.equal(last.remaining,null);assert.match(last.label,/不限时/);
  h.tick(1800);assert.equal(last.elapsed,1800);assert.equal(expired,0);assert.equal(last.warning,false);
  clock.stop();
});

test('the optional 20 minute challenge expires once and stops its timer',()=>{
  const h=setup();assert.ok(h.api);let expired=0,last;
  h.api.createClock({limitSeconds:1200,onTick:s=>{last=s;},onExpire:()=>expired++});
  assert.equal(last.remaining,1200);h.tick(1199);assert.equal(expired,0);assert.equal(last.remaining,1);
  h.tick(10);assert.equal(expired,1);assert.equal(h.timers.size,0);assert.equal(last.remaining,0);
});

test('switching to unlimited preserves elapsed time and cancels the deadline',()=>{
  const h=setup();assert.ok(h.api);let expired=0,last;
  const clock=h.api.createClock({limitSeconds:1200,onTick:s=>{last=s;},onExpire:()=>expired++});
  h.tick(1198);clock.setLimit(0);h.tick(40);
  assert.equal(last.elapsed,1238);assert.equal(last.remaining,null);assert.equal(last.warning,false);assert.equal(expired,0);
});

test('enabling a challenge starts a fresh countdown and pause/stop preserve answers time',()=>{
  const h=setup();assert.ok(h.api);let active=true,last;
  const clock=h.api.createClock({isActive:()=>active,onTick:s=>{last=s;}});
  h.tick(1500);clock.setLimit(1200);assert.equal(last.remaining,1200);assert.equal(last.elapsed,1500);
  h.tick(5);clock.setLimit(1200);assert.equal(last.remaining,1195);
  active=false;h.tick(100);assert.equal(last.elapsed,1505);assert.equal(last.remaining,1195);
  clock.stop();active=true;h.tick(100);assert.equal(last.elapsed,1505);assert.equal(h.timers.size,0);
});

test('a saved draft resumes its elapsed time and remaining challenge rather than resetting the deadline',()=>{
  const h=setup();let last,expired=0;
  h.api.createClock({limitSeconds:1200,elapsedSeconds:1550,remainingSeconds:2,onTick:s=>{last=s;},onExpire:()=>expired++});
  assert.equal(last.elapsed,1550);assert.equal(last.remaining,2);
  h.tick(2);assert.equal(last.elapsed,1552);assert.equal(last.remaining,0);assert.equal(expired,1);
  const unlimited=h.api.createClock({elapsedSeconds:83,onTick:s=>{last=s;}});
  h.tick(1);assert.equal(last.elapsed,84);assert.equal(last.remaining,null);unlimited.stop();
});

function app(){
  const h=setup();const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const block=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
  h.run(`
    var activePaperData=null, activePaperClock=null, mathPracticeTimeLimit=0, grades=0;
    var state={view:'home',quizClock:null};
    var document={querySelectorAll:()=>[],getElementById:()=>({classList:{toggle(){},add(){}},hidden:false})};
    function playSound(){} function updateComboBadgeUI(){} function syncPaperDomInputs(){}
    function saveActivePaperDraft(){}
    var paperRecordStore={draft:()=>null};
    function renderA4ExamPaper(){} function renderCurrentQuestion(){} function speakText(){}
    function switchView(view){state.view=view;}
    function buildRealPaperData(){return {timeLimitSeconds:mathPracticeTimeLimit,graded:false,secondsElapsed:0,answers:{q11:2}};}
    function generateQuizSet(){return [];}
    function gradeA4ExamPaper(){grades++;activePaperData.graded=true;activePaperClock.stop();}
    function finishAndGradeQuiz(){grades++;state.quizGraded=true;state.quizClock.stop();}
    var TOPIC_TITLES={};
  `);
  h.run(block('    function isMathPracticeTopic(',"    function buildRealPaperData("));
  h.run(block('    function startMathExam(', '    window.startMathExam ='));
  h.run(block('    function startQuiz(', '    function updateComboBadgeUI('));
  return h;
}

test('real paper and quiz launchers stay open beyond 20 minutes by default',()=>{
  const h=app();h.run('startMathExam()');h.tick(1250);
  assert.equal(h.run('grades'),0);assert.equal(h.run('activePaperData.secondsElapsed'),1250);
  h.run("startQuiz('muldiv')");h.tick(1250);
  assert.equal(h.run('grades'),0);assert.equal(h.run('state.elapsedSeconds'),1250);
});

test('changing the active paper mode keeps its answers; a chosen challenge still auto-grades',()=>{
  const h=app();h.run('setMathTimeLimit(1200);startMathExam()');h.tick(1190);
  h.run('setMathTimeLimit(0)');h.tick(30);
  assert.equal(h.run('grades'),0);assert.equal(h.run('activePaperData.answers.q11'),2);
  assert.equal(h.run('activePaperData.secondsElapsed'),1220);
  h.run('setMathTimeLimit(1200)');h.tick(1200);assert.equal(h.run('grades'),1);
});
