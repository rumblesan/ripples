
var Three = require('../lib/three.min');
var Plane = require('./plane');
var Ripple = require('./ripple');

var Wall = {};

Wall.createWall = function (xPoints, yPoints, tileSize) {

    var wall = {};

    var rippleState = {
        ripples: [],
        height: 1
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
        var ripple = Ripple.create(xPosition, yPosition);
        rippleState.ripples.push(ripple);
    };

    wall.animate = function (t) {


        var calcRipple = function (ripple, t, heights) {
            var x, y, o;
            for (x = 0; x < wall.points.xPoints; x += 1) {
                for (y = 0; y < wall.points.yPoints; y += 1) {
                    o = Ripple.calcOffset(ripple, t, x, y);
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
                    wall.points.p[x][y].setZ(heightMap[x][y] * rippleState.height);
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

        rippleState.ripples = Ripple.update(rippleState.ripples);

    };

    return wall;
};


module.exports = Wall;

