
var Three = require('../lib/three.min');
var Plane = require('./plane');

var Wall = {};

Wall.createWall = function (xPoints, yPoints, tileSize) {

    var wall = {};

    var rippleState = {
        ripples: [],
        rippleRange: 20,
        height: 1,
        rippleDecay: 0.9,
        rippleCleanupThresh: 0.001,
        rippleHeightThresh: 0.001
    };

    wall.points = Plane.createPoints(xPoints, yPoints, tileSize);
    wall.geometry = Plane.createGeometry(wall.points);

    wall.material = new Three.MeshPhongMaterial({
        ambient: 0xff0000,
        color: 0x09BDE6,
        specular: 0x999966,
        shininess: 12,
        shading: Three.FlatShading
    });

    wall.mesh = new Three.Mesh(wall.geometry, wall.material);

    // create per face shadows
    wall.geometry.computeFaceNormals();
    // smooth shadows
    wall.geometry.computeVertexNormals();

    wall.mesh.translateX(-(xPoints * tileSize) / 2);
    wall.mesh.translateY(-(yPoints * tileSize) / 2);

    wall.createRipple = function (xPosition, yPosition) {

        var ripple = {
            energy: 1,
            xPos: xPosition,
            yPos: yPosition
        };

        rippleState.ripples.push(ripple);
    };

    wall.animate = function (t) {

        var calcOffset = function(ripple, t, x, y) {
            var distance = Math.sqrt(Math.pow((ripple.xPos - x), 2) + Math.pow((ripple.yPos - y), 2));
            var decay = Math.max(rippleState.rippleRange - distance, 0);
            var height = Math.sin(t - distance) * decay * rippleState.height * ripple.energy;
            return height;
        };

        var calcRipple = function (ripple, t, heights) {
            var x, y, o;
            for (x = 0; x < wall.points.xPoints; x += 1) {
                for (y = 0; y < wall.points.yPoints; y += 1) {
                    o = calcOffset(ripple, t, x, y);
                    heights[x][y] += o;
                }
            }
        };

        var genHeightMap = function () {
            var heightMap = [];
            var x, y;
            for (x = 0; x < wall.points.xPoints; x += 1) {
                heightMap[x] = [];
                for (y = 0; y < wall.points.yPoints; y += 1) {
                    heightMap[x][y] = 0;
                }
            }
            return heightMap;
        };

        var applyHeightMap = function (heightMap) {
            var x, y;
            for (x = 0; x < wall.points.xPoints; x += 1) {
                for (y = 0; y < wall.points.yPoints; y += 1) {
                    wall.points.p[x][y].setZ(heightMap[x][y]);
                }
            }
        };


        var heightMap = genHeightMap();
        var r;
        var i;
        for (i = 0; i < rippleState.ripples.length; i += 1) {
            r = rippleState.ripples[i];
            calcRipple(r, t, heightMap);
        }

        applyHeightMap(heightMap);
        wall.mesh.geometry.verticesNeedUpdate = true;
        wall.mesh.geometry.normalsNeedUpdate = true;
        wall.mesh.geometry.computeFaceNormals();

        var remainingRipples = [];
        for (i = 0; i < rippleState.ripples.length; i += 1) {
            r = rippleState.ripples[i];
            r.energy = r.energy * rippleState.rippleDecay;
            if (r.energy > rippleState.rippleCleanupThresh) {
                remainingRipples.push(r);
            }
        }
        rippleState.ripples = remainingRipples;

    };

    return wall;
};


module.exports = Wall;

