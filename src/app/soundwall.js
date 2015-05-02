/*global requestAnimationFrame */

var Three = require('../lib/three.min');

var Wall = require('./wall');
var Lights = require('./lights');
var Controls = require('./controls');

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

    var wall = Wall.createWall(20, 10, 35, false);
    scene.add(wall.mesh);

    var renderer = new Three.WebGLRenderer();
    renderer.setSize( sceneWidth, sceneHeight );

    scene.add(Lights.createDirectional(0xffaaff,1));

    scene.add(Lights.createAmbient(0x001100));

    var speed = 0.1;

    var render = function (t) {
        requestAnimationFrame(function () {
            render(t + speed);
        });
        renderer.render(scene, camera);
        wall.animate(t);
    };


    var raycaster = new Three.Raycaster();
    var mouse = new Three.Vector2();
    var click = function (xVal, yVal) {
        var xPos, yPos;
        mouse.x = xVal;
        mouse.y = yVal;
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( [wall.mesh] );
        if (intersects.length > 0) {
            xPos = intersects[0].face.a % wall.points.xPoints;
            yPos = intersects[0].face.a % wall.points.yPoints;
            wall.createRipple(-xPos, -yPos);
        }
    };

    return {
        click: click,
        renderer: renderer,
        scene: scene,
        camera: camera,
        render: render
    };

};

module.exports = {
    create: create
};

