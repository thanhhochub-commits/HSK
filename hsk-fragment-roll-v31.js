/* HSK Panda: continuous cylindrical mesh for flashcard navigation. */
(function () {
  'use strict';
  var active = false;
  var onFinish = null;
  var raf = 0;
  var watchdog = 0;
  function complete() {
    var done = onFinish;
    onFinish = null;
    active = false;
    if (raf) cancelAnimationFrame(raf);
    if (watchdog) clearTimeout(watchdog);
    raf = 0;
    watchdog = 0;
    if (done) done();
  }
  function ease(q) {
    q = Math.max(0, Math.min(1, q));
    return q * q * (3 - 2 * q);
  }
  function start(changeCard, direction) {
    if (active || typeof changeCard !== 'function') return false;
    var oldCard = document.querySelector('.flash-layout > .flash-central');
    if (!oldCard) { changeCard(); return true; }
    active = true;
    var oldMarkup = oldCard.innerHTML;
    var oldHeight = oldCard.getBoundingClientRect().height;
    try { changeCard(); }
    catch (error) { active = false; throw error; }
    var card = document.querySelector('.flash-layout > .flash-central');
    var layout = card && card.closest('.flash-layout');
    if (!card || !layout) { active = false; return true; }
    var width = card.offsetWidth;
    var height = Math.max(oldHeight, card.getBoundingClientRect().height);
    if (width < 1 || height < 1) { active = false; return true; }
    var newMarkup = card.innerHTML;
    layout.classList.add('flash-mesh-host');
    card.style.minHeight = height + 'px';
    card.classList.add('flash-mesh-hidden');
    var scene = document.createElement('div');
    scene.className = 'flash-mesh-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.style.left = card.offsetLeft + 'px';
    scene.style.top = card.offsetTop + 'px';
    scene.style.width = width + 'px';
    scene.style.height = height + 'px';
    var count = Math.min(28, Math.max(16, Math.round(width / 34)));
    var tileWidth = width / count;
    var pieces = [];
    for (var i = 0; i < count; i++) {
      var x = i * tileWidth;
      var piece = document.createElement('div');
      piece.className = 'flash-mesh-piece';
      piece.style.left = x + 'px';
      piece.style.width = (i === count - 1 ? width - x : tileWidth + 0.8) + 'px';
      piece.style.zIndex = String(count - i);
      for (var side = 0; side < 2; side++) {
        var face = document.createElement('div');
        face.className = 'flash-mesh-face ' + (side ? 'flash-mesh-rear' : 'flash-mesh-front');
        var inner = document.createElement('div');
        inner.className = 'flash-mesh-content';
        inner.style.left = -x + 'px';
        inner.style.width = width + 'px';
        inner.style.height = height + 'px';
        inner.innerHTML = side ? newMarkup : oldMarkup;
        face.appendChild(inner);
        piece.appendChild(face);
      }
      scene.appendChild(piece);
      pieces.push(piece);
    }
    layout.appendChild(scene);
    var sideSign = direction === 'left' ? -1 : 1;
    var span = Math.min(720, Math.max(460, width * .72));
    var localDuration = 720;
    var gap = span / (count - 1);
    var total = localDuration + span;
    var startedAt = null;
    var finished = false;
    onFinish = function () {
      if (finished) return;
      finished = true;
      scene.remove();
      card.classList.remove('flash-mesh-hidden');
      card.style.minHeight = '';
      layout.classList.remove('flash-mesh-host');
    };
    function draw(now) {
      if (!active || !scene.isConnected) { complete(); return; }
      if (startedAt === null) startedAt = now;
      var t = now - startedAt;
      for (var j = 0; j < count; j++) {
        var order = sideSign === 1 ? j : count - 1 - j;
        var q = ease((t - order * gap) / localDuration);
        var angle = sideSign * 180 * q;
        var curve = Math.sin(Math.PI * q);
        var separation = curve * (j - (count - 1) / 2) * 0.72;
        var travel = sideSign * curve * (15 + 11 * Math.sin((j / count) * Math.PI));
        var z = 118 * curve;
        var up = -7 * curve;
        var compress = 1 - .10 * curve;
        pieces[j].style.transform = 'translate3d(' + (separation + travel).toFixed(2) + 'px,' + up.toFixed(2) + 'px,' + z.toFixed(2) + 'px) rotateY(' + angle.toFixed(2) + 'deg) scaleX(' + compress.toFixed(3) + ')';
        pieces[j].style.setProperty('--mesh-shade', (0.03 + 0.28 * curve).toFixed(3));
      }
      if (t < total + 18) raf = requestAnimationFrame(draw);
      else complete();
    }
    raf = requestAnimationFrame(draw);
    watchdog = setTimeout(complete, total + 650);
    return true;
  }
  window.HSKFragmentRoll = {start: start, isActive: function () { return active; }};
})();