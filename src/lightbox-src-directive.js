/**
 * This attribute directive is used in an img element in the modal template in
 *   place of src. It handles resizing both the img element and its relevant
 *   parent elements within the modal.
 */
angular.module('bootstrapLightbox').directive('lightboxSrc', ['$window', 'ImageLoader', 'Lightbox', function ($window,
    ImageLoader, Lightbox) {
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
      'width': displayW || 0,
      'height': displayH || 0 // NaN is possible when dimensions.width is 0
    };
  };

  // the dimensions of the image
  var imageWidth = 0;
  var imageHeight = 0;

  return {
    'link': function (scope, element, attrs) {
      // resize the img element and the containing modal
      var resize = function () {
        // get the window dimensions
        var windowWidth = $window.innerWidth;
        var windowHeight = $window.innerHeight;

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
          'width': imageDisplayDimensions.width + 'px',
          'height': imageDisplayDimensions.height + 'px'
        });

        // setting the height on .modal-dialog does not expand the div with the
        // background, which is .modal-content
        angular.element(
          document.querySelector('.lightbox-modal .modal-dialog')
        ).css({
          'width': modalDimensions.width + 'px'
        });

        // .modal-content has no width specified; if we set the width on
        // .modal-content and not on .modal-dialog, .modal-dialog retains its
        // default width of 600px and that places .modal-content off center
        angular.element(
          document.querySelector('.lightbox-modal .modal-content')
        ).css({
          'height': modalDimensions.height + 'px'
        });
      };

      // load the new image whenever the attr changes
      scope.$watch(function () {
        return attrs.lightboxSrc;
      }, function (src) {
        // blank the image before resizing the element; see
        // http://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src
        element[0].src = '//:0';

        ImageLoader.load(src).then(function (image) {
          // these variables must be set before resize(), as they are used in it
          imageWidth = image.naturalWidth;
          imageHeight = image.naturalHeight;

          // resize the img element and the containing modal
          resize();

          // show the image
          element[0].src = src;
        });
      });

      // resize the image and modal whenever the window gets resized
      angular.element($window).on('resize', resize);
    }
  };
}]);
