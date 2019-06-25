import {snare} from "./instruments/snare";
import {bit} from "./instruments/bit";

const bitSequencer = new Sequencer(bit);
const snareSequencer = new Sequencer(snare);

let button = document.createElement('button');
button.innerText = 'Play';
button.onclick = function () {
  if(this.innerText === 'Play') {
    bitSequencer.start(120);
    snareSequencer.start(120);
    this.innerText = 'Stop';
  } else {
    bitSequencer.stop();
    snareSequencer.stop();
    this.innerText = 'Play';
  }
};
document.body.append(button);

