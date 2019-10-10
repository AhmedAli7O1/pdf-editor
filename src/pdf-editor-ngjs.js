import { PDFEditor } from './pdf-editor-js';

angular.module('ngArchPDFEditor', [])
  .directive('archPdfEditor', () => {
    return {
      restrict: 'E',
      link: (scope, element, attrs) => {
        let pdfEditor;

        scope.$watch(attrs.pdf, (pdf) => {
          const scale = scope[attrs.scale] || 1;
          pdfEditor = new PDFEditor(pdf, scale);
          pdfEditor.render();
        });

        scope.$watch(attrs.scale, (scale) => {
          pdfEditor.zoom(scale - pdfEditor.scale);
        });
      }
    };
  });

