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
    camera.position.set(0, 0, 200);

    var wall = Wall.createWall(250, 130, 5, false);
    scene.add(wall.mesh);

    var renderer = new Three.WebGLRenderer();
    renderer.setSize( sceneWidth, sceneHeight );


    var speed = 0.01;

    var render = function (t) {
        requestAnimationFrame(function () {
            render(t + speed);
        });
        renderer.render(scene, camera);
        wall.animate(t);
    };

    wall.createRipple(7, 14);

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

