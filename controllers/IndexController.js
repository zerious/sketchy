module.exports = {

  index: function GET(request, response) {
    // If we're coming back to a saved sketch, load it.
    if (request.url.indexOf('?') > 0) {
      response.view('index');
    }
    // Otherwise, create a new sketch.
    else {
      // TODO: Load a welcome page instead of automagically creating a sketch?
      this.new(request, response);
    }
  },

  new: function GET(request, response) {
    // TODO: Find a better way to scale than MySQL auto increment.
    Sketches.save({}, function (err, item) {
      if (err) throw err;
      response.redirect('/?' + item.id);
    });
  }

};
