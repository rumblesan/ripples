
var Thicket = require('thicket');
var Synths = require('./synths');
var Teoria = require('teoria');
var _ = require('underscore');

var Audio = {};
var internal = {};

Audio.createContext = function (w) {
    var context;
    try {
        // Fix up for prefixing
        w.AudioContext = w.AudioContext||w.webkitAudioContext;
        context = new w.AudioContext();
    } catch(e) {
        throw Error.create("WebAudio API not available");
    }
    return context;
};

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

internal.createDropVoices = function (thicket, output, dropVoices) {
    var state = {
        dropVoices: dropVoices,
        voiceNumber: 0,
        synths: []
    };

    var i, s;
    for (i = 0; i < state.dropVoices; i += 1) {
        s = thicket.Synth.create(Synths.drop);
        state.synths.push(s);
        thicket.Synth.connectSynthToInputs(output, 'fxinput', s, 'default');
    }

    return {
        play: function (length, parameterList) {
            thicket.Synth.play(
                state.synths[state.voiceNumber],
                length,
                parameterList
            );
            state.voiceNumber += 1;
            if (state.voiceNumber >= config.dropVoices) {
                state.voiceNumber = 0;
            }
        }
    };
};

Audio.create = function (audioCtx) {

    var system = {};

    var thicket = Thicket.createSystem(audioCtx);

    var state = {
        x: 0,
        y: 0
    };

    var masterOut = thicket.Effects.create(Synths.masterOut);
    thicket.Synth.connectToMasterOut(masterOut, 'default');

    var spaceFx = thicket.Effects.create(Synths.spaceFx);
    thicket.Synth.connectSynthToInputs(masterOut, 'master', spaceFx, 'default');

    var dropSynth = internal.createDropVoices(thicket, spaceFx, config.dropVoices);

    system.click = function (xVal, yVal) {

        dropSynth.play(
            1,
            ['freq', internal.getNote().fq()]
        );

        state.x = xVal;
        state.y = yVal;

    };

    return system;
};

module.exports = Audio;

