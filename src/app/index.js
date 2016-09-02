/* global THREE */

import Wall from './wall';
import Audio from './audio';

export default (sceneWidth, sceneHeight) => {

  'use strict';

  const config = {
    cameraDistance: 200,
    tilesize: 5,
    sizeBuffer: 4,
    animationSpeed: 0.1
  };

  const audioSystem = Audio();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    sceneWidth / sceneHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, config.cameraDistance);
  const vFOV = camera.fov * Math.PI / 180;
  const height = 2 * Math.tan( vFOV / 2 ) * config.cameraDistance; // visible height
  const width = height * camera.aspect; // visible width


  const wallWidth = Math.ceil(width / config.tilesize) + config.sizeBuffer;
  const wallHeight = Math.ceil(height / config.tilesize) + config.sizeBuffer;

  const wall = Wall(wallWidth, wallHeight, config.tilesize);
  scene.add(wall.mesh);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( sceneWidth, sceneHeight );

  const mainLight = new THREE.DirectionalLight(0xbfaadd,0.5);
  mainLight.castShadow = true;
  mainLight.position.set(0, 0, 100);
  scene.add(mainLight);

  const render = (t) => {
    try {
      renderer.render(scene, camera);
      wall.animate(t);
      requestAnimationFrame(() => render(t + config.animationSpeed));
    } catch (e) {
      console.log('Seems there was an error');
      throw e;
    }
  };

  const raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  const click = function (xVal, yVal) {
    mouse.x = (xVal * 2) - 1;
    mouse.y = -(yVal * 2) + 1;
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( [wall.mesh] );
    if (intersects.length > 0) {
      let p = intersects[0].face.a;
      let xPos = Math.floor(p / wall.points.yPoints);
      let yPos = p % wall.points.yPoints;
      wall.createRipple(xPos, yPos);
      audioSystem.click(mouse.x, mouse.y);
    }
  };

  const resize = (newWidth, newHeight) => {
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( newWidth, newHeight );
  };

  return {
    click: click,
    resize: resize,
    domElement: renderer.domElement,
    render: render
  };

};
