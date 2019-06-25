export const getAudioContext = (function () {
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
