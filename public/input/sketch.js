let socket = io("/input");

//HUGE THANKS to Jiashan Wu, https://github.com/OhJia/p5MobileWebExamples

//listen for the confirmation of connection
socket.on("connect", function() {
  console.log("connected to server");
});

// try{
//   let sensor = new AbsoluteOrientationSensor();
//   console.log(sensor);
// }
// catch(error) {
//   console.error(error);
// }

// const sensor = new AbsoluteOrientationSensor();
const options = { frequency: 60, referenceFrame: 'device' };
const sensor = new AbsoluteOrientationSensor(options);

Promise.all([navigator.permissions.query({ name: "accelerometer" }),
             navigator.permissions.query({ name: "magnetometer" }),
             navigator.permissions.query({ name: "gyroscope" })])
       .then(results => {
             if (results.every(result => result.state === "granted")) {
               sensor.start();
               console.log('whaha');
               console.log(sensor);
               socket.emit("all good");
             } else {
               console.log("No permissions to use AbsoluteOrientationSensor.");
             }
       });

sensor.addEventListener('reading', () => {
  // model is a Three.js object instantiated elsewhere.
  // model.quaternion.fromArray(sensor.quaternion).inverse();
  qX = sensor.quaternion[0];
  qY = sensor.quaternion[1];
  qZ = sensor.quaternion[2];
  qW = sensor.quaternion[3];

  let quat = {
    0: sensor.quaternion[0],
    1: sensor.quaternion[1],
    2: sensor.quaternion[2],
    3: sensor.quaternion[3]
  }
  socket.emit('reading', quat);
});
sensor.addEventListener('error', error => {
  if (event.error.name == 'NotReadableError') {
    console.log("Sensor is not available.");
  }
});
sensor.start();

let qX = " ";
let qY = " ";
let qZ = " "
let qW = " ";

function setup(){
  createCanvas(windowWidth, windowHeight);
  background(0);
  textSize(38);
  fill(255);
}

function draw(){
  background(0);
  text("qX: " + qX, width/4, height/5);
  text("qY: " + qY, width/4, 2*height/5);
  text("qZ: " + qZ, width/4, 3*height/5);
  text("qW: " + qW, width/4, 4*height/5);

}