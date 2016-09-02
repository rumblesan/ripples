
import App from './app';

(function () {

  const elem = document.getElementById('app');

  const app = App(window.innerWidth, window.innerHeight);

  elem.appendChild(app.domElement);

  app.domElement.addEventListener('click', function (e) {
    e.preventDefault();
    app.click(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
  });

  window.addEventListener( 'resize', function () {
    app.resize(window.innerWidth, window.innerHeight);
  }, false );

  app.render(0);

})();
