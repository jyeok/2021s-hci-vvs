class FloatToIntProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    console.log(options);
  }

  process(inputs, outputs) {
    return true;
  }
}

registerProcessor("float-to-int-processor", FloatToIntProcessor);
