var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('socketio', io);
app.use(express.static("public"))

var token = process.env.HANDSHAKE_TOKEN;


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/img/:image/:token', function(req, res) {
    if(token && req.params.token) {
        if (token != req.params.token) {
            res.json({"status":"bad token"});
            return;
        }
    }
    var io = req.app.get('socketio');
    io.emit('image', { image: true, src: '/images/'+ req.params.image + '.gif'});
    res.json({"status":"ok"});
    console.log('served up image '+req.params.image);
    });

