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
