export class InputBinding {
  constructor(pdf) {
    this.pdf = pdf;
  }

  bind(input) {
    const pageIndex = input.getAttribute('data-page-index');
    const inputIndex = input.getAttribute('data-input-index');

    if (input.type === 'text') {
      this.bindTextbox(input, pageIndex, inputIndex);
    }
    else if (input.type === 'checkbox') {
      this.bindCheckbox(input, pageIndex, inputIndex);
    }
    else if (input.type === 'radio') {
      this.bindRadioButton(input, pageIndex, inputIndex);
    }
    else if (input.tagName === 'SELECT') {
      this.bindDropdown(input, pageIndex, inputIndex);
    }
  }

  bindTextbox(input, pageIndex, inputIndex) {
    this.pdf[pageIndex].inputs[inputIndex] = input.value;
  }

  bindCheckbox(input, pageIndex, inputIndex) {
    const objRef = this.pdf[pageIndex].inputs[inputIndex];

    if (input.checked) {
      objRef.value = objRef.option;
      objRef.checked = true;
    }
    else {
      objRef.value = null;
      objRef.checked = false;
    }
  }

  bindRadioButton(input, pageIndex, inputIndex) {
    const objRef = this.pdf[pageIndex].inputs[inputIndex];

    if (input.checked) {
      objRef.value = objRef.option;
      objRef.checked = true;
    }
    else {
      objRef.value = null;
      objRef.checked = true;
    }
  }

  bindDropdown(input, pageIndex, inputIndex) {

  }
}