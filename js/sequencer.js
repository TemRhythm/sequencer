function Sequencer(action) {
  
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
