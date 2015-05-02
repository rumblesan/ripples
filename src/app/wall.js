
var Three = require('../lib/three.min');

var Wall = {};

Wall.createWall = function (xPoints, yPoints, tileSize) {

    var wall = {};

    var rippleState = {
        ripples: [],
        rippleRange: 10,
        height: 10,
        rippleDecay: 0.999,
        rippleCleanupThresh: 0.01
    };

    var midXPoint = ((xPoints - 1)/2) * tileSize;
    var midYPoint = ((yPoints - 1)/2) * tileSize;

    wall.points = Wall.createPoints(xPoints, yPoints, tileSize);
    wall.geometry = Wall.createGeometry(wall.points);

    wall.material = new Three.MeshBasicMaterial( { color: 0xFF0000, wireframe: true } );

    wall.mesh = new Three.Mesh(wall.geometry, wall.material);

    var rotAxis = new Three.Vector3(0,1,0);
    //Wall.rotate(wall.mesh, rotAxis, Math.PI);
    wall.mesh.translateX(-midXPoint);
    wall.mesh.translateY(-midYPoint);

    // create per face shadows
    wall.geometry.computeFaceNormals();
    // smooth shadows
    wall.geometry.computeVertexNormals();


    wall.createRipple = function (xPosition, yPosition) {

        var ripple = {
            energy: 10,
            xPos: xPosition,
            yPos: yPosition
        };

        rippleState.ripples.push(ripple);
    };

    wall.animate = function (t) {

        var calcOffset = function(ripple, t, x, y) {
            var distance = Math.sqrt(Math.pow((ripple.xPos - x), 2) + Math.pow((ripple.yPos - y), 2));
            var decay = rippleState.rippleRange / distance;
            var height = Math.sin(-t - distance) * decay * rippleState.height;
            return height;
        };

        var calcRipple = function (ripple, t) {
            var x, y, o;
            for (x = 0; x < wall.points.xPoints; x += 1) {
                for (y = 0; y < wall.points.yPoints; y += 1) {
                    o = calcOffset(ripple, t, x, y);
                    wall.points.p[x][y].setZ(o);
                }
            }
        };

        var r;
        var i;
        for (i = 0; i < rippleState.ripples.length; i += 1) {
            r = rippleState.ripples[i];
            calcRipple(r, t);
            wall.mesh.geometry.verticesNeedUpdate = true;
            wall.mesh.geometry.normalsNeedUpdate = true;
            wall.mesh.geometry.computeFaceNormals();
        }

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

