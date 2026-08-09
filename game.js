// Flappy Bird — canvas game loop (touch-first, retina-sharp)
const cv = document.getElementById("c"), ctx = cv.getContext("2d");
// render at device resolution, keep 288x512 logical coordinates
const DPR = Math.min(window.devicePixelRatio || 1, 3);
cv.width = 288 * DPR; cv.height = 512 * DPR; ctx.scale(DPR, DPR);
cv.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
let bird, pipes, score, dead, started;
function reset(){ bird={x:60,y:240,vy:0,r:12}; pipes=[]; score=0; dead=false; started=false; }
reset();
const GRAV=0.35, FLAP=-6, GAP=130, SPEED=2;
function addPipe(){ const top=40+Math.random()*(512-GAP-120); pipes.push({x:288,top,scored:false}); }
function flap(){ if(dead){reset();return;} started=true; bird.vy=FLAP; }
addEventListener("keydown",e=>{if(e.code==="Space")flap();});
cv.addEventListener("pointerdown",flap);
let frame=0;
function step(){
  if(started&&!dead){
    bird.vy+=GRAV; bird.y+=bird.vy;
    if(frame%90===0) addPipe();
    for(const p of pipes){ p.x-=SPEED;
      if(!p.scored&&p.x+52<bird.x){p.scored=true;score++;}
      if(bird.x+bird.r>p.x&&bird.x-bird.r<p.x+52&&(bird.y-bird.r<p.top||bird.y+bird.r>p.top+GAP)) dead=true;
    }
    pipes=pipes.filter(p=>p.x>-60);
    if(bird.y+bird.r>512||bird.y-bird.r<0) dead=true;
  }
  frame++;
  draw();
  requestAnimationFrame(step);
}
function draw(){
  ctx.fillStyle="#70c5ce"; ctx.fillRect(0,0,288,512);
  ctx.fillStyle="#5ab54f";
  for(const p of pipes){ ctx.fillRect(p.x,0,52,p.top); ctx.fillRect(p.x,p.top+GAP,52,512); }
  ctx.fillStyle="#f5d742"; ctx.beginPath(); ctx.arc(bird.x,bird.y,bird.r,0,7); ctx.fill();
  ctx.fillStyle="#fff"; ctx.font="24px sans-serif"; ctx.fillText(String(score),140,50);
  if(!started){ctx.fillText("tap / space",95,260);}
  if(dead){ctx.fillText("game over",100,260);}
}
step();
window.__flappy={reset,flap,get score(){return score;},get dead(){return dead;}};
