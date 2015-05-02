
var Three = require('../lib/three.min');

var Plane = {};

Plane.createPoints = function (xPoints, yPoints, tileSize) {

    var x, y, points;

    points = {};
    points.xPoints = xPoints;
    points.yPoints = yPoints;
    points.p = [];

    for (x = 0; x < xPoints; x += 1) {
        points.p[x] = [];
        for (y = 0; y < yPoints; y += 1) {
            points.p[x][y] = new Three.Vector3(
                x * tileSize,
                y * tileSize,
                0
            );
        }
    }

    return points;
};

Plane.createGeometry = function (points) {

    var geometry, x, y, triangles, t;

    geometry = new Three.Geometry();

    for (x = 0; x < points.xPoints; x += 1) {
        for (y = 0; y < points.yPoints; y += 1) {
            geometry.vertices.push(points.p[x][y]);
        }
    }

    triangles = [];

    var p1, p2, p3;
    // Don't want to iterate over last row/column
    // Also ordering of points is important
    for (x = 0; x < (points.xPoints -1); x += 1) {
        for (y = 0; y < (points.yPoints -1); y += 1) {
            p1 = y + ( x      * points.yPoints);
            p2 = y + ((x + 1) * points.yPoints);
            p3 = y + ((x + 1) * points.yPoints) + 1;
            triangles.push(new Three.Face3(p1, p2, p3));

            p1 = y + ( x      * points.yPoints);
            p2 = y + ((x + 1) * points.yPoints) + 1;
            p3 = y + ( x      * points.yPoints) + 1;
            triangles.push(new Three.Face3(p1, p2, p3));
        }
    }

    for (t = 0; t < triangles.length; t += 1) {
        geometry.faces.push(triangles[t]);
    }

    geometry.computeBoundingSphere();

    return geometry;

};

module.exports = Plane;

