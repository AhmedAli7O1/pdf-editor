export class InputBinding {
  constructor(pdf) {
    this.pdf = pdf;
  }

  bind(input) {
    const pageIndex = input.getAttribute('data-page-index');
    const inputIndex = input.getAttribute('data-input-index');

    if (input.type === 'text') {
      this.bindTextbox(input);
    }
  }

  bindTextbox(input) {


    console.log('input', this.pdf[pageIndex].inputs[inputIndex]);
  }
}