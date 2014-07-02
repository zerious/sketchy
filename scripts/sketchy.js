
var board = getElement('_BOARD');
var beams = Beams();

var resolution = 1e4;
var strokeWidth = 100;
var currentPath = null;
var currentCoords = [0, 0];
var currentId = 0;
var sketchId = location.href.split('?')[1];
var paths = {};
var commandPattern = /([Ml])(-?\d+),?(-?\d+)/g;

// Subscribe to this sketch.
beams._EMIT('s', {s: sketchId});

// Initialize the paths in the sketch.
beams._ON('i', function (paths) {
  forEach(paths, function (path) {
    var element = createPath(path.id);
    path.data.replace(commandPattern, function (match, command, x, y) {
      addData(element, command, x, y);
    });
  });
});

//  data.
beams._ON('d', function (data) {
  var p = 'p' + data.p;
  var path = paths[p];
  if (!path) {
    path = paths[p] = createPath(p);
  }
  data.d.replace(commandPattern, function (match, command, x, y) {
    addData(path, command, x, y);
  });
});

var createPath = function (id) {
  // TODO: Add createElementNS to Jymin.
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.id = id || ('pOwn' + (currentId++));
  setAttribute(path, 'stroke', 'blue');
  setAttribute(path, 'fill', 'none');
  setAttribute(path, 'stroke-width', strokeWidth);
  setAttribute(path, 'stroke-linejoin', 'round');
  setAttribute(path, 'stroke-linecap', 'round');
  appendElement(board, path);
  return path;
};

var addData = function (path, command, x, y) {
  var segList = path.pathSegList;
  var seg;
  if (command == 'M') {
    seg = path.createSVGPathSegMovetoAbs(x, y);
  }
  else if (command == 'l') {
    seg = path.createSVGPathSegLinetoRel(x, y);
  }
  if (seg) {
    segList.appendItem(seg);
  }
  // If it's our own path, send it to the server.
  if (startsWith(path.id, 'pOwn')) {
    var coords = '' + x + (y < 0 ? y : ',' + y);
    beams._EMIT('d', {s: sketchId, d: command + coords});
  }
};

var getDimensions = function () {
  var w = board.offsetWidth;
  var h = board.offsetHeight;
  var min = Math.min(w, h);
  var max = Math.max(w, h);
  return [w, h, min, Math.round((max - min) / 2)];
};

var getCoords = function (event) {
  var x = event.x;
  var y = event.y;
  if (event.touches && event.touches.length) {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  }
  var d = getDimensions();
  var w = d[0];
  var h = d[1];
  var l = d[2]; // Length of a side.
  var p = w < h;
  x -= p ? 0 : d[3];
  y -= p ? d[3] : 0;
  x = Math.round(x / l * resolution);
  y = Math.round(y / l * resolution);
  return [x, y];
};

var endPath = function () {
  if (currentPath) {
    currentPath = 0;
    currentCoords = [0, 0];
  }
};

bind(board, 'mousedown touchstart', function (element, event) {
  endPath();
  var coords = getCoords(event);
  var x = coords[0];
  var y = coords[1];
  currentPath = createPath();
  addData(currentPath, 'M', x, y);
  currentCoords = coords;
  preventDefault(event);
});

bind(board, 'mousemove touchmove', function (element, event) {
  if (currentPath) {
    currentCoords = currentCoords || [0, 0];
    var coords = getCoords(event);
    var x = coords[0] - currentCoords[0];
    var y = coords[1] - currentCoords[1];
    addData(currentPath, 'l', x, y);
    currentCoords = coords;
  }
});

bind(board, 'mouseup touchend', endPath);

trigger(window, 'resize');
