"use strict";

var pdfEditor = function () {
  var _scale, viewPort;
  var AnnotationBorderStyleType = {
    1: "solid",
    2: "dashed",
    3: "solid",
    4: "inset",
    5: "solid"
  };

  function render(pages) {
    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    _scale = scale;

    var editorElement = document.getElementsByTagName("pdf-editor")[0];
    var htmlText = "";

    pages.forEach(function (page, pageIndex) {
      htmlText += "<div style=\"display: none;\">";
      htmlText += "<img class=\"pdf-editor-image\" src=\""
        .concat(page.image, "\" style=\"")
        .concat(getPageImgStyle(page, pageIndex, scale), "\" onload=\"pdfEditor.imgLoaded(event)\">");

      page.inputs.forEach(function (input) {
        viewPort = page.viewPort;
        var pageHeight = page.viewPort.height;

        if (input.type === "textBox") {
          htmlText += getTextBox(input, scale, pageIndex, pageHeight)
        }
        else if (input.type === "checkBox") {
          htmlText += getCheckBox(input, scale, pageIndex, pageHeight)
        }
        else if (input.type === "radioButton") {
          htmlText += getRadioButton(input, scale, pageIndex, pageHeight)
        }
        else if (input.type === "dropdown") {
          htmlText += getDropdown(input, scale, pageIndex, pageHeight)
        }
        else {
          console.error("unsupported field type ".concat(input.type));
        }
      });

      htmlText += "</div>"
    });

    editorElement.innerHTML = htmlText
  }

  function imgLoaded(event) {
    event.target.parentElement.style.display = "block"
  }

  function getTextBox(input, scale, pageIndex, pageHeight) {
    var htmlText = "";

    htmlText += "<input class=\"pdf-editor-input\" data-pdf-page=\""
      .concat(pageIndex, "\" type=\"text\" name=\"")
      .concat(input.name, "\"");

    htmlText += "style=\""
      .concat(getFieldStyle(input, scale, pageIndex, pageHeight), "\"");

    if (input.value) {
      htmlText += "value=\""
        .concat(input.value, "\"");
    }

    htmlText += ">";

    return htmlText
  }

  function getCheckBox(input, scale, pageIndex, pageHeight) {
    var htmlText = "";

    htmlText += "<input class=\"pdf-editor-input\" data-pdf-page=\""
      .concat(pageIndex, "\" type=\"checkbox\" name=\"")
      .concat(input.name, "\"");

    htmlText += "style=\""
      .concat(getFieldStyle(input, scale, pageIndex, pageHeight), "\"");

    if (input.value) {
      htmlText += "value=\""
        .concat(input.value, "\"");
    }

    htmlText += ">";

    return htmlText;
  }

  function getRadioButton(input, scale, pageIndex, pageHeight) {
    var htmlText = "";

    htmlText += "<input class=\"pdf-editor-input\" data-pdf-page=\""
      .concat(pageIndex, "\" type=\"radio\" name=\"")
      .concat(input.name, "\"");

    htmlText += "style=\""
      .concat(getFieldStyle(input, scale, pageIndex, pageHeight), "\"");

    if (input.option) {
      htmlText += "value=\""
        .concat(input.option, "\"");
    }

    htmlText += ">";

    return htmlText;
  }

  function getDropdown(input, scale, pageIndex, pageHeight) {
    var htmlText = "";
    htmlText += "<select class=\"pdf-editor-input\" data-pdf-page=\""
      .concat(pageIndex, "\" name=\"")
      .concat(input.name, "\">");

    htmlText += "style=\""
      .concat(getFieldStyle(input, scale, pageIndex, pageHeight), "\"");

    if (input.options && input.options.length) {
      input.options.forEach(function (option) {
        htmlText += "<option value=\""
          .concat(option.value, "\">")
          .concat(option.display, "</option>");
      });

      htmlText += "value=\""
        .concat(input.option, "\"");
    }

    htmlText += "</select>";

    return htmlText
  }

  function getPageImgStyle(page, pageIndex, scale) {
    var height = page.viewPort.height * scale;
    var width = page.viewPort.width * scale;
    var offset = calcTopOffset(pageIndex, height);

    return "position: absolute; top: "
      .concat(offset, "px; width: ")
      .concat(width, "px; height: ")
      .concat(height, "px;");
  }

  function calcTopOffset(pageIndex, pageHeight) {
    var offset = 0;

    for (var i = 0; i < pageIndex; i++) {
      offset += pageHeight
    }

    return offset
  }

  function getFieldStyle(input, scale, pageIndex, pageHeight) {
    var styles = "";

    var topOffset = calcTopOffset(pageIndex, pageHeight);
    styles += "position: absolute; ";
    styles += "border-style: "
      .concat(AnnotationBorderStyleType[input.borderStyle.style], "; ");

    styles += "border-radius: "
      .concat(input.horizontalCornerRadius || 0, "/")
      .concat(input.verticalCornerRadius || 0, "; ");

    styles += "border-width: "
      .concat(input.borderStyle.width, "px; ");

    styles += "color: rgb("
      .concat(input.color[0], ",")
      .concat(input.color[1], ",")
      .concat(input.color[2], "); ");

    styles += "font-size: "
      .concat(getFieldFontSize(input, scale), "px; ");

    styles += "left: "
      .concat(input.position.x * scale, "px; ");

    styles += "top: "
      .concat((input.position.y + topOffset) * scale, "px; ");

    styles += "width: "
      .concat(input.size.width * scale, "px; ");

    styles += "height: "
      .concat(input.size.height * scale, "px; ");

    styles += "z-index: 1200;";

    return styles;
  }

  function getFieldFontSize(input, scale) {
    var size = input.defaultAppearance.split(" ")[1];
    return size <= 0 ? 12 : size * scale
  }

  function zoom(amount) {

    var images = document.getElementsByClassName("pdf-editor-image");
    var inputs = document.getElementsByClassName("pdf-editor-input");
    var prevScale = _scale; _scale += amount;// scale images

    for (var i = 0; i < images.length; i++) {
      var width = parsePxToNum(images[i].style.width);
      var height = parsePxToNum(images[i].style.height);

      var newWidth = width / prevScale * _scale;
      var newHeight = height / prevScale * _scale;

      images[i].style.width = parseNumToPx(newWidth);
      images[i].style.height = parseNumToPx(newHeight);
      images[i].style.top = parseNumToPx(newHeight * i)
    }// scale inputs

    for (var _i = 0; _i < inputs.length; _i++) {
      var _width = parsePxToNum(inputs[_i].style.width);
      var _height = parsePxToNum(inputs[_i].style.height);
      var left = parsePxToNum(inputs[_i].style.left);
      var top = parsePxToNum(inputs[_i].style.top);
      var fontSize = parsePxToNum(inputs[_i].style["font-size"]);

      var _newWidth = _width / prevScale * _scale;
      var _newHeight = _height / prevScale * _scale;
      var newLeft = left / prevScale * _scale;
      var newTop = top / prevScale * _scale;
      var newFont = fontSize / prevScale * _scale;

      inputs[_i].style.width = parseNumToPx(_newWidth);
      inputs[_i].style.height = parseNumToPx(_newHeight);
      inputs[_i].style.top = parseNumToPx(newTop);
      inputs[_i].style.left = parseNumToPx(newLeft);
      inputs[_i].style["font-size"] = parseNumToPx(newFont)
    }
  }

  function fitScreen() {
    var body = document.getElementsByTagName("body")[0];
    var scaleAmount = body.clientWidth / viewPort.width;
    zoom(scaleAmount - _scale);
    return scaleAmount
  }

  function parsePxToNum(pixel) {
    return parseFloat(pixel.split("px")[0]);
  }

  function parseNumToPx(num) {
    return num + "px"
  }

  return {
    render: render,
    imgLoaded: imgLoaded,
    zoom: zoom,
    fitScreen: fitScreen
  }
}();