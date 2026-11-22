/* HSK Panda V33 — soft 3D fragmented roll.
 * Tap only reveals the answer. Swipe left/right drives this transition.
 * Seven broad strips bend as one surface, opening gaps over a rising next card.
 */
(function () {
  "use strict";

  var active=false, animationFrame=0, safetyTimer=0, cleanup=null;

  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
  function stop(){
    if(!active)return;
    active=false;
    if(animationFrame)cancelAnimationFrame(animationFrame);
    if(safetyTimer)clearTimeout(safetyTimer);
    animationFrame=0;safetyTimer=0;
    var fn=cleanup;cleanup=null;
    if(fn)fn();
  }

  function start(changeCard,direction){
    if(active||typeof changeCard!=="function")return false;
    var previous=document.querySelector(".flash-layout > .flash-central");
    if(!previous){changeCard();return true;}

    previous.classList.remove("flash-dragging");
    previous.style.transform="";
    previous.style.opacity="";
    previous.style.removeProperty("--flash-left-opacity");
    previous.style.removeProperty("--flash-right-opacity");

    var before=previous.innerHTML,oldHeight=previous.getBoundingClientRect().height;
    active=true;
    try{changeCard();}catch(error){active=false;throw error;}

    var card=document.querySelector(".flash-layout > .flash-central");
    var layout=card&&card.closest(".flash-layout");
    if(!card||!layout){active=false;return true;}

    var width=card.offsetWidth,height=Math.max(oldHeight,card.getBoundingClientRect().height);
    if(width<1||height<1){active=false;return true;}
    var after=card.innerHTML;

    layout.classList.add("hsk-softroll-host");
    card.style.minHeight=height+"px";
    card.classList.add("hsk-softroll-hidden");

    var scene=document.createElement("div");
    scene.className="hsk-softroll-scene";
    scene.setAttribute("aria-hidden","true");
    scene.style.left=card.offsetLeft+"px";
    scene.style.top=card.offsetTop+"px";
    scene.style.width=width+"px";
    scene.style.height=height+"px";

    var background=document.createElement("div");
    background.className="hsk-softroll-next";
    var nextFace=document.createElement("div");
    nextFace.className="hsk-softroll-card";
    nextFace.style.width=width+"px";
    nextFace.style.height=height+"px";
    nextFace.innerHTML=after;
    background.appendChild(nextFace);
    scene.appendChild(background);

    var count=7,partWidth=width/count,slices=[];
    for(var i=0;i<count;i++){
      var x=i*partWidth;
      var slice=document.createElement("div");
      slice.className="hsk-softroll-strip";
      slice.style.left=x+"px";
      slice.style.width=(i===count-1?width-x:partWidth+0.6)+"px";
      slice.style.zIndex=String(20+i);

      var windowFace=document.createElement("div");
      windowFace.className="hsk-softroll-window";
      var content=document.createElement("div");
      content.className="hsk-softroll-card";
      content.style.left=(-x)+"px";
      content.style.width=width+"px";
      content.style.height=height+"px";
      content.innerHTML=before;
      windowFace.appendChild(content);
      slice.appendChild(windowFace);
      scene.appendChild(slice);
      slices.push(slice);
    }
    layout.appendChild(scene);

    var sign=direction==="left"?-1:1;
    var duration=930,startTime=null,done=false;
    cleanup=function(){
      if(done)return;
      done=true;
      scene.remove();
      card.classList.remove("hsk-softroll-hidden");
      card.style.minHeight="";
      layout.classList.remove("hsk-softroll-host");
    };

    function tick(now){
      if(!active||!scene.isConnected){stop();return;}
      if(startTime===null)startTime=now;
      var time=clamp((now-startTime)/duration,0,1);
      var p=smooth(time);
      var wave=Math.pow(Math.max(0,Math.sin(Math.PI*p)),0.9);
      var gapSize=Math.max(22,Math.min(32,width*0.05));
      var backRise=24*(1-p);
      var backScale=0.985+0.015*p;
      background.style.transform="translate3d("+(sign*7*(1-p)).toFixed(2)+"px,"+
        backRise.toFixed(2)+"px,"+(-28*(1-p)).toFixed(2)+"px) scale("+backScale.toFixed(4)+")";
      background.style.opacity=(0.78+0.22*p).toFixed(3);

      for(var k=0;k<count;k++){
        var normalized=(k-(count-1)/2)/((count-1)/2);
        var abs=Math.abs(normalized);
        var arc=sign*normalized*22*wave;
        var gap=normalized*gapSize*wave;
        var depth=(34+8*(1-abs*abs))*wave;
        var lift=-6*wave*(1-0.3*abs);
        var travel=sign*12*p;
        // A broad rolling surface with visible seams, not seven independent flips.
        slices[k].style.transform="translate3d("+(gap+travel).toFixed(2)+"px,"+
          lift.toFixed(2)+"px,"+depth.toFixed(2)+"px) rotateY("+arc.toFixed(2)+"deg)";
        var startFade=0.55+(sign===1?k:count-1-k)*0.031;
        var fade=smooth((p-startFade)/0.26);
        slices[k].style.opacity=(1-fade).toFixed(3);
        slices[k].style.setProperty("--softroll-shadow",(0.05+wave*(0.08+0.13*abs)).toFixed(3));
      }

      if(time<1)animationFrame=requestAnimationFrame(tick);
      else stop();
    }
    animationFrame=requestAnimationFrame(tick);
    safetyTimer=setTimeout(stop,duration+650);
    return true;
  }

  // Keep the same public API already used by the main HSK Panda app.
  window.HSKFragmentRoll={start:start,isActive:function(){return active;}};
})();