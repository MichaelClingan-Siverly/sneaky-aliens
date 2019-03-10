/*
 * The server for Sneaky Aliens. Contains calls to database and should not
 * be doing much heavy processing other than that.
 * 
 * I got a good start from here (it took me awhile to find something simple that I could build off of):
 * https://www.valentinog.com/blog/socket-io-node-js-react/
 */


const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3002;
const index = require('./routes/index');
const dbCalls = require('./dbStuff');
app.use(index);


http.listen(port, function () {
    console.log('listening on *:' + port);
});

const emitMessage = function (socket, msg) {
    var rooms = Object.keys(socket.rooms);
    for (let room of rooms) {
        socket.to(room).emit('chat message', msg);
    }
}

function leaveRoom(socket, fromRoom) {
    // var name = socket.userName;
    // var query = {roomName: fromRoom};
    // db.collection(roomCollection).find(query).toArray(function(err, result){
    //     if(err) throw err;
    //     console.log(result);
    // });
    // msg = name + ' has left the room';
    // emitMessage(socket, msg);
    // socket.leave(fromRoom);
}

function joinRoom(socket, toRoom) {
    // var name = socket.userName;
    // var query = {roomName: fromRoom};
    // db.collection(roomCollection).findOne(query, function(err, result){
    //     if(err) throw err;
    //     console.log(result);
    // });
    // socket.join(toRoom);
    // msg = name + ' has joined the room';
    // emitMessage(socket, msg);
}

const moveRoom = function (socket, fromRoom, toRoom) {
    leaveRoom(socket, fromRoom);
    joinRoom(socket, toRoom);
}

io.on('connection', function (socket) {
    socket.on('login', function (name, pass) {
        login(name, pass);

        moveRoom(name, socket.id, 'lobby');

        console.log(userName + ' connected');
    });

    socket.on('register', function (name, pass) {
        register(name, pass);
    });

    socket.on('chat message', function (msg) {
        emitMessage(socket, msg);
    });

    //TODO define more socket events to be listened for

    socket.on('disconnect', function () {
        var userName = 'a user'; //TODO sockets will need to have a username attached to them
        var msg = userName + 'has disconnected';
        var rooms = socket.rooms.slice();
        // for (let room of rooms) {
        //     socket.to(room).emit('chat message', msg);
        // }
        emitMessage(msg);
        console.log(userName + ' disconnected');
    });
}.bind(this));

/* allows this to be used by other files, such as ./bin/www */
module.exports = app;