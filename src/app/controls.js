
var Three = require('../lib/three.min');

var Controls = {};

Controls.getMousePosition = function (clientX, clientY, camera) {

    var vector = new Three.Vector3();

    vector.set((clientX * 2) - 1, -(clientY * 2) + 1, 0.5);

    vector.unproject( camera );

    var dir = vector.sub( camera.position ).normalize();

    var distance = - camera.position.z / dir.z;

    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    return pos;

};


module.exports = Controls;

