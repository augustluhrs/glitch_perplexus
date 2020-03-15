
let port = process.env.PORT || 8000;
const express = require("express");
const app = express();
let server = require('http').createServer(app).listen(port, function() {
  console.log('Server listening at port: ', port);
});

app.use(express.static("public")); 

let io = require('socket.io').listen(server);

//unity
var unity = io.of('/');
unity.on('connection', function(socket){
  console.log('unity connected');
});

//phone
var phone = io.of('/input');
phone.on('connection', function(socket){
  console.log('phone connected');
  
  socket.on('all good', function(){
    console.log('all good');
  });
  socket.on('reading', function(quat){
    // console.log('0: ' + quat[0]);
    // console.log('1: ' + quat[1]);
    // console.log('2: ' + quat[2]);
    // console.log('3: ' + quat[3]);
    unity.emit('reading', {id: socket.id, qX: quat[0], qY: quat[1], qZ: quat[2], qW: quat[3]});
  });
  socket.on('disconnect', function(){
    console.log('disconnected: ' + socket.id);
    unity.emit('clientDisconnect', {id: socket.id});
    // console.log('disconnect' + client_arrays[0].id);
    // for (let i = client_arrays.length - 1; i >= 0 ; i--){
    //   if (client_arrays[i].id == socket.id){
    //     client_arrays.splice(i, 1);
    //   }
    // }
  });
});

