import Tone from 'Tone';

export class Drop {
  constructor(options) {
    options = this.defaultArg(options, Drop.defaults);
    Tone.Monophonic.call(this, options);

    this.oscillator = new Tone.OmniOscillator(options.oscillator);

    this.frequency = this.oscillator.frequency;

    this.detune = this.oscillator.detune;

    this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

    this.oscillator.chain(this.envelope, this.output);

    this.oscillator.start();
    this._readOnly(['oscillator', 'frequency', 'detune', 'envelope']);
  }

  _triggerEnvelopeAttack(time, velocity) {
    this.envelope.triggerAttack(time, velocity);
    return this;
  }

  _triggerEnvelopeRelease(time) {
    this.envelope.triggerRelease(time);
    return this;
  }

  dispose() {
    Tone.Monophonic.prototype.dispose.call(this);
    this._writable(['oscillator', 'frequency', 'detune', 'envelope']);
    this.oscillator.dispose();
    this.oscillator = null;
    this.envelope.dispose();
    this.envelope = null;
    this.frequency = null;
    this.detune = null;
    return this;
  }
}

Drop.defaults = {
  oscillator: {
    type: 'triangle',
  },
  envelope: {
    attack: 0.1,
    decay: 0.7,
    sustain: 0.4,
    release: 3,
  },
};

Tone.extend(Drop, Tone.Monophonic);
