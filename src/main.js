/*jslint browser: true */

var domready = require('./lib/ready');
var SoundWall = require('./app/soundwall');

domready(function () {

    document.body = document.createElement('body');

    var app = SoundWall.create(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

    app.renderer.domElement.addEventListener('click', function (e) {
        app.click(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    });

    app.render(0);

});

