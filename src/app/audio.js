import Teoria from 'teoria';

import patcher from 'ripple-synth.export.json';

const { createDevice, MIDIEvent } = require('@rnbo/js');

const config = {
  dropVoices: 6,
  scaleNotes: 7,
  scale: Teoria.note('a4').scale('minor'),
  noteDuration: 100,
  midiChannel: 0,
  midiPort: 0,
};

const getNote = () => {
  const n = Math.ceil(Math.random() * config.scaleNotes);
  return config.scale.get(n).midi();
};

export default () => {
  const WAContext = window.AudioContext || window.webkitAudioContext;
  const context = new WAContext();

  const system = {
    context,
    synth: null,
  };
  system.click = () => {
    context.resume();

    if (!system.synth) {
      console.log('no synth');
      return;
    }
    const midiPitch = getNote();
    const noteOnMessage = [144 + config.midiChannel, midiPitch, 100];
    const noteOffMessage = [144 + config.midiChannel, midiPitch, 0];

    let noteOnEvent = new MIDIEvent(
      context.currentTime * 1000,
      config.midiPort,
      noteOnMessage
    );
    let noteOffEvent = new MIDIEvent(
      context.currentTime * 1000 + config.noteDuration,
      config.midiPort,
      noteOffMessage
    );
    console.log('sent notes', noteOnEvent, noteOffEvent);

    system.synth.scheduleEvent(noteOnEvent);
    system.synth.scheduleEvent(noteOffEvent);
  };
  createDevice({ context, patcher }).then((device) => {
    device.node.connect(context.destination);
    system.synth = device;
  });

  return system;
};
