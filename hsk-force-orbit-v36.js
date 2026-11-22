/* HSK Panda V36: force-follow fragmented spherical swipe.
 * Horizontal translation is driven by pointer displacement; 3D rotation accompanies it.
 * The next card travels into view from the opposite side through the fragment gaps.
 */
(function () {
  'use strict';
  var current=null, raf=0, timeout=0;
  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function smooth(x){x=clamp(x,0,1);return x*x*(3-2*x);}
  function easeOut(x){return 1-Math.pow(1-clamp(x,0,1),3);}
  function isActive(){return !!current;}
  function clear(){
    if(raf)cancelAnimationFrame(raf);if(timeout)clearTimeout(timeout);
    raf=0;timeout=0;
    var s=current;current=null;if(!s)return;
    if(s.stage.isConnected)s.stage.remove();
    if(s.card.isConnected){s.card.classList.remove('hsk-force-in-progress');s.card.style.minHeight='';}
    if(s.layout.isConnected)s.layout.classList.remove('hsk-force-host');
  }
  function start(direction,preview){
    if(current)return false;
    var card=document.querySelector('.flash-layout > .flash-central');
    var layout=card&&card.closest('.flash-layout');
    if(!card||!layout)return false;
    var w=card.offsetWidth,h=card.offsetHeight;
    if(!w||!h)return false;
    var oldHTML=card.innerHTML;
    var nextHTML=typeof preview==='function'?preview(direction):String(preview||'');
    if(!nextHTML)return false;
    card.classList.remove('flash-dragging');card.style.transform='';card.style.opacity='';
    card.style.removeProperty('--flash-left-opacity');card.style.removeProperty('--flash-right-opacity');
    card.style.minHeight=h+'px';card.classList.add('hsk-force-in-progress');layout.classList.add('hsk-force-host');
    var stage=document.createElement('div');stage.className='hsk-force-stage';
    stage.setAttribute('aria-hidden','true');stage.style.left=card.offsetLeft+'px';
    stage.style.top=card.offsetTop+'px';stage.style.width=w+'px';stage.style.height=h+'px';
    var under=document.createElement('div');under.className='hsk-force-under';
    var underBody=document.createElement('div');underBody.className='hsk-force-content';
    underBody.style.width=w+'px';underBody.style.height=h+'px';underBody.innerHTML=nextHTML;
    under.appendChild(underBody);stage.appendChild(under);
    var cols=3,rows=3,tiles=[],pw=w/cols,ph=h/rows;
    for(var side=0;side<2;side++){
      for(var row=0;row<rows;row++)for(var col=0;col<cols;col++){
        var x=col*pw,y=row*ph;
        var tile=document.createElement('div');tile.className='hsk-force-tile';
        tile.style.left=x+'px';tile.style.top=y+'px';
        tile.style.width=(col===cols-1?w-x:pw+0.5)+'px';
        tile.style.height=(row===rows-1?h-y:ph+0.5)+'px';
        tile.style.zIndex=String(side?30:40);
        var clip=document.createElement('div');clip.className='hsk-force-clip';
        var content=document.createElement('div');content.className='hsk-force-content';
        content.style.left=-x+'px';content.style.top=-y+'px';
        content.style.width=w+'px';content.style.height=h+'px';
        content.innerHTML=side?nextHTML:oldHTML;
        clip.appendChild(content);tile.appendChild(clip);stage.appendChild(tile);
        tiles.push({el:tile,side:side,col:col,row:row});
      }
    }
    layout.appendChild(stage);
    current={card:card,layout:layout,stage:stage,under:under,tiles:tiles,
      width:w,height:h,cols:cols,rows:rows,direction:direction,progress:0,dragX:0,state:'drag'};
    draw(current,0,0);return true;
  }
  // The cards translate with the user's hand; spherical shading and turn are secondary.
  function draw(s,progress,dragX){
    if(!s||!s.stage.isConnected)return;
    var p=clamp(progress,0,1),x=Number(dragX)||0;
    s.progress=p;s.dragX=x;
    var sign=s.direction==='left'?-1:1;
    var bend=Math.sin(Math.PI*p);
    var oldTravel=x*0.94;
    var newEntry=-sign*s.width*0.68*(1-p)+x*0.10*(1-p);
    var curveStrength=24*bend;
    s.under.style.opacity=(0.08+0.92*smooth((p-0.07)/0.64)).toFixed(3);
    s.under.style.transform='translate3d('+(newEntry).toFixed(2)+'px,'+
      (18*(1-p)).toFixed(2)+'px,'+(-42*(1-p)).toFixed(2)+
      'px) rotateY('+(-sign*16*(1-p)).toFixed(2)+'deg) scale('+
      (0.97+0.03*p).toFixed(3)+')';
    for(var i=0;i<s.tiles.length;i++){
      var t=s.tiles[i];
      var u=(t.col-(s.cols-1)/2)/((s.cols-1)/2);
      var v=(t.row-(s.rows-1)/2)/((s.rows-1)/2);
      // All pieces share the same drag-driven base movement.
      var baseX=t.side?newEntry:oldTravel;
      var gapX=u*curveStrength;
      var gapY=v*10*bend;
      var tx=baseX+gapX+(t.side?-sign*5:sign*5)*bend;
      var ty=gapY-8*bend;
      var tz=(t.side?22:48)*bend-(t.side?20*(1-p):0);
      var rotY=(t.side?-sign*75*(1-p):sign*77*p)+sign*u*23*bend;
      var rotX=-v*25*bend;
      t.el.style.transform='translate3d('+tx.toFixed(2)+'px,'+
        ty.toFixed(2)+'px,'+tz.toFixed(2)+'px) rotateY('+
        rotY.toFixed(2)+'deg) rotateX('+rotX.toFixed(2)+'deg)';
      var visible=t.side?smooth((p-0.08)/0.46):1-smooth((p-0.52)/0.34);
      t.el.style.opacity=visible.toFixed(3);
      t.el.style.setProperty('--sphere-dim',(0.05+0.21*bend*(0.45+Math.abs(u)*0.55)).toFixed(3));
      t.el.style.zIndex=String(t.side?(p>0.46?55:30):(p<0.54?58:34));
    }
  }
  function drag(delta,preview){
    var direction=delta<0?'left':'right',s=current;
    if(!s){if(!start(direction,preview))return false;s=current;}
    if(s.state!=='drag')return false;
    if(direction!==s.direction){
      clear();
      if(!start(direction,preview))return false;
      s=current;
    }
    var p=clamp(Math.abs(delta)/(s.width*0.78),0,0.97);
    draw(s,p,delta);
    return true;
  }
  function release(commit,velocity,callback){
    var s=current;if(!s||s.state!=='drag')return false;
    s.state='settle';
    var fromP=s.progress,fromX=s.dragX,toP=commit?1:0;
    var sign=s.direction==='left'?-1:1;
    var toX=commit?sign*s.width*1.08:0;
    var speed=Math.abs(Number(velocity)||0);
    var duration=clamp(810/(1+speed*0.78),350,760)*
      Math.max(0.28,Math.abs(toP-fromP));
    var started=null,ended=false;
    function finish(){
      if(ended||current!==s)return;
      ended=true;clear();
      if(commit&&typeof callback==='function')callback();
    }
    function tick(time){
      if(current!==s)return;
      if(started===null)started=time;
      var t=easeOut((time-started)/duration);
      draw(s,fromP+(toP-fromP)*t,fromX+(toX-fromX)*t);
      if(t<1)raf=requestAnimationFrame(tick);else finish();
    }
    raf=requestAnimationFrame(tick);
    timeout=setTimeout(finish,duration+330);
    return true;
  }
  function trigger(direction,preview,callback){
    if(!start(direction,preview)){
      if(!current&&typeof callback==='function')callback();
      return false;
    }
    draw(current,.055,direction==='left'?-24:24);
    return release(true,.5,callback);
  }
  function cancel(){if(current&&current.state==='drag')release(false,0,null);}
  window.HSKFragmentRoll={begin:start,drag:drag,release:release,trigger:trigger,cancel:cancel,
    isActive:isActive,getProgress:function(){return current?current.progress:0;}};
})();