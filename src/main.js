
import SoundWall from './app/soundwall';

(function () {

  const app = document.getElementById('app');

  const soundwall = SoundWall(window.innerWidth, window.innerHeight);

  app.appendChild(soundwall.domElement);

  soundwall.domElement.addEventListener('click', function (e) {
    e.preventDefault();
    soundwall.click(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
  });

  window.addEventListener( 'resize', function () {
    soundwall.resize(window.innerWidth, window.innerHeight);
  }, false );

  soundwall.render(0);

})();
