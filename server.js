var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    port       = 3000;
app
   .use(express.static(__dirname + '/build'))
   .set('view engine', 'jade')
   .use(bodyParser.json())
   .get('/', function(req, res) {
     res.render('index');
   })
   .listen(port);
    console.log('server running on port ' + port);