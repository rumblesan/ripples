/* @flow */

var domready = require('./lib/ready');
var App = require('./app/starter');

domready(function () {

    document.body = document.createElement('body');

    var app = App.create(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

    console.log('App loaded');

    app.render();

});

