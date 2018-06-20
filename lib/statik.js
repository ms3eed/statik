var path = require('path');
var extend = require('extend');
var connect = require('connect');
var isHttps = require('is-req-https');
var fs = require('fs');

var defaults = {
  /* connect options */
  port: 3000,

  /* connect.static options */
  root: path.join(process.cwd(), 'public'),
  maxAge: 86400000,
  hidden: false,
  redirect: true,

  /* other options */
  compress: true,
  verbose: false,
  useHttps: false
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
  
  if(options.useHttps){
    console.log(options.useHttps);
    // enable ssl redirect
    //app.use(redirectSSL);
    app.use(function(req, res, next) {
      if(!isHttps(req)){
        res.writeHead(302,  {Location: 'https://' + req.headers.host + req.url});
        res.end();
      } else {
        next();
      }
    });
  }
  
  app.use(connect.static(options.root, options));

  app.use(function(req, res, next) {
    switch (req.url) {
      case "/adm":
        fs.readFile(options.root + '/../adm', (err, data) => {
          //res.writeHead("404", {'Content-Type': 'text/html'});
          res.end(data, "utf-8");
        });
        break;
      case "/02.html":
        fs.readFile(options.root + '/../02.html', (err, data) => {
          //res.writeHead("404", {'Content-Type': 'text/html'});
          console.log(options.root + '/../02.html');
          res.end(data, "utf-8");
        });
        break;
      default:
        fs.readFile(options.root + '/404.html', (err, data) => {
          res.writeHead("404", {'Content-Type': 'text/html'});
          res.end(data, "utf-8");
        });
    }
  });

  // start the app on given port. defaults to 3000
  app.listen(options.port);

  return app;
};

