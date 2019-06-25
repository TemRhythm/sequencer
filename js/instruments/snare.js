export function snare() {
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
  this.osc.start(audioContext.currentTime);
  
  this.osc.stop(audioContext.currentTime + 0.2);
  this.noise.stop(audioContext.currentTime + 0.2);
}
