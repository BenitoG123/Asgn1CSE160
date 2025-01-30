// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  //Global Variables
  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_Size;
  let u_Alpha;

function setupWebGL() {
  //retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }
  
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Globals related UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_selectedAlpha = 1.0;

function addActionsForHtmlUI(){

  //button events (shape type)
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  document.getElementById('imgButton').onclick = makeImg;

  //Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  document.getElementById('segSlide').addEventListener('mouseup', function() { segments = this.value; });
  
  //Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('alphaSlide').addEventListener('mouseup', function() { g_selectedAlpha = (this.value/100); });
}

function makeImg() {
  console.log("makeImg");
  g_shapesList = []; 
  renderAllShapes();

  //background

  let back1;
  back1 = new Point();
  back1.position = [0,0.25];
  back1.color = [0.0, 0.0, 0.5, 1.0];
  back1.size = 400;
  back1.segments = 10;
  g_shapesList.push(back1);

  let back2;
  back2 = new Point();
  back2.position = [0,-1.75];
  back2.color = [0.9, 0.9, 0.9, 1.0];
  back2.size = 400;
  back2.segments = 10;
  g_shapesList.push(back2);


  //Create and store the new point
  let body1;
  body1 = new Circle();
  body1.position = [0,0.3];
  body1.color = [0.9, 0.9, 0.9, 1.0];
  body1.size = 30;
  body1.segments = 10;
  g_shapesList.push(body1);

  let body2;
  body2 = new Circle();
  body2.position = [0,-0.05];
  body2.color = [0.9, 0.9, 0.9, 1.0];
  body2.size = 50;
  body2.segments = 10;
  g_shapesList.push(body2);

  let body3;
  body3 = new Circle();
  body3.position = [0,-0.5];
  body3.color = [0.9, 0.9, 0.9, 1.0];
  body3.size = 70;
  body3.segments = 10;
  g_shapesList.push(body3);



  //Hat

  let hat1;
  hat1 = new Point();
  hat1.position = [0,0.60];
  hat1.color = [0.0, 0.0, 0.0, 1.0];
  hat1.size = 50;
  hat1.segments = 10;
  g_shapesList.push(hat1);

  let hat2;
  hat2 = new Point();
  hat2.position = [0,0.45];
  hat2.color = [0.0, 0.0, 0.0, 1.0];
  hat2.size = 30;
  hat2.segments = 10;
  g_shapesList.push(hat2);

  let hat3;
  hat3 = new Point();
  hat3.position = [-0.15,0.45];
  hat3.color = [0.0, 0.0, 0.0, 1.0];
  hat3.size = 30;
  hat3.segments = 10;
  g_shapesList.push(hat3);

  let hat4;
  hat4 = new Point();
  hat4.position = [0.15,0.45];
  hat4.color = [0.0, 0.0, 0.0, 1.0];
  hat4.size = 30;
  hat4.segments = 10;
  g_shapesList.push(hat4);


  //eyes
  let eye1;
  eye1 = new Point();
  eye1.position = [-0.06,0.30];
  eye1.color = [0.0, 0.0, 0.0, 1.0];
  eye1.size = 10;
  eye1.segments = 10;
  g_shapesList.push(eye1);

  let eye2;
  eye2 = new Point();
  eye2.position = [0.06,0.30];
  eye2.color = [0.0, 0.0, 0.0, 1.0];
  eye2.size = 10;
  eye2.segments = 10;
  g_shapesList.push(eye2);

  //buttons
  let button1;
  button1 = new Point();
  button1.position = [0.0,0.075];
  button1.color = [0.0, 0.0, 0.0, 1.0];
  button1.size = 10;
  button1.segments = 10;
  g_shapesList.push(button1);

  let button2;
  button2 = new Point();
  button2.position = [0.0,-0.01];
  button2.color = [0.0, 0.0, 0.0, 1.0];
  button2.size = 10;
  button2.segments = 10;
  g_shapesList.push(button2);

  let button3;
  button3 = new Point();
  button3.position = [0.0,-0.10];
  button3.color = [0.0, 0.0, 0.0, 1.0];
  button3.size = 10;
  button3.segments = 10;
  g_shapesList.push(button3);

  //snow
  let snow1;
  snow1 = new Circle();
  snow1.position = [-0.7,0.75];
  snow1.color = [0.9, 0.9, 0.9, 1.0];
  snow1.size = 7;
  snow1.segments = 30;
  g_shapesList.push(snow1);

  let snow2;
  snow2 = new Circle();
  snow2.position = [-0.45,0.45];
  snow2.color = [0.9, 0.9, 0.9, 1.0];
  snow2.size = 7;
  snow2.segments = 30;
  g_shapesList.push(snow2);

  let snow3;
  snow3 = new Circle();
  snow3.position = [-0.85,0.1];
  snow3.color = [0.9, 0.9, 0.9, 1.0];
  snow3.size = 7;
  snow3.segments = 30;
  g_shapesList.push(snow3);

  let snow4;
  snow4 = new Circle();
  snow4.position = [-0.6,-0.3];
  snow4.color = [0.9, 0.9, 0.9, 1.0];
  snow4.size = 7;
  snow4.segments = 30;
  g_shapesList.push(snow4);

  let snow5;
  snow5 = new Circle();
  snow5.position = [0.85,0.8];
  snow5.color = [0.9, 0.9, 0.9, 1.0];
  snow5.size = 7;
  snow5.segments = 30;
  g_shapesList.push(snow5);

  let snow6;
  snow6 = new Circle();
  snow6.position = [0.5,0.6];
  snow6.color = [0.9, 0.9, 0.9, 1.0];
  snow6.size = 7;
  snow6.segments = 30;
  g_shapesList.push(snow6);

  let snow7;
  snow7 = new Circle();
  snow7.position = [0.75,0.0];
  snow7.color = [0.9, 0.9, 0.9, 1.0];
  snow7.size = 7;
  snow7.segments = 30;
  g_shapesList.push(snow7);

  let snow8;
  snow8 = new Circle();
  snow8.position = [0.5,-0.5];
  snow8.color = [0.9, 0.9, 0.9, 1.0];
  snow8.size = 7;
  snow8.segments = 30;
  g_shapesList.push(snow8);

  //Draw every shape
  renderAllShapes();

}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  //set up actions for HTML UI elements
  addActionsForHtmlUI();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}



//extrant the event click and return it in webgl coordinates
function convertCorrdinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {

  //check the time at the start of this function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //draw each shape in the list
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  //check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

var g_shapesList = [];
var segments = 5;

function click(ev) {

  //extract the event click and return it in WebGL coordinates
  [x,y] = convertCorrdinatesEventToGL(ev);

  //Create and store the new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle(segments);
    //console.log("circle class");
  }
  
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.alpha = g_selectedAlpha;
  g_shapesList.push(point);

  //g_shapesList.push(point);

  //Draw every shape
  renderAllShapes();

}
