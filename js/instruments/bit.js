import {getAudioContext} from "../audio-context-singleton";

export function bit() {
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
