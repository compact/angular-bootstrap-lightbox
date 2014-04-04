angular.module('bootstrapLightbox', [
  'ngTouch',
  'ui.bootstrap',
  'chieffancypants.loadingBar',
]);
angular.module('bootstrapLightbox').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('lightbox.html',
    "<div class=modal-body ng-swipe-left=Lightbox.prevImage() ng-swipe-right=Lightbox.nextImage()><div class=lightbox-nav><button class=close aria-hidden=true ng-click=$dismiss()>×</button><div class=btn-group><a class=\"btn btn-xs btn-default\" ng-click=Lightbox.prevImage()>‹ Previous</a> <a ng-href={{Lightbox.image.url}} target=_blank class=\"btn btn-xs btn-default\" title=\"Open in new tab\">Open image in new tab</a> <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.nextImage()>Next ›</a></div></div><div class=lightbox-image-container><div class=lightbox-image-caption><span>{{Lightbox.image.caption}}</span></div><img lightbox-src={{Lightbox.image.url}} alt=\"\"></div></div>"
  );

}]);
angular.module('bootstrapLightbox').provider('Lightbox', function () {
  this.templateUrl = 'lightbox.html';

  /**
   * Calculate the max and min limits to the width and height of the displayed
   *   image (all are optional). The max dimensions override the min
   *   dimensions if they conflict.
   * @param  {Object} dimensions Contains the properties windowWidth,
   *   windowHeight, imageWidth, imageHeight.
   * @return {Object} May optionally contain the properties minWidth,
   *   minHeight, maxWidth, maxHeight.
   */
  this.calculateImageDimensionLimits = function (dimensions) {
    return {
      // 102px = 2 * (30px margin of .modal-dialog
      //              + 1px border of .modal-content
      //              + 20px padding of .modal-body)
      // with the goal of 30px side margins; however, the actual side margins
      // will be slightly less (at 22.5px) due to the vertical scrollbar
      'maxWidth': dimensions.windowWidth - 102,
      // 136px = 102px as above
      //         + 34px outer height of .lightbox-nav
      'maxHeight': dimensions.windowHeight - 136
    };
  };

  /**
   * Calculate the width and height of the modal. This method gets called
   *   after the width and height of the image, as displayed inside the modal,
   *   are calculated.
   * @param  {Object} dimensions Contains the properties windowWidth,
   *   windowHeight, imageDisplayWidth, imageDisplayHeight.
   * @return {Object} Must contain the properties width and height.
   */
  this.calculateModalDimensions = function (dimensions) {
    // 400px = arbitrary min width
    // 42px = 2 * (1px border of .modal-content
    //        + 20px padding of .modal-body)
    var width = Math.max(400, dimensions.imageDisplayWidth + 42);

    // 200px = arbitrary min height
    // 76px = 42px as above
    //        + 34px outer height of .lightbox-nav
    var height = Math.max(200, dimensions.imageDisplayHeight + 76);

    // first case:  the modal width cannot be larger than the window width
    //              20px = arbitrary value larger than the vertical scrollbar
    //                     width in order to avoid having a horizontal scrollbar
    // second case: Bootstrap modals are not centered below 768px
    if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
      width = 'auto';
    }

    // the modal height cannot be larger than the window height
    if (height >= dimensions.windowHeight) {
      height = 'auto';
    }

    return {
      'width': width,
      'height': height
    };
  };

  this.$get = function service($document, $modal, $timeout, cfpLoadingBar) {
    // whether the lightbox is currently open; used in the keydown event handler
    var opened = false;

    // array of all images to be shown in the lightbox
    var images = [];

    // the index of the image currently shown (Lightbox.image)
    var index = 0;

    // the service object
    var Lightbox = {};

    // config
    Lightbox.templateUrl = this.templateUrl;
    Lightbox.calculateImageDimensionLimits = this.calculateImageDimensionLimits;
    Lightbox.calculateModalDimensions = this.calculateModalDimensions;

    // open the lightbox modal
    Lightbox.openModal = function (newImages, newIndex) {
      images = newImages;
      index = newIndex;
      Lightbox.image = images[index];
      cfpLoadingBar.start();

      $modal.open({
        'templateUrl': Lightbox.templateUrl,
        'controller': ['$scope', function ($scope) {
          // $scope is the modal scope, a child of $rootScope
          $scope.Lightbox = Lightbox;
          opened = true;
        }],
        'windowClass': 'lightbox-modal'
      }).result.finally(function () {
        cfpLoadingBar.complete();
        opened = false;
      });
    };

    // helper for the image navigation methods below
    var setImage = function (newIndex) {
      index = newIndex;
      Lightbox.image = images[index];
      cfpLoadingBar.start();
    };
    Lightbox.firstImage = function () {
      setImage(0);
    };
    Lightbox.prevImage = function () {
      setImage((index - 1 + images.length) % images.length);
    };
    Lightbox.nextImage = function () {
      setImage((index + 1) % images.length);
    };
    Lightbox.lastImage = function () {
      setImage(images.length - 1);
    };

    /**
     * Call this method to set both the images array and the image object
     *   (based on the current index). A use case is when the images get
     *   changed dynamically in some way.
     */
    Lightbox.setImages = function (newImages) {
      images = newImages;
      Lightbox.image = images[index];
    };

    /**
     * Bind the left and right arrow keys for image navigation. This event
     *   handler never gets unbinded.
     */
    $document.bind('keydown', function (event) {
      if (opened) {
        switch (event.which) {
        case 39: // right arrow key
          // don't know why the view doesn't update without this manual digest
          $timeout(function () {
            Lightbox.nextImage();
          });
          return false;
        case 37: // left arrow key
          $timeout(function () {
            Lightbox.prevImage();
          });
          return false;
        }
      }
    });

    return Lightbox;
  };
});
angular.module('bootstrapLightbox')
    .directive('lightboxSrc', function ($window, cfpLoadingBar, Lightbox) {
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
    'link': function (scope, element, attrs) {
      // resize the image and the containing modal
      var resize = function () {
        // get the window dimensions
        var windowWidth = $window.innerWidth;
        var windowHeight = $window.innerHeight;

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

        // .modal-content has no width specified; if we set the width on .modal-
        // .content and not on.modal-dialog, .modal-dialog retains its default
        // .width of 600px and that places .modal-content off center
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
        img = new Image();

        // start loading the image
        img.src = src;

        // when the image has loaded
        img.onload = function() {
          // blank the image before resizing the element; see
          // http://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src
          element[0].src = '//:0';

          resize();

          // show the image
          element[0].src = src;

          cfpLoadingBar.complete();
        };
      });

      // resize the image and modal whenever the window gets resized
      angular.element($window).on('resize', resize);
    }
  };
});
