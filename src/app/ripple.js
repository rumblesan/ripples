
var Ripple = {};

var config = {
    sizeIncr: 0.5,
    widthIncr: 0.1,
    energyDecay: 0.95,
    cleanupThresh: 0.0001,
    startEnergy: 1,
    startWidth: 2,
    startSize: 0
};

Ripple.create = function (xPos, yPos) {
    var ripple = {
        energy: config.startEnergy,
        size: config.startSize,
        width: config.startWidth,
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

    var cellDistance = Math.sqrt(Math.pow((ripple.xPos - x), 2) + Math.pow((ripple.yPos - y), 2));
    var diffDistance = cellDistance - ripple.size;
    var decay = (Math.max(ripple.width - Math.abs(diffDistance), 0) / ripple.width);
    var heightVar = Math.sin(t - cellDistance) * decay * ripple.energy;

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

        r.energy = r.energy * config.energyDecay;
        r.size += config.sizeIncr;
        r.width += config.widthIncr;

        if (r.energy > config.cleanupThresh) {
            remainingRipples.push(r);
        }

    }
    return remainingRipples;
};

module.exports = Ripple;

