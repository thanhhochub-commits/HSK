/* HSK Panda V35: spherical carousel of independent card fragments. */
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
    if(s.card.isConnected){s.card.classList.remove('hsk-sphere-in-progress');s.card.style.minHeight='';}
    if(s.layout.isConnected)s.layout.classList.remove('hsk-sphere-host');
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
    card.style.minHeight=h+'px';card.classList.add('hsk-sphere-in-progress');layout.classList.add('hsk-sphere-host');
    var stage=document.createElement('div');stage.className='hsk-sphere-stage';
    stage.setAttribute('aria-hidden','true');stage.style.left=card.offsetLeft+'px';
    stage.style.top=card.offsetTop+'px';stage.style.width=w+'px';stage.style.height=h+'px';
    var under=document.createElement('div');under.className='hsk-sphere-under';
    var underBody=document.createElement('div');underBody.className='hsk-sphere-content';
    underBody.style.width=w+'px';underBody.style.height=h+'px';underBody.innerHTML=nextHTML;
    under.appendChild(underBody);stage.appendChild(under);
    var cols=3,rows=3,tiles=[],pw=w/cols,ph=h/rows;
    for(var side=0;side<2;side++){
      for(var row=0;row<rows;row++)for(var col=0;col<cols;col++){
        var x=col*pw,y=row*ph;
        var tile=document.createElement('div');tile.className='hsk-sphere-tile';
        tile.style.left=x+'px';tile.style.top=y+'px';
        tile.style.width=(col===cols-1?w-x:pw+0.5)+'px';
        tile.style.height=(row===rows-1?h-y:ph+0.5)+'px';
        tile.style.zIndex=String(side?30:40);
        var clip=document.createElement('div');clip.className='hsk-sphere-clip';
        var content=document.createElement('div');content.className='hsk-sphere-content';
        content.style.left=-x+'px';content.style.top=-y+'px';
        content.style.width=w+'px';content.style.height=h+'px';
        content.innerHTML=side?nextHTML:oldHTML;
        clip.appendChild(content);tile.appendChild(clip);stage.appendChild(tile);
        tiles.push({el:tile,side:side,col:col,row:row});
      }
    }
    layout.appendChild(stage);
    current={card:card,layout:layout,stage:stage,under:under,tiles:tiles,
      width:w,height:h,cols:cols,rows:rows,direction:direction,progress:0,state:'drag'};
    draw(current,0);return true;
  }
  function draw(s,progress){
    if(!s||!s.stage.isConnected)return;
    var p=clamp(progress,0,1);s.progress=p;
    var sign=s.direction==='left'?-1:1;
    var fullness=Math.pow(Math.sin(Math.PI*p),0.76);
    var radius=s.width*0.53;
    s.under.style.opacity=(0.24+0.55*smooth((p-0.12)/0.72)).toFixed(3);
    s.under.style.transform='translate3d(0,'+(20*(1-p)).toFixed(2)+'px,-36px) scale('+(0.96+0.04*p).toFixed(3)+')';
    for(var i=0;i<s.tiles.length;i++){
      var t=s.tiles[i],u=(t.col-(s.cols-1)/2)/((s.cols-1)/2);
      var v=(t.row-(s.rows-1)/2)/((s.rows-1)/2);
      var q=t.side?p-1:p;
      var theta=sign*(Math.PI*2/3)*q+u*0.35*fullness;
      var lat=v*0.58*fullness;
      var flatX=(t.col+.5)*s.width/s.cols-s.width/2;
      var flatY=(t.row+.5)*s.height/s.rows-s.height/2;
      var sphericalX=radius*Math.sin(theta)*Math.cos(lat);
      var sphericalY=s.height*0.58*Math.sin(lat);
      var targetX=flatX*(1-fullness)+sphericalX*fullness;
      var targetY=flatY*(1-fullness)+sphericalY*fullness;
      var spread=fullness*(u*15+sign*5*Math.sin(v*2.2));
      var z=clamp(radius*(Math.cos(theta)*Math.cos(lat)-1)*fullness,-175,24);
      var angleY=(sign*120*q+u*20*fullness);
      var angleX=-v*32*fullness;
      var shiftX=targetX-flatX+spread,shiftY=targetY-flatY+v*10*fullness;
      t.el.style.transform='translate3d('+shiftX.toFixed(2)+'px,'+shiftY.toFixed(2)+'px,'+z.toFixed(2)+'px) rotateY('+angleY.toFixed(2)+'deg) rotateX('+angleX.toFixed(2)+'deg)';
      var visible=t.side?smooth((p-0.14)/0.44):(1-smooth((p-0.48)/0.28));
      t.el.style.opacity=visible.toFixed(3);
      t.el.style.setProperty('--sphere-dim',(0.07+0.25*fullness*(0.45+Math.abs(u)*0.55)).toFixed(3));
      t.el.style.zIndex=String(t.side?(p>0.45?52:32):(p<0.55?55:34));
    }
  }
  function drag(delta,preview){
    var direction=delta<0?'left':'right';var s=current;
    if(!s){if(!start(direction,preview))return false;s=current;}
    if(s.state!=='drag')return false;
    if(direction!==s.direction){clear();if(!start(direction,preview))return false;s=current;}
    draw(s,clamp(Math.abs(delta)/(s.width*0.82),0,0.96));return true;
  }
  function release(commit,velocity,callback){
    var s=current;if(!s||s.state!=='drag')return false;
    s.state='settle';var from=s.progress,to=commit?1:0;
    var speed=Math.abs(Number(velocity)||0);
    var duration=clamp(800/(1+speed*.80),330,760)*Math.max(.23,Math.abs(to-from));
    var started=null,ended=false;
    function finish(){if(ended||current!==s)return;ended=true;clear();if(commit&&typeof callback==='function')callback();}
    function tick(time){if(current!==s)return;if(started===null)started=time;
      var t=easeOut((time-started)/duration);
      draw(s,from+(to-from)*t);
      if(t<1)raf=requestAnimationFrame(tick);else finish();}
    raf=requestAnimationFrame(tick);timeout=setTimeout(finish,duration+320);return true;
  }
  function trigger(direction,preview,callback){
    if(!start(direction,preview)){if(!current&&typeof callback==='function')callback();return false;}
    draw(current,.04);return release(true,.35,callback);
  }
  function cancel(){if(current&&current.state==='drag')release(false,0,null);}
  window.HSKFragmentRoll={begin:start,drag:drag,release:release,trigger:trigger,cancel:cancel,
    isActive:isActive,getProgress:function(){return current?current.progress:0;}};
})();