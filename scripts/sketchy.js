var Sketchy = window.sketchy || {}

Sketchy.main = {

	init: function() {
		this.listen();
		console.log(this);
    alert('hello');
    
	},

	_bindClickHandlers: function($el, target, action) {
		var pointer = document.getElementByID('marker')
	},

	startSketch: function(x, y, callback) {

	},


}

window.onload(function() {
	Sketchy.main.init();
});



console.log('Put your app code here');

var beams = getBeams();

// Use fractions of the draw area.
beams.emit('startPath', {x: 0.6, y: 0.2});
beams.emit('movePath', {x: -0.2, y: 0.2});
beams.emit('endPath', {x: -0.2, y: 0.2});
