## koa-frouter

File/Folder as `path`, another router middleware for koa.

### Install

    npm i koa-frouter --save

### Usage

```
router(app, options)
```
- app: {Object} koa instance.
- options: {Object|String->root}
  - root: {String} router directory
  - wildcard: {String} will replace it with ':'
  - filePattern: {RegExp} default /\.js$/

### Example

**File tree**

```
├── app.js
├── package.json
├── ...
└── router
    ├── users
    │   └── *uid.js
    │
    ├── posts
    │   ├── month
    │   │   └── *id.js
    │   ├── week
    │   │   └── *id.js
    │   └── day
    │       └── *id.js
    ├── index.js
    └── links.js
```

**\*uid.js**

```
exports.post = function* (uid) { ... }
```

**\*id.js**

```
exports.get = function* (id) { ... }
```

**index.js**

```
exports.get = function* () { ... }
```

**links.js**

```
exports.get = function* () { ... }
```

**app.js**

```
var koa = require('koa');
var router = require('koa-frouter');

var app = koa();
app.use(router(app, {
  root: './router'
}));
app.listen(3000);
```
equal to:

```
var koa = require('koa');
var _ = require('koa-route');

var users = require('./router/users/*uid.js');
var month = require('./router/posts/month/*id.js');
var week = require('./router/posts/week/*id.js');
var day = require('./router/posts/day/*id.js');
var links = require('./router/links.js');
var index = require('./router/index.js');

var app = koa();

app.use(_.post('/users/:uid', users.post));
app.use(_.get('/posts/month/:id', month.get));
app.use(_.get('/posts/week/:id', week.get));
app.use(_.get('/posts/day/:id', day.get));
app.use(_.get('/links', links.get));
app.use(_.get('/', index.get));
app.use(_.get('/index', index.get));

app.listen(3000);
```

### Test

    npm test

### License

MIT
