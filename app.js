var app = require('lighter')({
  env: 'dev',
  httpPort: 8222,
  scripts: {
    "/all.js": [
      'node_modules/lighter/node_modules/jymin/jymin.js',
      'node_modules/lighter/node_modules/beams/beams-client.js',
      'scripts'
    ]
  }
});
