import { Ripples } from 'app/ripples';

import 'index.html';
import 'images/favicon.ico';
import 'style/style.css';

const app = Ripples(window.innerWidth, window.innerHeight);

document.body.appendChild(app.domElement);

app.domElement.addEventListener('click', function (e) {
  e.preventDefault();
  app.click(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
});

window.addEventListener(
  'resize',
  function () {
    app.resize(window.innerWidth, window.innerHeight);
  },
  false
);

app.render(0);
