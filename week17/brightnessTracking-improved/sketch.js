var video;
var threshold=200;
var thresholdSlider;
////////////////////////////////////////////////////////////
function setup() {
    createCanvas(640, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();
    noStroke();

    thresholdSlider = createSlider(0, 255, 200);
    thresholdSlider.position(20, 20);
}
////////////////////////////////////////////////////////////
function draw() {
    background(0);
    image(video, 0, 0);

    threshold = thresholdSlider.value();

    video.loadPixels();

    // XY coordinate of closest match
    var sumX=0, sumY=0, avgX=0, avgY = 0;
    var matchCount=0;

    for (var x = 0; x < video.width; x += 1) {
        for (var y = 0; y < video.height; y += 1) {
            var index = (x + (y * video.width)) * 4;
            var r = video.pixels[index + 0];
            var g = video.pixels[index + 1];
            var b = video.pixels[index + 2];

            // var bright = brightness(color(r,g,b)); // slow!!!
            var bright = (r+g+b)/3;

            if (bright > threshold) {
                sumX += x;
                sumY += y;
                matchCount++;
            }
        }
    }

    if (matchCount>0){
        avgX = sumX / matchCount;
        avgY = sumY / matchCount;
    }

    fill(255);
    strokeWeight(4);
    stroke(0);
    ellipse(avgX, avgY, 16, 16);
    stroke(255);
    strokeWeight(1);
    text(threshold, 160, 35);
}
