angular.module('angular-bootstrap-lightbox')
    .directive('lightboxImg', function ($window, cfpLoadingBar, Lightbox) {
  /**
   * Calculate the dimensions to display the image. The max dimensions
   *   override the min dimensions if they conflict.
   */
  var calculateImageDisplayDimensions = function (dimensions) {
    var w = dimensions.width;
    var h = dimensions.height;
    var minW = dimensions.minWidth;
    var minH = dimensions.minHeight;
    var maxW = dimensions.maxWidth;
    var maxH = dimensions.maxHeight;

    var displayW = w;
    var displayH = h;

    // resize the image if it is too small
    if (w < minW && h < minH) {
      // the image is both too thin and short, so compare the aspect ratios to
      // determine whether to min the width or height
      if (w / h > maxW / maxH) {
        displayH = minH;
        displayW = Math.round(w * minH / h);
      } else {
        displayW = minW;
        displayH = Math.round(h * minW / w);
      }
    } else if (w < minW) {
      // the image is too thin
      displayW = minW;
      displayH = Math.round(h * minW / w);
    } else if (h < minH) {
      // the image is too short
      displayH = minH;
      displayW = Math.round(w * minH / h);
    }

    // resize the image if it is too large
    if (w > maxW && h > maxH) {
      // the image is both too tall and wide, so compare the aspect ratios
      // to determine whether to max the width or height
      if (w / h > maxW / maxH) {
        displayW = maxW;
        displayH = Math.round(h * maxW / w);
      } else {
        displayH = maxH;
        displayW = Math.round(w * maxH / h);
      }
    } else if (w > maxW) {
      // the image is too wide
      displayW = maxW;
      displayH = Math.round(h * maxW / w);
    } else if (h > maxH) {
      // the image is too tall
      displayH = maxH;
      displayW = Math.round(w * maxH / h);
    }

    return {
      'width': displayW,
      'height': displayH
    };
  };

  return {
    'link': function (scope, element) {
      var $windowElement = angular.element($window);

      // handler for resizing the image and the containing modal
      var resize = function () {
        // get the window dimensions
        var windowWidth = $windowElement.width();
        var windowHeight = $windowElement.height();

        var imageWidth = scope.Lightbox.image.width;
        var imageHeight = scope.Lightbox.image.height;

        // calculate the max/min dimensions for the image
        var imageDimensionLimits = Lightbox.calculateImageDimensionLimits({
          'windowWidth': windowWidth,
          'windowHeight': windowHeight,
          'imageWidth': imageWidth,
          'imageHeight': imageHeight
        });

        // calculate the dimensions to display the image
        var imageDisplayDimensions = calculateImageDisplayDimensions(
          angular.extend({
            'width': imageWidth,
            'height': imageHeight,
            'minWidth': 1,
            'minHeight': 1,
            'maxWidth': 3000,
            'maxHeight': 3000,
          }, imageDimensionLimits)
        );

        // calculate the dimensions of the modal container
        var modalDimensions = Lightbox.calculateModalDimensions({
          'windowWidth': windowWidth,
          'windowHeight': windowHeight,
          'imageDisplayWidth': imageDisplayDimensions.width,
          'imageDisplayHeight': imageDisplayDimensions.height
        });

        // resize the image
        element.css({
          'width': imageDisplayDimensions.width,
          'height': imageDisplayDimensions.height
        });

        // setting the height on .modal-dialog does not expand the div with the
        // background, which is .modal-content
        element.closest('.modal-dialog').css({
          'width': modalDimensions.width
        });

        // .modal-content has no width specified; if we set the width on .modal-
        // .content and not on.modal-dialog, .modal-dialog retains its default
        // .width of 600px and that places .modal-content off center
        element.closest('.modal-content').css({
          'height': modalDimensions.height
        });
      };

      // initial resize for the first image
      resize();

      // bind
      element.bind('load', function () {
        cfpLoadingBar.complete();
        resize();
      });
      $windowElement.bind('resize', resize);
    }
  };
});
