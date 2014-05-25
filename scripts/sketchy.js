var Sketchy = window.Sketchy || {}

Sketchy.main = {

  init: function() {
    var self = this;

    self.watchBoard(function(data) {
      self.getJSON('test', data, self.drawLines);
    });
   
    self._bindClickHandlers('')

  },

  grab: function(selector) {
    var by = selector.slice(0,1);
    var name = selector.slice(1);
    
    select = {
      '.': document.getElementsByClassName(name),
      '#': document.getElementById(name),
    }

    $el = select[by];

    if (!$el) {
      $el = document.getElementsByTagName(selector)
    }

    return($el);
  },

  _bindClickHandlers: function(selector, target, action, sketch) {
    var $el = this.grab(selector);

    $el.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      action(this);
    };
  },

  watchBoard: function(callback) {
    var $board,start,path,end,shim;

    $board = this.grab('#sketcher');
    shim = {'x': $board.offsetLeft, 'y': $board.offsetTop }

    $board.onmousedown = function(e) {
      start = calcPosition(e);
      path = [];

      $board.onmousemove = function(e) {
        var current = calcPosition(e);
        path.push(current);
      }
    }

    $board.onmouseup = function(e) {
      end = calcPosition(e);

      return callback({'start': start, 'path': path, 'end': end});
    }

    calcPosition = function(e) {
      var x = e.clientX
      var y = e.clientY

      return {'x': x - shim.x, 'y': y - shim.y }
    }
  },

  getJSON: function(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onload = callback;
    request.open('get',url,true);
    request.send();
  },

  drawLines: function(data) {
    console.log(data);
    // TO DO: draw some lines?
  },
}


Sketchy.main.init();

var beams = getBeams();

// Use fractions of the draw area.
beams.emit('startPath', {x: 0.6, y: 0.2});
beams.emit('movePath', {x: -0.2, y: 0.2});
beams.emit('endPath', {x: -0.2, y: 0.2});
