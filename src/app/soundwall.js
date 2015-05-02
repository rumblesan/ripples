/* @flow */

var THREE = require('../lib/three.min');

var create = function(sceneWidth: number, sceneHeight: number): AppObj {

    'use strict';

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        75,
        sceneWidth / sceneHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

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

