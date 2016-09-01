
var SoundWall = require('./app/soundwall');
var Audio = require('./app/audio');

(function () {

    var app = document.getElementById('app');

    var audioCtx = Audio.createContext(window);

    var soundwall = SoundWall.create(window.innerWidth, window.innerHeight, audioCtx);

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
