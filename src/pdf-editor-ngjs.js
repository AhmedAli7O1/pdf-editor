import { render, zoom, fitScreen } from './pdf-editor-js';

angular.module('ngArchPDFEditor', [])
  .directive('archPdfEditor', () => {
    return {
      restrict: 'E',
      link: (scope, element, attrs) => {


        scope.$watch(attrs.pdf, function (value) {
          render(value);
        });

        scope.$watch(attrs.zoom, function (value) {
          zoom(value);
        });

        scope.$watch(attrs.fitScreen, function (value) {
          fitScreen(value);
        });
      }
    };
  });