import Teoria from 'teoria';
import Tone from 'Tone';
import Drop from './synths';

const config = {
  dropVoices: 6,
  scaleNotes: 7,
  scale: Teoria.note('a4').scale('minor'),
};

const getNote = () => {
  const n = Math.ceil(Math.random() * config.scaleNotes);
  return config.scale.get(n);
};

export default () => {
  const dropSynth = new Tone.PolySynth(config.dropVoices, Drop);

  const delay = new Tone.FeedbackDelay('3n', 0.4);
  delay.set('wet', 0.3);

  const reverb = new Tone.Freeverb();

  const filter = new Tone.Filter(400, 'lowpass');

  const comp = new Tone.Compressor(-30, 2);

  const volume = new Tone.Volume(-10);

  dropSynth.chain(delay, reverb, filter, comp, volume, Tone.Master);

  const system = {
    click: () => {
      dropSynth.triggerAttackRelease(getNote().fq(), '2n');
    },
  };

  return system;
};
