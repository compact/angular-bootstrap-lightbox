angular.module('bootstrapLightbox').provider('Lightbox', function () {
  /**
   * Template URL passed into $modal.open().
   * @type {String}
   */
  this.templateUrl = 'lightbox.html';

  /**
   * @param  {*}      image An element in the array of images.
   * @return {String}       The URL of the given image.
   */
  this.getImageUrl = function (image) {
    return image.url;
  };

  /**
   * @param  {*}      image An element in the array of images.
   * @return {String}       The caption of the given image.
   */
  this.getImageCaption = function (image) {
    return image.caption;
  };

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
    if (dimensions.windowWidth >= 768) {
      return {
        // 92px = 2 * (30px margin of .modal-dialog
        //             + 1px border of .modal-content
        //             + 15px padding of .modal-body)
        // with the goal of 30px side margins; however, the actual side margins
        // will be slightly less (at 22.5px) due to the vertical scrollbar
        'maxWidth': dimensions.windowWidth - 92,
        // 126px = 92px as above
        //         + 34px outer height of .lightbox-nav
        'maxHeight': dimensions.windowHeight - 126
      };
    } else {
      return {
        // 52px = 2 * (10px margin of .modal-dialog
        //             + 1px border of .modal-content
        //             + 15px padding of .modal-body)
        'maxWidth': dimensions.windowWidth - 52,
        // 86px = 52px as above
        //        + 34px outer height of .lightbox-nav
        'maxHeight': dimensions.windowHeight - 86
      };
    }
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
    // 32px = 2 * (1px border of .modal-content
    //             + 15px padding of .modal-body)
    var width = Math.max(400, dimensions.imageDisplayWidth + 32);

    // 200px = arbitrary min height
    // 66px = 32px as above
    //        + 34px outer height of .lightbox-nav
    var height = Math.max(200, dimensions.imageDisplayHeight + 66);

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

  this.$get = function ($document, $modal, $timeout, cfpLoadingBar,
      ImageLoader) {
    // array of all images to be shown in the lightbox (not Image objects)
    var images = [];

    // the index of the image currently shown (Lightbox.image)
    var index = -1;

    /**
     * The service object for the lightbox.
     * @type {Object}
     */
    var Lightbox = {};

    // set the configurable properties and methods, the defaults of which are
    // defined above
    Lightbox.templateUrl = this.templateUrl;
    Lightbox.getImageUrl = this.getImageUrl;
    Lightbox.getImageCaption = this.getImageCaption;
    Lightbox.calculateImageDimensionLimits = this.calculateImageDimensionLimits;
    Lightbox.calculateModalDimensions = this.calculateModalDimensions;

    /**
     * Whether keyboard navigation is currently enabled for navigating through
     *   images in the lightbox.
     * @type {Boolean}
     */
    Lightbox.keyboardNavEnabled = false;

    /**
     * The current image.
     * @type {*}
     */
    Lightbox.image = {};

    /**
     * The URL of the current image. This is a property of the service rather
     *   than of Lightbox.image because Lightbox.image need not be an object,
     *   and besides it would be poor practice to alter the given objects.
     * @type {String}
     */
    // Lightbox.imageUrl = '';

    /**
     * The caption of the current image. See the description of
     *   Lightbox.imageUrl.
     * @type {String}
     */
    // Lightbox.imageCaption = '';

    /**
     * Open the lightbox modal.
     * @param  {Array}  newImages An array of images. Each image may be of any
     *   type.
     * @param  {Number} newIndex  The index in newImages to set as the current
     *   image.
     */
    Lightbox.openModal = function (newImages, newIndex) {
      images = newImages;
      Lightbox.setImage(newIndex);

      $modal.open({
        'templateUrl': Lightbox.templateUrl,
        'controller': ['$scope', function ($scope) {
          // $scope is the modal scope, a child of $rootScope
          $scope.Lightbox = Lightbox;

          Lightbox.keyboardNavEnabled = true;
        }],
        'windowClass': 'lightbox-modal'
      }).result.finally(function () { // close
        // prevent the lightbox from flickering from the old image when it gets
        // opened again
        Lightbox.image = {};
        Lightbox.imageUrl = null;
        Lightbox.imageCaption = null;

        Lightbox.keyboardNavEnabled = false;

        // complete any lingering loading bar progress
        cfpLoadingBar.complete();
      });
    };

    /**
     * This method can be used in all methods which navigate/change the
     *   current image.
     * @param {Number} newIndex The index in the array of images to set as the
     *   new current image.
     */
    Lightbox.setImage = function (newIndex) {
      if (!(newIndex in images)) {
        throw 'Invalid image.';
      }

      cfpLoadingBar.start();

      var success = function () {
        index = newIndex;
        Lightbox.image = images[index];

        cfpLoadingBar.complete();
      };

      var imageUrl = Lightbox.getImageUrl(images[newIndex]);

      // load the image before setting it, so everything in the view is updated
      // at the same time; otherwise, the previous image remains while the
      // current image is loading
      ImageLoader.load(imageUrl).then(function () {
        success();

        // set the url and caption
        Lightbox.imageUrl = imageUrl;
        Lightbox.imageCaption = Lightbox.getImageCaption(Lightbox.image);
      }, function () {
        success();

        // blank image
        Lightbox.imageUrl = '//:0';
        // use the caption to show the user an error
        Lightbox.imageCaption = 'Failed to load image';
      });
    };

    /**
     * Navigate to the first image.
     */
    Lightbox.firstImage = function () {
      Lightbox.setImage(0);
    };

    /**
     * Navigate to the previous image.
     */
    Lightbox.prevImage = function () {
      Lightbox.setImage((index - 1 + images.length) % images.length);
    };

    /**
     * Navigate to the next image.
     */
    Lightbox.nextImage = function () {
      Lightbox.setImage((index + 1) % images.length);
    };

    /**
     * Navigate to the last image.
     */
    Lightbox.lastImage = function () {
      Lightbox.setImage(images.length - 1);
    };

    /**
     * Call this method to set both the array of images and the current image
     *   (based on the current index). A use case is when the image collection
     *   gets changed dynamically in some way while the lightbox is still open.
     * @param {Array} newImages The new array of images.
     */
    Lightbox.setImages = function (newImages) {
      images = newImages;
      Lightbox.setImage(index);
    };

    /**
     * Bind the left and right arrow keys for image navigation. This event
     *   handler never gets unbinded. Disable this using the
     *   keyboardNavEnabled flag. It is automatically disabled when
     *   the target is an input and or a textarea.
     */
    $document.bind('keydown', function (event) {
      if (!Lightbox.keyboardNavEnabled) {
        return;
      }

      // method of Lightbox to call
      var method = null;

      switch (event.which) {
      case 39: // right arrow key
        method = 'nextImage';
        break;
      case 37: // left arrow key
        method = 'prevImage';
        break;
      }

      if (method !== null && ['input', 'textarea'].indexOf(
          event.target.tagName.toLowerCase()) === -1) {
        // the view doesn't update without a manual digest
        $timeout(function () {
          Lightbox[method]();
        });

        event.preventDefault();
      }
    });

    return Lightbox;
  };
});
