
var Teoria = require('teoria');
var Tone   = require('Tone');
var Drop = require('./synths');

var Audio = {};
var internal = {};

var config = (function () {
  return {
    dropVoices: 6,
    scaleNotes: 7,
    scale: Teoria.note('a4').scale('minor')
  };
})();

internal.getNote = function () {
  var n = Math.ceil(Math.random() * config.scaleNotes);
  return config.scale.get(n);
};

internal.getChord = function () {
  var n = Math.ceil(Math.random() * config.scaleNotes);
  var note = config.scale.get(n);
};

Audio.create = function () {

  var system = {};

  var state = {
    x: 0,
    y: 0
  };

  var dropSynth = new Tone.PolySynth(config.dropVoices, Drop);

  var delay = new Tone.FeedbackDelay('3n', 0.4);
  delay.set('wet', 0.3);

  var reverb = new Tone.Freeverb();

  var filter = new Tone.Filter(400, 'lowpass');

  var comp = new Tone.Compressor(-30, 2);

  var volume = new Tone.Volume(-10);

  dropSynth.chain(delay, reverb, filter, comp, volume, Tone.Master);

  system.click = function (xVal, yVal) {

    dropSynth.triggerAttackRelease(internal.getNote().fq(), '2n');

    state.x = xVal;
    state.y = yVal;

  };

  return system;
};

module.exports = Audio;

