
var Ripple = {};

var rippleState = {
    ripples: [],
    rippleMaxRange: 20,
    rippleRange: 0,
    rippleRangeIncr: 0.4,
    rippleDecay: 0.9,
    rippleCleanupThresh: 0.001,
    rippleHeightThresh: 0.001
};

Ripple.create = function (xPos, yPos) {
    var ripple = {
        energy: 1,
        xPos: xPos,
        yPos: yPos
    };
    return ripple;
};

Ripple.genHeightMap = function (xPoints, yPoints) {
    var heightMap = {
        x: xPoints,
        y: yPoints,
        heights: []
    };
    var x, y;
    for (x = 0; x < heightMap.x; x += 1) {
        heightMap.heights[x] = [];
        for (y = 0; y < heightMap.y; y += 1) {
            heightMap.heights[x][y] = 0;
        }
    }
    return heightMap;
};

Ripple.calcOffset = function(ripple, t, x, y) {
    var distance = Math.sqrt(Math.pow((ripple.xPos - x), 2) + Math.pow((ripple.yPos - y), 2));
    var decay = Math.max(rippleState.rippleMaxRange - distance, 0);
    var heightVar = Math.sin(t - distance) * decay * ripple.energy;
    return heightVar;
};

Ripple.applyRipple = function (ripple, t, heightMap) {
    var x, y, o;
    for (x = 0; x < heightMap.x; x += 1) {
        for (y = 0; y < heightMap.y; y += 1) {
            o = Ripple.calcOffset(ripple, t, x, y);
            heightMap.heights[x][y] += o;
        }
    }
};

Ripple.update = function (ripples) {
    var remainingRipples = [];
    var r, i;
    for (i = 0; i < ripples.length; i += 1) {
        r = ripples[i];
        r.energy = r.energy * rippleState.rippleDecay;
        if (r.energy > rippleState.rippleCleanupThresh) {
            remainingRipples.push(r);
        }
    }
    return remainingRipples;
};

module.exports = Ripple;

