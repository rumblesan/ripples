/*global requestAnimationFrame */

var Three = require('../lib/three.min');

var Wall = require('./wall');

var create = function(sceneWidth, sceneHeight) {

    'use strict';

    var scene = new Three.Scene();
    var camera = new Three.PerspectiveCamera(
        75,
        sceneWidth / sceneHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 50);

    var wall = Wall.createWall(3, 3, 20, false);
    scene.add(wall.mesh);

    var renderer = new Three.WebGLRenderer();
    renderer.setSize( sceneWidth, sceneHeight );

    camera.lookAt(scene.position);

    var render = function () {
        requestAnimationFrame( render );

        renderer.render(scene, camera);
    };

    return {
        renderer: renderer,
        scene: scene,
        camera: camera,
        render: render
    };

};

module.exports = {
    create: create
};

