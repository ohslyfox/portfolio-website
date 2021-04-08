var LAYERS = 15;
var COUNT = 5;
var GAP = 40;
var countSize = 0;
var PI_2 = 2 * Math.PI;
var PI_10 = Math.PI / 10;
var PI_75 = Math.PI / 75;
var PI_300 = Math.PI / 300;
var particles = [];
var currentPattern = 0;
var patterns = [[255, 255, 120, 120, 120, 255],
                [120, 255, 255, 255, 120, 120],
                [120, 120, 120, 255, 255, 255]];
var currentColor = [patterns[0][0], patterns[1][0], patterns[2][0]];


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    for (var i = 0; i < LAYERS; i++) {
        for (var j = 0; j < COUNT; j++) {
            particles.push(new Particle((i * PI_10) + j * (PI_2 / COUNT), (i+2) * GAP));
        }
    }
}

function draw() {
    clear();
    stepColor();
    translate(width / 2, height/2);
    var c = 0;
    for (var i = 0; i < LAYERS; i++) {
        for (var j = 0; j < COUNT; j++) {
            var particle = particles[c++];
            particle.move();
            particle.display(i);
        }
    }
    countSize += PI_75;
}

function stepColor()
{
    if (currentColor[0] == patterns[0][currentPattern] &&
        currentColor[1] == patterns[1][currentPattern] &&
        currentColor[2] == patterns[2][currentPattern]) {
        currentPattern = (currentPattern + 1) % 6;
    }
    for (var i = 0; i < 3; i++) {
        if (currentColor[i] < patterns[i][currentPattern]) {
            currentColor[i]++;
        }
        else if (currentColor[i] > patterns[i][currentPattern])
        {
            currentColor[i]--;
        }
    }
}

class Particle {
    constructor(t, r) {
        this.theta = t;
        this.radius = r;
    }

    move() {
        this.theta -= PI_300;
    }

    display(particle) {
        var size = 2 + (Math.sin((particle + countSize) * 0.5) + 1.2)*8;
        noStroke();
        fill(currentColor[0], currentColor[1], currentColor[2]);
        ellipse(this.radius * Math.cos(this.theta), this.radius * Math.sin(this.theta), size, size);
    }
}