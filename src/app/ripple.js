
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

Ripple.calcOffset = function(ripple, t, x, y) {
    var distance = Math.sqrt(Math.pow((ripple.xPos - x), 2) + Math.pow((ripple.yPos - y), 2));
    var decay = Math.max(rippleState.rippleMaxRange - distance, 0);
    var heightVar = Math.sin(t - distance) * decay * ripple.energy;
    return heightVar;
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

