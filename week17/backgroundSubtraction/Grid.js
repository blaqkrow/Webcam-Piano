class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // initalise grid structure and state
    for (var x = 0; x < _w; x += this.noteSize) {
      var posColumn = [];
      var stateColumn = [];
      for (var y = 0; y < _h; y += this.noteSize) {
        posColumn.push(
          createVector(x + this.noteSize / 2, y + this.noteSize / 2)
        );
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img) {
    // Draw active notes with secondary graphics effects
    noStroke();
    for (var i = 0; i < this.notePos.length; i++) {
      for (var j = 0; j < this.notePos[i].length; j++) {
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        var state = this.noteState[i][j];

        // Customized effects based on noteState
        if (state > 0) {
          var alpha = state * 200;
          var c1 = color(255, 0, 0, alpha);
          var c2 = color(0, 255, 0, alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);

          // Apply different graphics/effects based on noteState
          if (state > 0.5) {
            // Primary effect: Draw ellipses
            ellipse(x, y, this.noteSize * state, this.noteSize * state);

            // Secondary effect: Trigger sometimes using noise and randomness
            if (noise(i * 0.1, j * 0.1) > 0.5 && random(1) > 0.8) {
              strokeWeight(2);
              stroke(255);
              line(x - 20, y - 20, x + 20, y + 20);
              line(x + 20, y - 20, x - 20, y + 20);
            }
          } else {
            // Primary effect: Draw rectangles
            rectMode(CENTER);
            rect(x, y, this.noteSize * state * 2, this.noteSize * state * 2);

            // Secondary effect: Trigger sometimes using noise and randomness
            if (noise(i * 0.1, j * 0.1) > 0.5 && random(1) > 0.8) {
              fill(0, alpha);
              ellipse(
                x,
                y,
                this.noteSize * state * 1.5,
                this.noteSize * state * 1.5
              );
            }
          }
        }

        // Update noteState
        this.noteState[i][j] -= 0.05;
        this.noteState[i][j] = constrain(this.noteState[i][j], 0, 1);
      }
    }
  }

  /////////////////////////////////
  findActiveNotes(img) {
    for (var x = 0; x < img.width; x += 1) {
      for (var y = 0; y < img.height; y += 1) {
        var index = (x + y * img.width) * 4;
        var state = img.pixels[index + 0];
        if (state == 0) {
          // if pixel is black (ie there is movement)
          // find which note to activate
          var screenX = map(x, 0, img.width, 0, this.gridWidth);
          var screenY = map(y, 0, img.height, 0, this.gridHeight);
          var i = int(screenX / this.noteSize);
          var j = int(screenY / this.noteSize);
          this.noteState[i][j] = 1;
        }
      }
    }
  }
}
