
var Thicket = require('thicket');

var Constant   = Thicket.AST.Contsant;   // value
var Input      = Thicket.AST.Input;      // name
var Param      = Thicket.AST.Param;      // name, value
var Mix        = Thicket.AST.Mix;        // multiple args
var Multiply   = Thicket.AST.Multiply;   // source, factor
var AREnvelope = Thicket.AST.AREnvelope; // attack, decay
var Oscillator = Thicket.AST.Oscillator; // frequency, waveshape
var Noise      = Thicket.AST.Noise;      // noiseType
var Filter     = Thicket.AST.Filter;     // source, type, frequency, resonance
var Delay      = Thicket.AST.Delay;      // source, delayTime, delayMax, feedback
var Compressor = Thicket.AST.Compressor; // source, threshold, ratio, knee, reduction, attack, release
var Amp        = Thicket.AST.Amp;        // source, volume


var Synth = {};

Synth.masterOut = Amp(
                    Compressor(
                      Input('master'),
                      -50, 3, 30, -20, 0.1, 0.7
                    ),
                    Param('mastevolume', 0.4)
                  );

Synth.spaceFx = Delay(
                  Input('fxinput'),
                  Param('delaytime', 1),
                  2,
                  Param('feedback', 0.3)
                );

Synth.drop = Amp(
               Filter(
                 Oscillator( Param('freq', 440), 'triangle'),
                 'lowpass',
                 Param('filterFreq', 200),
                 2
               ),
               AREnvelope(0.3, 1)
             );

Synth.hat = Amp(
              Filter(
                Noise('white'),
                'lowpass',
                 Param('freq', 200),
                 1
              ),
              AREnvelope(0.1, 0.5)
            );

Synth.kick = Amp(
               Filter(
                 Oscillator( Param('freq', 50), 'triangle'),
                 'lowpass',
                  200,
                  1
               ),
               AREnvelope(0.1, 0.5)
             );


module.exports = Synth;

