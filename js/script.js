const getAudioContext = (function () {
  let instance;
  
  function init() {
    return new AudioContext();
  }
  
  return function () {
    if (!instance) {
      instance = init()
    }
    return instance;
  }
})();

function bit() {
  const audioContext = getAudioContext();
  const osc = audioContext.createOscillator();
  osc.frequency.value = 150;
  
  const gain = audioContext.createGain();
  
  osc.connect(gain).connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(150, audioContext.currentTime);
  gain.gain.setValueAtTime(1, audioContext.currentTime);

  osc.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.5);
}

function snare() {
  const audioContext = getAudioContext();
  
  const bufferSize = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  this.noise = audioContext.createBufferSource();
  this.noise.buffer = buffer;
  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  this.noise.connect(noiseFilter);
  
  const osc = audioContext.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 150;
  
  this.noiseEnvelope = audioContext.createGain();
  noiseFilter.connect(this.noiseEnvelope);
  
  this.noiseEnvelope.connect(audioContext.destination);
  this.noiseEnvelope.gain.setValueAtTime(1, audioContext.currentTime);
  this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  this.noise.start(audioContext.currentTime);
  
  this.osc = audioContext.createOscillator();
  this.osc.type = 'triangle';
  
  this.oscEnvelope = audioContext.createGain();
  this.osc.connect(this.oscEnvelope);
  this.oscEnvelope.connect(audioContext.destination);
  
  this.osc.frequency.setValueAtTime(100, audioContext.currentTime);
  this.oscEnvelope.gain.setValueAtTime(0.7, audioContext.currentTime);
  this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  this.osc.start(audioContext.currentTime)
  
  this.osc.stop(audioContext.currentTime + 0.2);
  this.noise.stop(audioContext.currentTime + 0.2);
}

function CreateSequencer(action) {
  
  const bitsCount = 4 * 4;
  const bits = [];
  let interval;
  
  function init() {
    const wrapper = document.createElement('div');
    wrapper.className = 'sequencer';
    for (let i = 0; i < bitsCount; i++) {
      const bit = document.createElement('div');
      bit.setAttribute('id', 'bit' + (i + 1));
      bit.className = 'sequencer-bit';
      bit.onclick = function () {
        if (bit.getAttribute('data-active') === 'true') {
          bit.removeAttribute('data-active');
        } else {
          bit.setAttribute('data-active', 'true');
        }
      };
      bits.push({
        el: bit,
        current: i === 0
      });
      wrapper.append(bit);
    }
    document.body.append(wrapper);
  }
  
  init();
  
  this.start = function (bpm) {
    
    bits[0].el.setAttribute('data-current', 'true');
    makeAction(bits[0]);
    
    interval = setInterval(function () {
      let currentBitIndex = getCurrentBitIndex();
      makeAction(bits[currentBitIndex]);
      bits[currentBitIndex].el.removeAttribute('data-current');
      bits[currentBitIndex].current = false;
      let nextIndex = currentBitIndex + 1;
      if(nextIndex === bits.length) {
        nextIndex = 0;
      }
      bits[nextIndex].el.setAttribute('data-current', 'true');
      bits[nextIndex].current = true;
    }, 60 / bpm / 4 * 1000)
  };
  
  this.stop = function () {
    clearInterval(interval);
    for(let i = 0; i < bits.length; i++) {
      bits[i].el.removeAttribute('data-current');
      bits[i].current = i === 0;
    }
  };
  
  function makeAction (bit) {
    if(bit.el.getAttribute('data-active') === 'true'){
      action();
    }
  }
  
  function getCurrentBitIndex() {
    for(let i = 0; i < bits.length; i++) {
      if(bits[i].current) {
        return i;
      }
    }
  }
  
}

let button = document.createElement('button');
button.innerText = 'Play';
button.onclick = function () {
  if(this.innerText === 'Play') {
    bitSequencer.start(120);
    snareSequence.start(120);
    this.innerText = 'Stop';
  } else {
    bitSequencer.stop();
    snareSequence.stop();
    this.innerText = 'Play';
  }
};
document.body.append(button);

const bitSequencer = new CreateSequencer(bit);
const snareSequence = new CreateSequencer(snare);

