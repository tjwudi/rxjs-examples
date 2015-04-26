$(function() {
  var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

  var mouseDowns = Rx.Observable.fromEvent(canvas, 'mousedown'),
    mouseMoves = Rx.Observable.fromEvent(canvas, 'mousemove'),
    mouseUps = Rx.Observable.fromEvent(canvas, 'mouseup');

  var draw = mouseDowns.
    map(mouseDown => 
      mouseMoves.
        map(e => { return { x: e.clientX - 10, y: e.clientY - 10 } }).
        takeUntil(mouseUps)).
    concatAll();

  draw.subscribe(pos => context.fillRect(pos.x, pos.y, 2, 2));
});