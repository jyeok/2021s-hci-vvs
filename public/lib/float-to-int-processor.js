class FloatToIntProcessor extends AudioWorkletProcessor {
  process(inputs) {
    this.port.postMessage(inputs[0][0]);
    return true;
  }
}

registerProcessor("float-to-int-processor", FloatToIntProcessor);
