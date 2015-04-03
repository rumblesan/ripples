/*jslint browser: true */
/*global require */

var domready = require('./lib/ready');
var App = require('./app/app');

domready(function () {

    document.body = document.createElement('body');

    console.log('app', app);

    var app = App(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

    console.log('App loaded');

    app.render();

});

