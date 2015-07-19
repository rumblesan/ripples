
var AudioLogic = {};

AudioLogic.create = function (audioCtx) {

    var config = {
        intensity: {
            incr: 0.1,
            feedback: 0.98,
            timer: 100      // miliseconds
        }
    };


    var state = {};

    state.intensity = {
        value: 0,
        timer: setInterval(function () {
            state.intensity.value = (
                state.intensity.value * config.intensity.feedback
            );
        }, config.intensity.timer)
    };

    var beatTimer;
    beatTimer = function () {
        state.beats.timer = setTimeout(beatTimer, state.beats.time);
        console.log('setting beat timer', state.beats.time);
    };

    state.beats = {
        lastClickTime: audioCtx.currentTime,
        last4Times: [1000, 1000, 1000, 1000],
        time: 1000,
        timer: null
    };
    beatTimer(); // setup beatTimer loop

    var calcBeatTimes = function () {
        var current = audioCtx.currentTime;
        var diff = current - state.beats.lastClickTime;
        state.beats.lastClickTime = current;
        var last4 = state.beats.last4Times;
        last4[3] = last4[2];
        last4[2] = last4[1];
        last4[1] = last4[0];
        last4[0] = diff;
        state.beats.time = Math.min(
            (last4[0] + last4[1] + last4[2] + last4[3]) / 4,
            1000
        );
    };

    var logic = {};

    logic.click = function () {
        state.intensity.value += config.intensity.incr;
        console.log('new intensity', state.intensity.value);
        calcBeatTimes();
    };

    return logic;
};

module.exports = AudioLogic;

