/* HSK Panda V34 — gesture-driven 3D segmented roll.
 * 7 connected-looking strips, curved faces, visible gaps, real-time drag tracking,
 * inertia from release velocity, and new card showing behind the turning surface.
 */
(function () {
  "use strict";
  var sceneState=null,frameId=0,settleTimer=0;
  function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
  function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
  function easeOut(t){t=clamp(t,0,1);return 1-Math.pow(1-t,3);}
  function busy(){return !!sceneState;}
  function clear(){
    if(frameId)cancelAnimationFrame(frameId);
    if(settleTimer)clearTimeout(settleTimer);
    frameId=0;settleTimer=0;
    var s=sceneState;sceneState=null;
    if(!s)return;
    s.scene.remove();
    if(s.card.isConnected){s.card.classList.remove("hsk-v34-hidden");s.card.style.minHeight="";}
    if(s.layout.isConnected)s.layout.classList.remove("hsk-v34-host");
  }
  function build(direction, previewMarkup){
    var card=document.querySelector(".flash-layout > .flash-central");
    var layout=card&&card.closest(".flash-layout");
    if(!card||!layout)return null;
    var width=card.offsetWidth,height=card.offsetHeight;
    if(width<1||height<1)return null;
    var previousMarkup=card.innerHTML;
    var preview=typeof previewMarkup==="function"?previewMarkup(direction):String(previewMarkup||"");
    if(!preview)return null;
    card.classList.remove("flash-dragging");
    card.style.transform="";
    card.style.opacity="";
    card.style.removeProperty("--flash-left-opacity");
    card.style.removeProperty("--flash-right-opacity");
    card.style.minHeight=height+"px";
    card.classList.add("hsk-v34-hidden");
    layout.classList.add("hsk-v34-host");
    var layer=document.createElement("div");
    layer.className="hsk-v34-layer";
    layer.setAttribute("aria-hidden","true");
    layer.style.left=card.offsetLeft+"px";
    layer.style.top=card.offsetTop+"px";
    layer.style.width=width+"px";
    layer.style.height=height+"px";
    var behind=document.createElement("div");
    behind.className="hsk-v34-behind";
    var behindFace=document.createElement("div");
    behindFace.className="hsk-v34-image";
    behindFace.style.width=width+"px";
    behindFace.style.height=height+"px";
    behindFace.innerHTML=preview;
    behind.appendChild(behindFace);layer.appendChild(behind);
    var count=7,stripW=width/count,strips=[];
    for(var i=0;i<count;i++){
      var x=i*stripW;
      var strip=document.createElement("div");
      strip.className="hsk-v34-strip";
      strip.style.left=x+"px";
      strip.style.width=(i===count-1?width-x:stripW+0.55)+"px";
      for(var side=0;side<2;side++){
        var face=document.createElement("div");
        face.className="hsk-v34-surface "+(side?"hsk-v34-back":"hsk-v34-front");
        var content=document.createElement("div");
        content.className="hsk-v34-image";
        content.style.left=(-x)+"px";
        content.style.width=width+"px";
        content.style.height=height+"px";
        content.innerHTML=side?preview:previousMarkup;
        face.appendChild(content);strip.appendChild(face);
      }
      layer.appendChild(strip);strips.push(strip);
    }
    layout.appendChild(layer);
    sceneState={card:card,layout:layout,scene:layer,behind:behind,strips:strips,
      direction:direction,progress:0,velocity:0,state:"drag",width:width,
      callback:null};
    draw(sceneState,0);
    return sceneState;
  }
  function draw(s,p){
    if(!s||!s.scene.isConnected)return;
    p=clamp(p,0,1);s.progress=p;
    var sign=s.direction==="left"?-1:1;
    var wave=Math.sin(Math.PI*p);
    var spin=sign*180*p;
    var count=s.strips.length;
    var targetRise=21*(1-p);
    s.behind.style.transform="translate3d("+(sign*8*(1-p)).toFixed(2)+"px,"+
      targetRise.toFixed(2)+"px,"+(-56*(1-p)).toFixed(2)+"px) rotateY("+
      (sign*14*(1-p)).toFixed(2)+"deg) scale("+(0.98+0.02*p).toFixed(4)+")";
    s.behind.style.opacity=(0.92+0.08*p).toFixed(3);
    for(var k=0;k<count;k++){
      var centered=k-(count-1)/2;
      var normalized=centered/((count-1)/2);
      var angle=spin+sign*normalized*28*wave;
      var gap=centered*10*wave;
      var depth=wave*(42-8*Math.abs(normalized));
      var y=-6*wave*(1-0.3*Math.abs(normalized));
      var drift=sign*9*p;
      var strip=s.strips[k];
      strip.style.transform="translate3d("+(gap+drift).toFixed(2)+"px,"+
        y.toFixed(2)+"px,"+depth.toFixed(2)+"px) rotateY("+angle.toFixed(2)+"deg)";
      strip.style.setProperty("--v34-shade",(0.04+wave*(0.07+0.13*Math.abs(normalized))).toFixed(3));
    }
  }
  function begin(direction,preview){
    if(sceneState)return false;
    return !!build(direction,preview);
  }
  function drag(delta,preview){
    var direction=delta<0?"left":"right";
    var s=sceneState;
    if(!s){if(!begin(direction,preview))return false;s=sceneState;}
    if(s.state!=="drag")return false;
    if(s.direction!==direction){
      clear();
      if(!begin(direction,preview))return false;
      s=sceneState;
    }
    // During drag, turn angle follows finger displacement continuously.
    draw(s,clamp(Math.abs(delta)/(s.width*0.78),0,0.92));
    return true;
  }
  function release(commit,velocity,callback){
    var s=sceneState;
    if(!s||s.state!=="drag")return false;
    s.state="settle";
    s.callback=typeof callback==="function"?callback:null;
    var from=s.progress,to=commit?1:0;
    var speed=Math.abs(Number(velocity)||0); // px/ms
    var distance=Math.abs(to-from);
    var duration=clamp(620/(1+speed*1.5),220,650)*Math.max(0.24,distance);
    var started=null;
    function tick(time){
      if(sceneState!==s)return;
      if(started===null)started=time;
      var q=easeOut((time-started)/duration);
      draw(s,from+(to-from)*q);
      if(q<1){frameId=requestAnimationFrame(tick);}
      else{
        var cb=s.callback;
        clear();
        if(commit&&cb)cb();
      }
    }
    frameId=requestAnimationFrame(tick);
    settleTimer=setTimeout(function(){
      if(sceneState!==s)return;
      var cb=s.callback;clear();if(commit&&cb)cb();
    },duration+280);
    return true;
  }
  function trigger(direction,preview,callback){
    if(!begin(direction,preview)){
      if(!sceneState&&typeof callback==="function")callback();
      return false;
    }
    var s=sceneState;
    draw(s,0.065);
    return release(true,0.65,callback);
  }
  function cancel(){if(sceneState&&sceneState.state==="drag")release(false,0,null);}
  window.HSKFragmentRoll={
    begin:begin,drag:drag,release:release,trigger:trigger,cancel:cancel,
    isActive:busy,getProgress:function(){return sceneState?sceneState.progress:0;}
  };
})();