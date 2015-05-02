
var Three = require('../lib/three.min');

var Wall = {};

Wall.createWall = function (xPoints, yPoints, tileSize) {

    var wall = {};
    var midXPoint = ((xPoints - 1)/2) * tileSize;
    var midYPoint = ((yPoints - 1)/2) * tileSize;

    wall.points = Wall.createPoints(xPoints, yPoints, tileSize);
    wall.geometry = Wall.createGeometry(wall.points);

    wall.material = new Three.MeshBasicMaterial( { color: 0xFF0000 } );

    wall.mesh = new Three.Mesh(wall.geometry, wall.material);

    var rotAxis = new Three.Vector3(0,1,0);
    Wall.rotate(wall.mesh, rotAxis, Math.PI);

    wall.mesh.translateX(-midXPoint);
    wall.mesh.translateY(-midYPoint);

    return wall;
};

Wall.rotate = function (mesh, axis, radians) {

   var rotWorldMatrix = new Three.Matrix4();
   rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
   rotWorldMatrix.multiply(mesh.matrix);

   mesh.matrix = rotWorldMatrix;

   mesh.rotation.setFromRotationMatrix(mesh.matrix);

};

Wall.createPoints = function (xPoints, yPoints, tileSize) {

    var x, y, points, offsetX, offsetZ;

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

/* create a vertical wall */
Wall.createGeometry = function (points) {

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
            p2 = y + ( x      * points.yPoints) + 1;
            p3 = y + ((x + 1) * points.yPoints);
            triangles.push(new Three.Face3(p1, p2, p3));

            p1 = y + ( x      * points.yPoints) + 1;
            p2 = y + ((x + 1) * points.yPoints) + 1;
            p3 = y + ((x + 1) * points.yPoints);
            triangles.push(new Three.Face3(p1, p2, p3));
        }
    }

    for (t = 0; t < triangles.length; t += 1) {
        geometry.faces.push(triangles[t]);
    }

    geometry.computeBoundingSphere();

    return geometry;

};

module.exports = Wall;

