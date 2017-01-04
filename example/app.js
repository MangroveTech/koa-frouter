var koa = require('koa');
var router = require('..');

var app = koa();

app.use(router(app, {
  root: './example/router',
  // root: require('path').join(__dirname, 'router'),
  wildcard: '_',
  filePattern: /\.js$/
}));

app.listen(3000, function () {
    console.log('Listening on 3000!');
});
