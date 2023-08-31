var video;
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(640, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();
    noStroke();
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(0);
    image(video, 0, 0);
    video.loadPixels();

    // set the "world record" to an impossible brightness
    // so that it's easy for the first pixel to beat.
    var worldRecord = 0;

    // XY coordinate of closest color
    var recordX = 0;
    var recordY = 0;

    for (var x = 0; x < video.width; x += 1) {
        for (var y = 0; y < video.height; y += 1) {
            var index = (x + (y * video.width)) * 4;
            var r = video.pixels[index + 0];
            var g = video.pixels[index + 1];
            var b = video.pixels[index + 2];

            // var bright = brightness(color(r,g,b)); // slow!!!
            var bright = (r+g+b)/3;

            if (bright > worldRecord) {
                worldRecord = bright;
                recordX = x;
                recordY = y;
            }
        }
    }

    fill(255);
    strokeWeight(4);
    stroke(0);
    ellipse(recordX, recordY, 16, 16);
}
