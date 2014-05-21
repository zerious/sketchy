require('lighter')({
  env: 'dev',
  scripts: {
    "/all.js": [
      'node_modules/lighter/node_modules/jymin/jymin.js',
      'node_modules/lighter/node_modules/beams/beams-client.js',
      'scripts'
    ]
  }
});
