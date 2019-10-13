export class InputBinding {
  constructor(pdf, inputAccess) {
    this.pdf = pdf;
    this.inputAccess = inputAccess;
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

    this.inputAccess.radio.forEach(radio => {
      if (radio.name === input.name) {
        radio.value = objRef.option;
        radio.checked = false;
      }
    });

    objRef.checked = true;
  }

  bindDropdown(input, pageIndex, inputIndex) {
    const objRef = this.pdf[pageIndex].inputs[inputIndex];
    objRef.option = input.value;
  }
}