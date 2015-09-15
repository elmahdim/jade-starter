var express = require("express"),
    app     = express(),
    port    = 8000;
app
   .use(express.static(__dirname + '/build'))
   .set('view engine', 'jade')
   .use(bodyParser.json())
   .get('/', function(req, res) {
     res.render('index');
   })
   .listen(port);