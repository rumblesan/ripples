/*jslint browser: true */

var domready = require('./lib/ready');
var SoundWall = require('./app/soundwall');

domready(function () {

    document.body = document.createElement('body');

    var app = SoundWall.create(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

    console.log('App loaded');

    app.render(0);

});

