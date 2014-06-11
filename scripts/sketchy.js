var beams = getBeams();

var Sketchy = window.Sketchy || {}

Sketchy.main = {

  init: function() {
    var self = this;

    self.watchBoard(self.drawLines);   

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

  _bindClickHandlers: function(selector, target, action) {
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
    console.log('yes');
    $board.onmousedown = function(e) {
      start = calcPosition(e);
      path = [];
      beams.emit('startPath', start);

      $board.onmousemove = function(e) {
        var current = calcPosition(e);
        path.push(current);
        beams.emit('movePath', current);
      }
    }

    $board.onmouseup = function(e) {
      end = calcPosition(e);
      beams.emit('endPath', end);
      return callback({'startPath': start, 
                       'movePath': path, 
                       'endPath': end});
    }

    calcPosition = function(e) {
      var x = e.clientX
      var y = e.clientY

      return {'x': x - shim.x, 'y': y - shim.y }
    }
  },

  drawLines: function(data) {
    console.log(data);
    beams.emit('drawing', data)
    // TO DO: draw some lines?
  },
}


Sketchy.main.init();



// Use fractions of the draw area.
beams.emit('startPath', {x: 0.6, y: 0.2});
beams.emit('movePath', {x: -0.2, y: 0.2});
beams.emit('endPath', {x: -0.2, y: 0.2});
