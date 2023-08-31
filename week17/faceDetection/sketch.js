// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

// PLEASE NOTE: Due to compatibility issues with the face detection library
// this example uses an older version of the P5js library

var w = 160,
    h = 120;
var detector;
var classifier = objectdetect.frontalface;
var img;
var faces;
////////////////////////////////////////////////////////////////
function setup() {
  createCanvas(w, h);
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  var scaleFactor = 1.2;
  detector = new objectdetect.detector(w, h, scaleFactor, classifier);
  faceImg = createImage(w, h);
}
///////////////////////////////////////////////////////////////
function draw() {
    image(capture, 0, 0, w, h);

    faceImg.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
    faces = detector.detect(faceImg.canvas);

    strokeWeight(2);
    stroke(255);
    noFill();

    for (var i=0; i<faces.length; i++){
        var face=faces[i];
        if (face[4] > 4){
            rect(face[0], face[1], face[2], face[3]);
        }
    }
}
