
var Thicket = require('thicket');
var Synths = require('./synths');

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

var config = {
    dropVoices: 6,
    frequencies: [
        440, 493.883, 523.251, 587.330, 659.255, 698.456, 783.991, 880
    ]
};

internal.getNote = function () {
    var n = Math.floor(Math.random() * config.frequencies.length);
    return config.frequencies[n];
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
            ['freq', internal.getNote()]
        );

        state.x = xVal;
        state.y = yVal;

    };

    return system;
};

module.exports = Audio;

