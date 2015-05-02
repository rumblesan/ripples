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
    var cameraDist = 200;
    camera.position.set(0, 0, cameraDist);
    var vFOV = camera.fov * Math.PI / 180;
    var height = 2 * Math.tan( vFOV / 2 ) * cameraDist; // visible height

    var aspect = sceneWidth / sceneHeight;
    var width = height * aspect; 
    console.log(height, width);


    var tilesize = 5;
    var wallWidth = Math.ceil(width / tilesize) + 4;
    var wallHeight = Math.ceil(height / tilesize) + 4;
    var wall = Wall.createWall(wallWidth, wallHeight, tilesize);
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
        var xPos, yPos, p;
        mouse.x = (xVal * 2) - 1;
        mouse.y = -(yVal * 2) + 1;
        console.log(mouse);
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( [wall.mesh] );
        console.log(intersects);
        if (intersects.length > 0) {
            p = intersects[0].face.a;
            xPos = Math.floor(p / wall.points.yPoints);
            yPos = p % wall.points.yPoints;
            wall.createRipple(xPos, yPos);
            console.log(xPos, yPos);
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

