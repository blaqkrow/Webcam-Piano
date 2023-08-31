// https://kylemcdonald.github.io/cv-examples/
// Please note: this example uses an older version of P5js due to
// compatibility issues with the flow.js library

var capture;
var previousPixels;
var flow;
var step = 8;

////////////////////////////////////////////////////////
function setup() {
    createCanvas(640, 480);
    capture = createCapture(VIDEO);
    capture.hide();
    flow = new FlowCalculator(step);
}
////////////////////////////////////////////////////////
function same(a1, a2, stride, n) {
    for (var i = 0; i < n; i += stride) {
        if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}
////////////////////////////////////////////////////////
function draw() {
    capture.loadPixels();
//    if (previousPixels)

    if (capture.pixels.length > 0) {
        if (previousPixels) {
            previousPixels.loadPixels();
            // cheap way to ignore duplicate frames
            if (same(previousPixels.pixels, capture.pixels, 4, width)) {
                return;
            }
            // calculate optical flow
            flow.calculate(previousPixels.pixels, capture.pixels, capture.width, capture.height);
        }
        else previousPixels = createImage(capture.width, capture.height);

        previousPixels.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
        image(capture, 0, 0);

        // code to visualise optical flow
        var totalV=0, totalU=0, count=0;
        var threshold = 5;

        if (flow.flow && flow.flow.u != 0 && flow.flow.v != 0) {
            for (var i=0; i<flow.flow.zones.length; i++){
                zone = flow.flow.zones[i];

                if (abs(zone.u)>threshold || abs(zone.v)>threshold){ // only if movement is significant
                    stroke(map(zone.u, -step, +step, 0, 255),
                           map(zone.v, -step, +step, 0, 255), 128);
                    line(zone.x, zone.y, zone.x + zone.u, zone.y + zone.v);
                    totalU+=zone.u;
                    totalV+=zone.v;
                    count++;
                }
            }

            strokeWeight(2);
            stroke(255);
            translate(width/2, height/2);
            var lengthU = totalU/count*10;
            var lengthV = totalV/count*10;
            line(0, 0, lengthU, lengthV);
        }
    }
}
