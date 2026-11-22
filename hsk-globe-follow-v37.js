/* HSK Panda V37: a shared, card-sized 3D globe that follows finger movement.
 * A 3x3 patch grid belongs to one ellipsoid, not nine independent flying panels.
 * Old and new card surfaces orbit in opposite hemispheres; the second card is
 * visible through the opening seams. One-tap answer reveal remains in app JS.
 */
(function () {
  'use strict';
  var session = null, raf = 0, timer = 0;
  function cap(n,lo,hi) { return Math.max(lo,Math.min(hi,n)); }
  function smooth(t) { t=cap(t,0,1); return t*t*(3-2*t); }
  function easeOut(t) { t=cap(t,0,1); return 1-Math.pow(1-t,3); }
  function active() { return !!session; }
  function reset() {
    if (raf) cancelAnimationFrame(raf);
    if (timer) clearTimeout(timer);
    raf=0;timer=0;
    var s=session;session=null;
    if(!s)return;
    if(s.viewport.isConnected)s.viewport.remove();
    if(s.card.isConnected){s.card.classList.remove('hsk-v37-card-hidden');s.card.style.minHeight='';}
    if(s.layout.isConnected)s.layout.classList.remove('hsk-v37-host');
    document.documentElement.classList.remove('hsk-v37-no-overflow');
  }
  function build(direction,preview) {
    if(session)return false;
    var card=document.querySelector('.flash-layout > .flash-central');
    var layout=card&&card.closest('.flash-layout');
    if(!card||!layout)return false;
    var width=card.offsetWidth,height=card.offsetHeight;
    if(!width||!height)return false;
    var oldHTML=card.innerHTML;
    var newHTML=typeof preview==='function'?preview(direction):String(preview||'');
    if(!newHTML)return false;
    card.classList.remove('flash-dragging');
    card.style.transform='';card.style.opacity='';
    card.style.removeProperty('--flash-left-opacity');
    card.style.removeProperty('--flash-right-opacity');
    card.style.minHeight=height+'px';
    card.classList.add('hsk-v37-card-hidden');
    layout.classList.add('hsk-v37-host');
    document.documentElement.classList.add('hsk-v37-no-overflow');
    var viewport=document.createElement('div');
    viewport.className='hsk-v37-viewport';
    viewport.setAttribute('aria-hidden','true');
    viewport.style.left=card.offsetLeft+'px';
    viewport.style.top=card.offsetTop+'px';
    viewport.style.width=width+'px';viewport.style.height=height+'px';
    var stage=document.createElement('div');stage.className='hsk-v37-stage';
    var globe=document.createElement('div');globe.className='hsk-v37-orb';
    stage.appendChild(globe);
    var back=document.createElement('div');back.className='hsk-v37-backdrop';
    var backing=document.createElement('div');backing.className='hsk-v37-texture';
    backing.style.width=width+'px';backing.style.height=height+'px';
    backing.innerHTML=newHTML;back.appendChild(backing);stage.appendChild(back);
    var cols=3,rows=3,w=width/cols,h=height/rows,patches=[];
    for(var side=0;side<2;side++)for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
      var x=c*w,y=r*h;
      var patch=document.createElement('div');patch.className='hsk-v37-patch';
      patch.style.left=x+'px';patch.style.top=y+'px';
      patch.style.width=(c===cols-1?width-x:w+0.5)+'px';
      patch.style.height=(r===rows-1?height-y:h+0.5)+'px';
      var face=document.createElement('div');face.className='hsk-v37-face';
      var text=document.createElement('div');text.className='hsk-v37-texture';
      text.style.left=-x+'px';text.style.top=-y+'px';
      text.style.width=width+'px';text.style.height=height+'px';
      text.innerHTML=side?newHTML:oldHTML;
      face.appendChild(text);patch.appendChild(face);stage.appendChild(patch);
      patches.push({node:patch,side:side,u:c-1,v:r-1,x:x+w/2-width/2,y:y+h/2-height/2});
    }
    viewport.appendChild(stage);layout.appendChild(viewport);
    session={card:card,layout:layout,viewport:viewport,stage:stage,back:back,
      patches:patches,globe:globe,width:width,height:height,progress:0,dragX:0,
      direction:direction,status:'drag'};
    draw(session,0,0);
    return true;
  }
  function draw(s,p,dragX) {
    if(!s||!s.viewport.isConnected)return;
    p=cap(p,0,1);dragX=Number(dragX)||0;
    s.progress=p;s.dragX=dragX;
    var sign=s.direction==='left'?-1:1;
    var globe=Math.pow(Math.max(0,Math.sin(Math.PI*p)),0.85);
    var radians=Math.PI*p;
    // Card-sized ellipsoid, bounded by the card viewport.
    var rx=s.width*.49,ry=s.height*.55,rz=Math.min(s.width*.27,s.height*.56);
    // Input is the dominant source of horizontal movement, but bounded so the
    // globe stays recognizable instead of flying outside the Flashcard area.
    var follow=cap(dragX*.37,-s.width*.16,s.width*.16)*(.36+.64*globe);
    s.stage.style.setProperty('--hsk-v37-follow',follow.toFixed(2)+'px');
    s.globe.style.opacity=(.60*globe).toFixed(3);
    s.globe.style.transform='translate(-50%,-50%) translateX('+(follow*.28).toFixed(2)+'px)';
    s.back.style.opacity=(.08+.90*smooth((p-.07)/.55)).toFixed(3);
    var backX=-sign*s.width*.27*(1-p)+follow*.26;
    s.back.style.transform='translate3d('+backX.toFixed(2)+'px,'+(13*(1-p)).toFixed(2)+
      'px,-80px) scale('+(0.975+.025*p).toFixed(4)+')';
    for(var i=0;i<s.patches.length;i++) {
      var a=s.patches[i];
      var sideAngle=sign*Math.PI*(p-(a.side?1:0));
      var longitude=sideAngle+a.u*.67*globe;
      var latitude=a.v*.57*globe;
      var projectedX=rx*Math.sin(longitude)*Math.cos(latitude);
      var projectedY=ry*Math.sin(latitude);
      var projectedZ=rz*(Math.cos(longitude)*Math.cos(latitude)-1);
      var gapX=a.u*9*globe,gapY=a.v*7*globe;
      var tx=a.x*(1-globe)+projectedX*globe-a.x+gapX+follow;
      var ty=a.y*(1-globe)+projectedY*globe-a.y+gapY;
      var tz=projectedZ*globe+rz*.32*globe;
      var yaw=sign*180*(p-(a.side?1:0))+a.u*39*globe;
      var pitch=-a.v*33*globe;
      var scaleX=1-.12*Math.abs(a.v)*globe;
      a.node.style.transform='translate3d('+tx.toFixed(2)+'px,'+ty.toFixed(2)+
        'px,'+tz.toFixed(2)+'px) rotateY('+yaw.toFixed(2)+'deg) rotateX('+
        pitch.toFixed(2)+'deg) scaleX('+scaleX.toFixed(3)+')';
      // Both card surfaces can be read around the middle; neither flashes in.
      var visible=a.side?smooth((p-.16)/.44):1-smooth((p-.45)/.44);
      a.node.style.opacity=visible.toFixed(3);
      a.node.style.zIndex=String(a.side?(p>.52?50:30):(p<.52?51:29));
      var dim=.035+.23*globe*(.4+.6*Math.abs(Math.sin(longitude)));
      a.node.style.setProperty('--hsk-v37-shade',dim.toFixed(3));
    }
  }
  function drag(dx,preview) {
    if(!dx||!isFinite(dx))return false;
    var direction=dx<0?'left':'right';
    var s=session;
    if(!s){if(!build(direction,preview))return false;s=session;}
    if(s.status!=='drag')return false;
    if(direction!==s.direction){reset();if(!build(direction,preview))return false;s=session;}
    draw(s,cap(Math.abs(dx)/(s.width*1.07),0,.96),dx);
    return true;
  }
  function release(commit,velocity,callback){
    var s=session;if(!s||s.status!=='drag')return false;
    s.status='settling';
    var from=s.progress,fromX=s.dragX,to=commit?1:0;
    var targetX=commit?(s.direction==='left'?-s.width:s.width):0;
    var speed=Math.abs(Number(velocity)||0);
    var duration=cap(790/(1+speed*.72),370,760)*Math.max(.32,Math.abs(to-from));
    var started=null,done=false;
    function finish(){if(done||session!==s)return;done=true;reset();if(commit&&typeof callback==='function')callback();}
    function tick(now){if(session!==s)return;if(started===null)started=now;
      var k=easeOut((now-started)/duration);
      draw(s,from+(to-from)*k,fromX+(targetX-fromX)*k);
      if(k<1)raf=requestAnimationFrame(tick);else finish();}
    raf=requestAnimationFrame(tick);timer=setTimeout(finish,duration+340);
    return true;
  }
  function trigger(direction,preview,callback){
    if(!build(direction,preview)){
      if(!session&&typeof callback==='function')callback();return false;
    }
    draw(session,.035,direction==='left'?-20:20);
    return release(true,.45,callback);
  }
  function cancel(){if(session&&session.status==='drag')release(false,0,null);}
  window.HSKFragmentRoll={begin:build,drag:drag,release:release,
    trigger:trigger,cancel:cancel,isActive:active,
    getProgress:function(){return session?session.progress:0;}};
})();