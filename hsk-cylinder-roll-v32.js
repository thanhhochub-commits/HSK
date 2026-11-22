/* HSK Panda V32: two fully textured faces wrapped around one moving 3D cylinder.
   Only swipe/left-right navigation invokes this engine. Clicking a card stays a plain reveal. */
(function () {
  'use strict';
  var active = false;
  var pending = null;
  var frameHandle = 0;
  var failSafe = 0;

  function smoothstep(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }
  function finish() {
    if (!active) return;
    var cleanup = pending;
    pending = null;
    active = false;
    if (frameHandle) cancelAnimationFrame(frameHandle);
    if (failSafe) clearTimeout(failSafe);
    frameHandle = 0;
    failSafe = 0;
    if (cleanup) cleanup();
  }
  function run(nextCard, direction) {
    if (active || typeof nextCard !== 'function') return false;
    var oldCard = document.querySelector('.flash-layout > .flash-central');
    if (!oldCard) { nextCard(); return true; }

    var oldHTML = oldCard.innerHTML;
    var oldHeight = oldCard.getBoundingClientRect().height;
    oldCard.classList.remove('flash-dragging');
    oldCard.style.transform = '';
    oldCard.style.opacity = '';
    oldCard.style.removeProperty('--flash-left-opacity');
    oldCard.style.removeProperty('--flash-right-opacity');

    active = true;
    try { nextCard(); }
    catch (error) { active = false; throw error; }
    var card = document.querySelector('.flash-layout > .flash-central');
    var layout = card && card.closest('.flash-layout');
    if (!card || !layout) { active = false; return true; }
    var width = card.offsetWidth;
    var height = Math.max(oldHeight, card.getBoundingClientRect().height);
    if (!width || !height) { active = false; return true; }

    var newHTML = card.innerHTML;
    card.style.minHeight = height + 'px';
    card.classList.add('hsk-cylinder-card-hidden');
    layout.classList.add('hsk-cylinder-layout');
    var scene = document.createElement('div');
    scene.className = 'hsk-cylinder-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.style.left = card.offsetLeft + 'px';
    scene.style.top = card.offsetTop + 'px';
    scene.style.width = width + 'px';
    scene.style.height = height + 'px';

    var count = Math.max(18, Math.min(30, Math.ceil(width / 28)));
    var stripWidth = width / count;
    var radius = width / Math.PI;
    var pieces = [];
    for (var side = 0; side < 2; side++) {
      for (var k = 0; k < count; k++) {
        var x = k * stripWidth;
        var piece = document.createElement('div');
        piece.className = 'hsk-cylinder-piece';
        piece.setAttribute('data-side', side ? 'next' : 'previous');
        piece.style.width = (stripWidth + 1.1) + 'px';
        piece.style.marginLeft = -(stripWidth + 1.1) / 2 + 'px';
        var viewport = document.createElement('div');
        viewport.className = 'hsk-cylinder-viewport';
        var image = document.createElement('div');
        image.className = 'hsk-cylinder-image';
        image.style.left = -k * stripWidth + 'px';
        image.style.width = width + 'px';
        image.style.height = height + 'px';
        image.innerHTML = side ? newHTML : oldHTML;
        viewport.appendChild(image);
        piece.appendChild(viewport);
        scene.appendChild(piece);
        pieces.push({ element: piece, index: k, side: side });
      }
    }
    layout.appendChild(scene);

    var milliseconds = 1080;
    var sign = direction === 'left' ? -1 : 1;
    var initialTime = null;
    var done = false;
    pending = function () {
      if (done) return;
      done = true;
      scene.remove();
      card.style.minHeight = '';
      card.classList.remove('hsk-cylinder-card-hidden');
      layout.classList.remove('hsk-cylinder-layout');
    };

    function draw(now) {
      if (!active || !scene.isConnected) { finish(); return; }
      if (initialTime === null) initialTime = now;
      var time = Math.min(1, (now - initialTime) / milliseconds);
      var p = smoothstep(time);
      var bend = Math.pow(Math.sin(Math.PI * p), 0.72);
      var rotation = sign * Math.PI * p;
      var spread = Math.sin(Math.PI * p);
      for (var n = 0; n < pieces.length; n++) {
        var data = pieces[n];
        var index = data.index;
        var flatX = (index + .5) * stripWidth - width / 2;
        var phi = (flatX / radius) * bend;
        var theta = phi + rotation - (data.side ? sign * Math.PI : 0);
        var cx = (1 - bend) * flatX + bend * radius * Math.sin(theta);
        // Small separation follows the circumference, never independent flipping.
        var split = 6.5 * spread * Math.sin((index / (count - 1)) * Math.PI * 3);
        var cz = radius * (Math.cos(theta) - 1) + 15 * spread;
        var cy = -6 * spread * Math.sin((index / (count - 1)) * Math.PI);
        var angleDeg = theta * 180 / Math.PI;
        data.element.style.transform = 'translate3d(' + (cx + split).toFixed(2) + 'px,' + cy.toFixed(2) + 'px,' + cz.toFixed(2) + 'px) rotateY(' + angleDeg.toFixed(2) + 'deg)';
        var brightness = 0.05 + .26 * (1 - Math.cos(theta)) * .5 + .08 * spread;
        data.element.style.setProperty('--cylinder-shadow', brightness.toFixed(3));
      }
      if (time < 1) frameHandle = requestAnimationFrame(draw);
      else finish();
    }
    frameHandle = requestAnimationFrame(draw);
    failSafe = setTimeout(finish, milliseconds + 850);
    return true;
  }
  window.HSKFragmentRoll = { start: run, isActive: function () { return active; } };
})();