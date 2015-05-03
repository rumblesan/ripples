
var Thicket = require('thicket');

var Constant   = Thicket.AST.Contsant;   // value
var Param      = Thicket.AST.Param;      // name, defaultValue
var AREnvelope = Thicket.AST.AREnvelope; // attack, decay
var Oscillator = Thicket.AST.Oscillator; // frequency, waveshape
var Filter     = Thicket.AST.Filter;     // source, type, frequency, resonance
var Amp        = Thicket.AST.Amp;        // source, volume

var Synth = {};

Synth.drop = Amp(
               Filter(
                 Oscillator( Param('freq', 440), 'triangle'),
                 'lowpass',
                 Param('filterFreq', 200),
                 2
               ),
               AREnvelope(0.2, 1)
             );

module.exports = Synth;

