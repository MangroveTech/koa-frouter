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
  var root = options.root;

  //rewrite / to /index
  app.use(rewrite('/', '/index'));

  ls(root).forEach(function (filePath) {
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
    if (!isAbsilutePath(root)) {
        root = path.join(process.cwd(), root);
    }
    return filePath
        .replace(root, '')
        .replace(/\\/g, '/')
        .replace(new RegExp('/\\' + wildcard, 'g'), '/:')
        .split('.')[0];
}

function isAbsilutePath(path) {
    let rex = new RegExp(/^[A-Za-z]\:/);
    return rex.test(path);
}
