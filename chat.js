var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log(__dirname + '/index.html');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('connected');
    socket.on('chat_message', function(msg){
        console.log('message: ' + msg);
    });
});

io.on('connection', function(socket){
    socket.on('chat_message', function(msg){
        io.emit('chat_message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
