
var Teoria = require('teoria');
var Tone   = require('Tone');

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

    var volume = new Tone.Volume(-24);

    var spaceFx = new Tone.Freeverb();

    var dropSynth = new Tone.PolySynth(config.dropVoices, Tone.Synth);

    dropSynth.chain(spaceFx, volume, Tone.Master);

    system.click = function (xVal, yVal) {

        dropSynth.triggerAttackRelease(internal.getNote().fq(), '2n');

        state.x = xVal;
        state.y = yVal;

    };

    return system;
};

module.exports = Audio;

