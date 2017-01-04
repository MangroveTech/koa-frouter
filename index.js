var path = require('path');
var ls = require('ls-sync');
var route = require('koa-route');
var rewrite = require('koa-rewrite');

module.exports = function (app, options) {
  if (typeof options === 'string') {
    options = {root: options};
  } else if (!options || !options.root) {
    throw new Error('`root` config required.');
  }
  var wildcard = options.wildcard || '*';
  var filePattern = options.filePattern || /\.js$/;
  var root = options.root;

  //rewrite / to /index
  app.use(rewrite('/', '/index'));

  ls(root).forEach(function (filePath) {
    var isMatch = filePattern.test(filePath);
    if (!isMatch) {
      return;
    }
    var exportFuncs = require(filePath);
    var pathRegexp = formatPath(filePath, root, wildcard);
    for (var method in exportFuncs) {
      try {
        exportFuncs[method].pathRegexp = pathRegexp;
        app.use(route[method.toLowerCase()](pathRegexp, exportFuncs[method]));
      } catch (e) {}
    };
  });

  return function* frouter(next) {
    yield* next;
  };
};

function formatPath(filePath, root, wildcard) {
  return filePath
    .replace(path.resolve(process.cwd(), root), '')
    .replace(/\\/g, '/')
    .replace(new RegExp('/\\' + wildcard, 'g'), '/:')
    .split('.')[0];
}
