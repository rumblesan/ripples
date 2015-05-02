/*jslint browser: true */

var domready = require('./lib/ready');
var SoundWall = require('./app/soundwall');

domready(function () {

    document.body = document.createElement('body');

    var app = SoundWall.create(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

    app.renderer.domElement.addEventListener('click', function (e) {
        e.preventDefault();
        app.click(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    });

    window.addEventListener( 'resize', function () {
        app.resize(window.innerWidth, window.innerHeight);
    }, false );

    app.render(0);

});

