require('lighter')({
  httpPort: 8222,
  dbs: {
    sketchy: {
      user: 'root',
      name: 'sketchy'
    }
  },
  enableCluster: false
});

app.work(function () {
  require('./lib/pubsub.js');
});
