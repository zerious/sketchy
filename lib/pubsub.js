var beams = app.beams;
var sketches = {};

var getSketch = function (id) {
  var sketch = sketches['id:' + id];
  if (!sketch) {
    sketch = {
      id: id,
      paths: [],
      subscribers: []
    };
    sketches['id:' + id] = sketch;
  }
  return sketch;
  // TODO: Validate the sketch ID against MySQL, and delete if invalid.
};

beams.connect(function (client) {
  client.segments = [];
  client.lastN = 0;
  client.pathIndex = -1;
});

beams.on('s', function (data, client, n) {
  log('Client ' + client.id + ' subscribing to sketch ' + data.s + '.');
  var sketch = getSketch(data.s);
  sketch.subscribers.push(client);
  client.sketch = sketch;
  client.lastN = n;
  client.emit('i', sketch.paths);
});

beams.on('d', function (data, client, n) {
  if (client) {
    data.c = client.id;
    data.n = n;
    var sketch = getSketch(data.s);
    if (data.d[0] == 'M') {
      client.pathIndex = sketch.paths.length;
      var path = {
        id: 'p' + client.pathIndex,
        sketchId: sketch.id,
        data: ''
      };
      sketch.paths.push(path);
    }
    data.p = client.pathIndex;
    client.segments.push(data);
    processSegmentsInOrder(client);
  }
});

var processSegment = function (segment) {
  var client = beams.clients[segment.c];
  sketch = getSketch(segment.s);
  var path = sketch.paths[client.pathIndex];
  path.data += segment.d;
  sketch.subscribers.forEach(function (subscriber) {
    if (subscriber != client) {
      subscriber.emit('d', segment);
    }
  });
};

var processSegmentsInOrder = function (client) {
  var segments = client.segments;
  segments.sort(function (a, b) {
    return a.n - b.n;
  });
  var sketch;
  // TODO: Deal with the case of a lost transmission.
  while (segments[0].n - 1 == client.lastN * 1) {
    var segment = segments.shift();
    client.lastN++;
    processSegment(segment);
    if (!segments.length) {
      break;
    }
  }
};
