var video;
var redTarget, greenTarget, blueTarget;
var threshold;
var thresholdSlider;
var button;
var debug = false;
///////////////////////////////////////////////////////////////
function setup() {
    createCanvas(640, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    button = createButton('debug mode');
    button.position(20, 50);
    button.mousePressed(flipDebugMode);

    redTarget = 255;
    greenTarget = 0;
    blueTarget = 0;
}
///////////////////////////////////////////////////////////////
function draw() {
    background(0);
    image(video, 0, 0);
    video.loadPixels();

    threshold = thresholdSlider.value();

    // XY coordinate of closest match
    var sumX=0, sumY=0, avgX=0, avgY = 0;
    var matchCount=0;

    for (var x = 0; x < video.width; x += 1) {
        for (var y = 0; y < video.height; y += 1) {
            var index = (x + (y * video.width)) * 4;
            var redSource = video.pixels[index + 0];
            var greenSource = video.pixels[index + 1];
            var blueSource = video.pixels[index + 2];

            var d = dist(redSource, greenSource, blueSource, redTarget, greenTarget, blueTarget);

            if (d < threshold) {
                sumX += x;
                sumY += y;
                matchCount++;

                if (debug){ // shows matches in fuchsia
                  video.pixels[index + 0] = 255;
                  video.pixels[index + 1] = 0;
                  video.pixels[index + 2] = 255;
                }
            }
        }
    }

    if (matchCount>0){
        avgX = sumX / matchCount;
        avgY = sumY / matchCount;
    }

    if (debug) video.updatePixels();

    fill(255);
    strokeWeight(4);
    stroke(255,0,0);
    ellipse(avgX, avgY, 16, 16);
    strokeWeight(1);
    noFill();
    stroke(255);
    text(threshold, 160, 35);
}
///////////////////////////////////////////////////////////////
// save target color when key is pressed
function keyPressed() {
    var c = video.get(mouseX, mouseY);
    redTarget = red(c);
    greenTarget = green(c);
    blueTarget = blue(c);
}
///////////////////////////////////////////////////////////////
// toggle debug mode
function flipDebugMode() {
  debug = !debug;
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
