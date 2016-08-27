var path = require('path');
var extend = require('extend');
var connect = require('connect');
var fs = require('fs');

var defaults = {
  /* connect options */
  port: 3000,

  /* connect.static options */
  root: path.join(process.cwd(), 'public'),
  maxAge: 0,
  hidden: false,
  redirect: true,

  /* other options */
  compress: true,
  verbose: false
};

module.exports = function (opts) {
  var options = extend(Object.create(null), defaults, opts);
  var app = connect();

  // setup middlewares
  if (options.compress) {
    app.use(connect.compress());
  }

  if (options.verbose) {
    app.use(connect.logger('short'));
  }

  app.use(connect.static(options.root, options));

  app
  .use(connect.static(__dirname + '/public'))
  .use(function(req, res, next){
    switch (req.url) {
      default:
        console.log(options.root);
        fs.readFile(options.root + '/404.html', (err, data) => {
          res.writeHead("404", {'Content-Type': 'text/html'});
          res.end(data, "utf-8");
        })
    }
  })

  // start the app on given port. defaults to 3000
  app.listen(options.port);

  return app;
};

