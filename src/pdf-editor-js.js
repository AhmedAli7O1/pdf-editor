import { registerGlobal } from './register-global';
import { InputBinding } from './input-binding';
import './styles.css';

export class PDFEditor {
  constructor(pages, scale = 1) {
    this.pages = pages;
    this.viewPort = pages[0].viewPort;
    this.scale = scale;
    this.htmlText = '';
    this.editorElement = document.getElementsByTagName('arch-pdf-editor')[0];
    this.AnnotationBorderStyleType = {
      1: "solid",
      2: "dashed",
      3: "solid",
      4: "inset",
      5: "solid"
    };

    this.inputBinding = new InputBinding(pages);
  }

  render() {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i];
      const pageIndex = i;

      this.editorElement.style.width = `${this.viewPort.width * this.scale}px`;
      this.editorElement.style.height = `${this.viewPort.height * this.scale}px`;

      this.htmlText += `<img class="pdf-editor-image" src="${page.image}" style="${this.getPageImgStyle(pageIndex, this.scale)}">`;

      for (let y = 0; y < page.inputs.length; y++) {
        const input = page.inputs[y];
        const inputIndex = y;

        const pageHeight = this.viewPort.height;

        if (input.type === 'textBox') {
          this.getTextBox(input, this.scale, pageIndex, pageHeight, inputIndex);
        }
        else if (input.type === 'checkBox') {
          this.getCheckBox(input, this.scale, pageIndex, pageHeight, inputIndex);
        }
        else if (input.type === 'radioButton') {
          this.getRadioButton(input, this.scale, pageIndex, pageHeight, inputIndex);
        }
        else if (input.type === 'dropdown') {
          this.getDropdown(input, this.scale, pageIndex, pageHeight, inputIndex);
        }
        else {
          console.error(`unsupported field type ${input.type}`);
        }
      }
    }

    this.editorElement.innerHTML = this.htmlText;

    this.addListeners();
  }

  getTextBox(input, scale, pageIndex, pageHeight, inputIndex) {

    this.htmlText += `<input class="pdf-editor-input" type="text" name="${input.name}" `;
    this.htmlText += `data-page-index="${pageIndex}" data-input-index="${inputIndex}"`;
    this.htmlText += `style="${this.getFieldStyle(input, scale, pageIndex, pageHeight)}" `;

    if (input.value) {
      this.htmlText += `value=${input.value}`;
    }

    this.htmlText += '>';
  }

  getCheckBox(input, scale, pageIndex, pageHeight) {
    this.htmlText += `<input class="pdf-editor-input" type="checkbox" name="${input.name}" `;
    this.htmlText += `style="${this.getFieldStyle(input, scale, pageIndex, pageHeight)}" `;

    if (input.value) {
      this.htmlText += `value="${input.option}" `;
    }

    if (input.checked) {
      this.htmlText += ' checked ';
    }

    this.htmlText += '>';
  }

  getRadioButton(input, scale, pageIndex, pageHeight) {
    this.htmlText += `<input class="pdf-editor-input" type="radio" name="${input.name}" `;
    this.htmlText += `style="${this.getFieldStyle(input, scale, pageIndex, pageHeight)}" `;

    if (input.option) {
      this.htmlText += `value="${input.option}"`;
    }

    if (input.value === input.option) {
      this.htmlText += ' checked ';
    }

    this.htmlText += '>';
  }

  getDropdown(input, scale, pageIndex, pageHeight) {
    this.htmlText += `<select class="pdf-editor-input" name="${input.name}" `;
    this.htmlText += `style="${this.getFieldStyle(input, scale, pageIndex, pageHeight)}" `;

    if (input.option) {
      this.htmlText += `value="${input.option}"`;
    }

    this.htmlText += '>';

    if (input.options && input.options.length) {
      input.options.forEach((option) => {
        this.htmlText += `<option value="${option.value}">${option.display}</option>`;
      });
    }

    this.htmlText += "</select>";
  }

  getPageImgStyle(pageIndex, scale) {
    const height = this.viewPort.height * scale;
    const width = this.viewPort.width * scale;
    const offset = this.calcTopOffset(pageIndex, height);

    return `position: absolute; top: ${offset}px; width: ${width}px; height: ${height}px;`;
  }

  calcTopOffset(pageIndex, pageHeight) {
    let offset = 0;

    for (let i = 0; i < pageIndex; i++) {
      offset += pageHeight
    }

    return offset
  }

  getFieldStyle(input, scale, pageIndex, pageHeight) {
    let styles = '';

    const topOffset = this.calcTopOffset(pageIndex, pageHeight);

    styles += 'position: absolute; ';
    styles += `border-style: ${this.AnnotationBorderStyleType[input.borderStyle.style]}; `
    styles += `border-radius: ${input.horizontalCornerRadius || 0}/${input.verticalCornerRadius || 0}; `;
    styles += `border-width: ${input.borderStyle.width}px; `;
    styles += `color: rgb(${input.color[0]}, ${input.color[1]}, ${input.color[2]}); `;
    styles += `font-size: ${this.getFieldFontSize(input, scale)}px; `;
    styles += `left: ${input.position.x * scale}px; `;
    styles += `top: ${(input.position.y + topOffset) * scale}px; `;
    styles += `width: ${input.size.width * scale}px; `;
    styles += `height: ${input.size.height * scale}px; `;
    styles += 'z-index: 1200;';

    return styles;
  }

  getFieldFontSize(input, scale) {
    const size = input.defaultAppearance.split(" ")[1];
    return size <= 0 ? 12 : size * scale;
  }

  zoom(amount) {

    const images = document.getElementsByClassName("pdf-editor-image");
    const inputs = document.getElementsByClassName("pdf-editor-input");
    const prevScale = this.scale;

    this.scale += amount;

    this.editorElement.style.width = `${this.viewPort.width * this.scale}px`;
    this.editorElement.style.height = `${this.viewPort.height * this.scale}px`;

    for (let i = 0; i < images.length; i++) {
      const width = this.parsePxToNum(images[i].style.width);
      const height = this.parsePxToNum(images[i].style.height);

      const newWidth = width / prevScale * this.scale;
      const newHeight = height / prevScale * this.scale;

      images[i].style.width = this.parseNumToPx(newWidth);
      images[i].style.height = this.parseNumToPx(newHeight);
      images[i].style.top = this.parseNumToPx(newHeight * i);
    }

    for (let i = 0; i < inputs.length; i++) {
      const width = this.parsePxToNum(inputs[i].style.width);
      const height = this.parsePxToNum(inputs[i].style.height);
      const left = this.parsePxToNum(inputs[i].style.left);
      const top = this.parsePxToNum(inputs[i].style.top);
      const fontSize = this.parsePxToNum(inputs[i].style["font-size"]);

      const newWidth = width / prevScale * this.scale;
      const newHeight = height / prevScale * this.scale;
      const newLeft = left / prevScale * this.scale;
      const newTop = top / prevScale * this.scale;
      const newFont = fontSize / prevScale * this.scale;

      inputs[i].style.width = this.parseNumToPx(newWidth);
      inputs[i].style.height = this.parseNumToPx(newHeight);
      inputs[i].style.top = this.parseNumToPx(newTop);
      inputs[i].style.left = this.parseNumToPx(newLeft);
      inputs[i].style["font-size"] = this.parseNumToPx(newFont)
    }
  }

  fitScreen(fit = true) {
    if (fit) {
      const body = document.getElementsByTagName("body")[0];
      const scaleAmount = body.clientWidth / this.viewPort.width;
      this.zoom(scaleAmount - this.scale);
      return scaleAmount;
    }
    else {
      this.zoom(-(this.scale));
    }
  }

  parsePxToNum(pixel) {
    return parseFloat(pixel.split('px')[0]);
  }

  parseNumToPx(num) {
    return num + 'px';
  }

  addListeners() {
    const dataObj = {};

    const inputs = document.getElementsByClassName("pdf-editor-input");

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      input.addEventListener('change', (event) => {
        this.inputBinding.bind(event.target);
      });
    }

    return dataObj;
  }
}

registerGlobal('pdfEditor', PDFEditor);
