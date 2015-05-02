
var Three = require('../lib/three.min');
var Plane = require('./plane');
var Ripple = require('./ripple');

var Wall = {};
var internal = {};

Wall.createWall = function (xPoints, yPoints, tileSize) {

    var wall = {};

    var rippleState = {
        ripples: [],
        height: 3
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

        var heightMap = Ripple.genHeightMap(wall.points.xPoints, wall.points.yPoints);
        var r, i;
        for (i = 0; i < rippleState.ripples.length; i += 1) {
            r = rippleState.ripples[i];
            Ripple.applyRipple(r, t, heightMap);
        }

        internal.applyHeightMap(wall, rippleState.height, heightMap);
        wall.mesh.geometry.verticesNeedUpdate = true;
        wall.mesh.geometry.normalsNeedUpdate = true;
        wall.mesh.geometry.computeFaceNormals();

        rippleState.ripples = Ripple.update(rippleState.ripples);

    };

    return wall;
};

internal.applyHeightMap = function (wall, rippleHeight, heightMap) {
    var x, y;
    for (x = 0; x < heightMap.x; x += 1) {
        for (y = 0; y < heightMap.y; y += 1) {
            wall.points.p[x][y].setZ(heightMap.heights[x][y] * rippleHeight);
        }
    }
};


module.exports = Wall;

