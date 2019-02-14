const path = require('path');
const express = require('express');
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

exports.StartServer = function(port, connectFn = undefined) {

    app.use('/', express.static(path.resolve(__dirname)))
    http.listen(port, () => console.log(`Web server listening on port ${port}!`))

    io.on('connection', function(socket) { 
        console.log("New connection...");
        if(connectFn != undefined)
            connectFn(socket);
    });

    return io;
}
 


