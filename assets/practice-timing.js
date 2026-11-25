// Unlimited practice is the default. Countdown is an explicit choice per session.
(() => {
  const format = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  function createClock({limitSeconds=0,elapsedSeconds=0,remainingSeconds,isActive=()=>true,onTick=()=>{},onExpire=()=>{}}={}) {
    let limit=Number(limitSeconds)>0?Number(limitSeconds):0;
    let elapsed=Math.max(0,Math.floor(Number(elapsedSeconds)||0));
    let remaining=limit ? (Number.isFinite(remainingSeconds) ? Math.max(0,Math.min(limit,remainingSeconds)) : limit) : null;
    let interval=null, stopped=false;
    function snapshot(){
      return {elapsed,remaining,limited:limit>0,warning:limit>0&&remaining<=180,
        label:limit>0?`⏱️ 剩余 ${format(remaining)}`:`不限时 · 已用 ${format(elapsed)}`};
    }
    function publish(){onTick(snapshot());}
    function stop(){stopped=true;if(interval!==null)clearInterval(interval);interval=null;}
    publish();
    interval=setInterval(()=>{
      if(stopped||!isActive())return;
      elapsed++;
      if(limit>0)remaining=Math.max(0,remaining-1);
      publish();
      if(limit>0&&remaining===0){stop();onExpire();}
    },1000);
    return {
      stop,
      setLimit(value){
        const next=Number(value)>0?Number(value):0;
        if(next!==limit){limit=next;remaining=limit||null;}
        publish();
      },
      snapshot,
    };
  }
  window.PracticeTiming={createClock,format};
})();
