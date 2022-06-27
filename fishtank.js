var fishTank = [];

function setup() {
  createCanvas(600, 600);
  for (var i = 0; i < 50; ++i) {
    fishTank.push(new Fish(i));
  }
}

function Fish(i) {
  this.i = i;
  this.pos = createVector(random(width), random(height));
  this.size = random(20) + 10;
  this.dir = p5.Vector.random2D();
  return this;
}

Fish.prototype.draw = function () {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.dir.heading());
  beginShape();
  vertex(-this.size, this.size / 4);
  vertex(this.size / 4, -this.size / 3);
  vertex(this.size, 0);
  vertex(this.size / 4, this.size / 3);
  vertex(-this.size, -this.size / 4);
  endShape();
  pop();
};

Fish.prototype.move = function () {
  this.pos.add(this.dir);
  if (this.pos.x < 0) {
    this.pos.x += width;
  }
  if (this.pos.x > width) {
    this.pos.x -= width;
  }
  if (this.pos.y < 0) {
    this.pos.y += height;
  }
  if (this.pos.y > height) {
    this.pos.y -= height;
  }
};

// Find the nearest fish
Fish.prototype.findNeighbor = function () {
  var j;
  var d = width + height;
  for (var i in fishTank) {
    if (i != this.i) {
      var dd = p5.Vector.sub(this.pos, fishTank[i].pos).mag();
      if (dd < d) {
        j = i;
        d = dd;
      }
    }
  }
  return fishTank[j];
};

Fish.prototype.update = function () {
  this.dir.add(p5.Vector.random2D().mult(0.01));
  var that = this.findNeighbor();
  var dd = p5.Vector.sub(this.pos, that.pos).mag();
  // I don't want to stay too close
  if (dd < this.size + that.size) {
    this.dir.add(p5.Vector.sub(this.pos, that.pos).setMag(0.1));
  }
  // I want to move in the same direction
  this.dir.add(p5.Vector.sub(that.dir, this.dir).mult(0.1));
  // I don't like to stop
  if (this.dir.mag() < 0.2) {
    this.dir.mult(1.2);
  }
  // I don't like to run fast
  if (this.dir.mag() > 2) {
    this.dir.mult(0.8);
  }
  this.move();
};

function draw() {
  background(220);
  for (var i in fishTank) {
    fishTank[i].draw();
  }
  for (var i in fishTank) {
    fishTank[i].update();
  }
}
