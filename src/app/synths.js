
var Tone   = require('Tone');

var Drop = function (options) {

  options = this.defaultArg(options, Drop.defaults);
  Tone.Monophonic.call(this, options);
  
  this.oscillator = new Tone.OmniOscillator(options.oscillator);

  this.frequency = this.oscillator.frequency;

  this.detune = this.oscillator.detune;

  this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

  this.oscillator.chain(this.envelope, this.output);

  this.oscillator.start();
  this._readOnly(['oscillator', 'frequency', 'detune', 'envelope']);

};

Tone.extend(Drop, Tone.Monophonic);

Drop.defaults = {
  'oscillator': {
    'type': 'triangle'
  },
  'envelope': {
    'attack': 0.01,
    'decay': 0.3,
    'sustain': 0.3,
    'release': 1,
  }
};

Drop.prototype._triggerEnvelopeAttack = function(time, velocity){
  this.envelope.triggerAttack(time, velocity);
  return this;	
};

Drop.prototype._triggerEnvelopeRelease = function(time){
  this.envelope.triggerRelease(time);
  return this;
};


Drop.prototype.dispose = function(){
  Tone.Monophonic.prototype.dispose.call(this);
  this._writable(['oscillator', 'frequency', 'detune', 'envelope']);
  this.oscillator.dispose();
  this.oscillator = null;
  this.envelope.dispose();
  this.envelope = null;
  this.frequency = null;
  this.detune = null;
  return this;
};

module.exports = Drop;
