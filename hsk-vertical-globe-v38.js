/* HSK Panda V38.2: softly rounded six-ribbon 3D globe with visible gaps.
 * Each band spans the FULL card height; no horizontal slicing.
 * Pointer distance is the primary motion. The following card is visible behind the gaps.
 * The main app keeps tap as a plain answer reveal and handles SRS on committed swipes.
 */
(function(){
 "use strict";
 var scene=null,raf=0,watchdog=0;
 function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
 function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
 function ease(t){t=clamp(t,0,1);return 1-Math.pow(1-t,3);}
 function busy(){return !!scene;}
 function cleanup(){
  if(raf)cancelAnimationFrame(raf);
  if(watchdog)clearTimeout(watchdog);
  raf=0;watchdog=0;
  var s=scene;scene=null;
  if(!s)return;
  if(s.viewport.isConnected)s.viewport.remove();
  if(s.card.isConnected){s.card.classList.remove("hsk-v38-card-hidden");s.card.style.minHeight="";}
  if(s.layout.isConnected)s.layout.classList.remove("hsk-v38-host");
  document.documentElement.classList.remove("hsk-v38-lock-x");
 }
 function build(direction,preview){
  if(scene)return false;
  var card=document.querySelector(".flash-layout > .flash-central");
  var layout=card&&card.closest(".flash-layout");
  if(!card||!layout)return false;
  var width=card.offsetWidth,height=card.offsetHeight;
  if(width<=0||height<=0)return false;
  var before=card.innerHTML;
  var after=typeof preview==="function"?preview(direction):String(preview||"");
  if(!after)return false;
  card.classList.remove("flash-dragging");
  card.style.transform="";card.style.opacity="";
  card.style.removeProperty("--flash-left-opacity");
  card.style.removeProperty("--flash-right-opacity");
  card.style.minHeight=height+"px";
  card.classList.add("hsk-v38-card-hidden");
  layout.classList.add("hsk-v38-host");
  document.documentElement.classList.add("hsk-v38-lock-x");
  var viewport=document.createElement("div");
  viewport.className="hsk-v38-viewport";
  viewport.setAttribute("aria-hidden","true");
  viewport.style.left=card.offsetLeft+"px";
  viewport.style.top=card.offsetTop+"px";
  viewport.style.width=width+"px";
  viewport.style.height=height+"px";
  var stage=document.createElement("div");
  stage.className="hsk-v38-stage";
  var orb=document.createElement("div");
  orb.className="hsk-v38-orb";
  stage.appendChild(orb);
  var back=document.createElement("div");
  back.className="hsk-v38-back";
  var backCard=document.createElement("div");
  backCard.className="flash-central hsk-v38-card";
  backCard.style.width=width+"px";
  backCard.style.height=height+"px";
  backCard.innerHTML=after;
  back.appendChild(backCard);stage.appendChild(back);
  var count=6,pw=width/count,pieces=[];
  for(var side=0;side<2;side++){
   for(var i=0;i<count;i++){
    var x=i*pw;
    var ribbon=document.createElement("div");
    ribbon.className="hsk-v38-ribbon";
    ribbon.style.left=x+"px";ribbon.style.top="0";
    ribbon.style.width=(i===count-1?width-x:pw+0.35)+"px";
    ribbon.style.height=height+"px";
    var clip=document.createElement("div");
    clip.className="hsk-v38-clip";
    var content=document.createElement("div");
    content.className="flash-central hsk-v38-card";
    content.style.left=-x+"px";
    content.style.top="0";
    content.style.width=width+"px";
    content.style.height=height+"px";
    content.innerHTML=side?after:before;
    clip.appendChild(content);ribbon.appendChild(clip);stage.appendChild(ribbon);
    pieces.push({node:ribbon,clip:clip,side:side,i:i,x:x+pw/2-width/2});
   }
  }
  // Direction labels live above the 3D scene instead of inside the ribbons.
  // They cannot disappear behind the openings or become sliced into fragments.
  var feedback=document.createElement("div");
  feedback.className="hsk-v38-feedback";
  feedback.setAttribute("aria-hidden","true");
  var labelLeft=document.createElement("span");
  labelLeft.className="hsk-v38-feedback-label hsk-v38-feedback-left";
  labelLeft.textContent="← Chưa nhớ";
  var labelRight=document.createElement("span");
  labelRight.className="hsk-v38-feedback-label hsk-v38-feedback-right";
  labelRight.textContent="Tiếp theo →";
  labelLeft.style.opacity="0";
  labelRight.style.opacity="0";
  feedback.appendChild(labelLeft);feedback.appendChild(labelRight);
  viewport.appendChild(stage);viewport.appendChild(feedback);layout.appendChild(viewport);
  scene={card:card,layout:layout,viewport:viewport,stage:stage,orb:orb,
   back:back,feedbackLeft:labelLeft,feedbackRight:labelRight,
   pieces:pieces,count:count,width:width,height:height,
   direction:direction,progress:0,dragX:0,status:"drag"};
  draw(scene,0,0);
  return true;
 }
 function draw(s,p,dx){
  if(!s||!s.viewport.isConnected)return;
  p=clamp(p,0,1);dx=Number(dx)||0;s.progress=p;s.dragX=dx;
  // Show the gesture meaning during drag and during committed completion.
  // An incomplete swipe fades the label out as the card springs back.
  var reveal=smooth((Math.abs(dx)-5)/Math.min(72,s.width*.22));
  var feedbackOpacity=clamp(.15+.85*reveal,0,1);
  if(Math.abs(dx)<5)feedbackOpacity=0;
  s.feedbackLeft.style.opacity=s.direction==="left"?feedbackOpacity.toFixed(3):"0";
  s.feedbackRight.style.opacity=s.direction==="right"?feedbackOpacity.toFixed(3):"0";
  var sign=s.direction==="left"?-1:1;
  var globe=Math.pow(Math.max(0,Math.sin(Math.PI*p)),.8);
  var rx=s.width*.53,rz=Math.min(s.width*.255,s.height*.42);
  // Fingers directly pull the old card; 3D orbit only adds curvature.
  var follow=clamp(dx*.78,-s.width*.44,s.width*.44);
  var entering=-sign*s.width*.48*(1-p)+dx*.10*(1-p);
  var nextOpacity=.16+.84*smooth((p-.06)/.57);
  s.back.style.opacity=nextOpacity.toFixed(3);
  // Remove the artificial zoom-out/zoom-in: preserve text size under perspective.
  var backZ=-55*(1-p),perspective=1150;
  var backComp=(perspective-backZ)/perspective;
  s.back.style.transform="translate3d("+entering.toFixed(2)+"px,"+
   (13*(1-p)).toFixed(2)+"px,"+backZ.toFixed(2)+
   "px) rotateY("+(-sign*14*(1-p)).toFixed(2)+"deg) scale("+
   backComp.toFixed(4)+")";
  s.orb.style.opacity=(.24*globe).toFixed(3);
  s.orb.style.transform="translate(-50%,-50%) translateX("+
   clamp(follow*.22,-s.width*.09,s.width*.09).toFixed(2)+"px)";
  var half=(s.count-1)/2;
  for(var k=0;k<s.pieces.length;k++){
   var a=s.pieces[k],u=(a.i-half)/half;
   // Each ribbon is an adjacent longitude of the same broad ellipsoid.
   var latitudeLongitude=u*.84;
   var curveX=(rx*Math.sin(latitudeLongitude)-a.x)*globe;
   var curveZ=rz*(Math.cos(latitudeLongitude)-.62)*globe;
   var spread=u*19*globe;
   var isNew=!!a.side;
   var baseX=isNew?entering:follow;
   var spin=sign*(isNew?-125*(1-p):125*p);
   var yaw=spin+u*44*globe;
   var tx=baseX+curveX+spread;
   var ty=-(3.5+1.5*(1-u*u))*globe;
   var tz=curveZ+(isNew?-15*(1-p):0);
   // Perspective z would otherwise magnify Chinese characters mid-swipe.
   // Invert that magnification while retaining 3D bend, tilt and open gaps.
   var textScale=clamp((perspective-tz)/perspective,.89,1.12);
   a.node.style.transform="translate3d("+tx.toFixed(2)+"px,"+
    ty.toFixed(2)+"px,"+tz.toFixed(2)+"px) rotateY("+
    yaw.toFixed(2)+"deg) scale("+textScale.toFixed(4)+")";
   // Physically open vertical windows; do not create any horizontal seam.
   var seam=clamp(globe*8.5,0,8.5);
   var corner=6+6*globe;
   a.clip.style.borderRadius=corner.toFixed(2)+"px";
   a.clip.style.clipPath="inset(0 "+seam.toFixed(2)+"px 0 "+seam.toFixed(2)+"px round "+corner.toFixed(2)+"px)";
   a.clip.style.webkitClipPath=a.clip.style.clipPath;
   var opacity=isNew?smooth((p-.08)/.48):1-smooth((p-.50)/.37);
   a.node.style.opacity=opacity.toFixed(3);
   a.node.style.zIndex=String(isNew?(p>.51?55:28):(p<.51?56:27));
   a.node.style.setProperty("--hsk-v38-shade",(.03+.18*globe*(.4+.6*Math.abs(u))).toFixed(3));
  }
 }
 function drag(dx,preview){
  if(!isFinite(dx)||dx===0)return false;
  var direction=dx<0?"left":"right",s=scene;
  if(!s){if(!build(direction,preview))return false;s=scene;}
  if(s.status!=="drag")return false;
  if(direction!==s.direction){cleanup();if(!build(direction,preview))return false;s=scene;}
  draw(s,clamp(Math.abs(dx)/(s.width*.94),0,.96),dx);
  return true;
 }
 function release(commit,velocity,callback){
  var s=scene;if(!s||s.status!=="drag")return false;
  s.status="settling";
  var from=s.progress,fromX=s.dragX,to=commit?1:0;
  var targetX=commit?(s.direction==="left"?-s.width:s.width):0;
  var speed=Math.abs(Number(velocity)||0);
  var duration=clamp(810/(1+speed*.72),345,780)*Math.max(.28,Math.abs(to-from));
  var startAt=null,done=false;
  function finish(){
   if(done||scene!==s)return;
   done=true;cleanup();
   if(commit&&typeof callback==="function")callback();
  }
  function step(now){
   if(scene!==s)return;
   if(startAt===null)startAt=now;
   var q=ease((now-startAt)/duration);
   draw(s,from+(to-from)*q,fromX+(targetX-fromX)*q);
   if(q<1)raf=requestAnimationFrame(step);else finish();
  }
  raf=requestAnimationFrame(step);
  watchdog=setTimeout(finish,duration+360);
  return true;
 }
 function trigger(direction,preview,callback){
  if(!build(direction,preview)){
   if(!scene&&typeof callback==="function")callback();
   return false;
  }
  draw(scene,.045,direction==="left"?-24:24);
  return release(true,.55,callback);
 }
 function cancel(){if(scene&&scene.status==="drag")release(false,0,null);}
 window.HSKFragmentRoll={
  begin:build,drag:drag,release:release,trigger:trigger,cancel:cancel,
  isActive:busy,getProgress:function(){return scene?scene.progress:0;}
 };
})();