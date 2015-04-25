/**
 * @class     Lightbox
 * @classdesc Lightbox service.
 * @memberOf  bootstrapLightbox
 */
angular.module('bootstrapLightbox').provider('Lightbox', function () {
  /**
   * Template URL passed into `$modal.open()`.
   * @type     {String}
   * @name     templateUrl
   * @memberOf bootstrapLightbox.Lightbox
   */
  this.templateUrl = 'lightbox.html';

  /**
   * @param    {*} image An element in the array of images.
   * @return   {String} The URL of the given image.
   * @type     {Function}
   * @name     getImageUrl
   * @memberOf bootstrapLightbox.Lightbox
   */
  this.getImageUrl = function (image) {
    return image.url;
  };

  /**
   * @param    {*} image An element in the array of images.
   * @return   {String} The caption of the given image.
   * @type     {Function}
   * @name     getImageCaption
   * @memberOf bootstrapLightbox.Lightbox
   */
  this.getImageCaption = function (image) {
    return image.caption;
  };

  /**
   * Calculate the max and min limits to the width and height of the displayed
   *   image (all are optional). The max dimensions override the min
   *   dimensions if they conflict.
   * @param    {Object} dimensions Contains the properties `windowWidth`,
   *   `windowHeight`, `imageWidth`, and `imageHeight`.
   * @return   {Object} May optionally contain the properties `minWidth`,
   *   `minHeight`, `maxWidth`, and `maxHeight`.
   * @type     {Function}
   * @name     calculateImageDimensionLimits
   * @memberOf bootstrapLightbox.Lightbox
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
   * @param    {Object} dimensions Contains the properties `windowWidth`,
   *   `windowHeight`, `imageDisplayWidth`, and `imageDisplayHeight`.
   * @return   {Object} Must contain the properties `width` and `height`.
   * @type     {Function}
   * @name     calculateModalDimensions
   * @memberOf bootstrapLightbox.Lightbox
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

  this.$get = ['$document', '$injector', '$modal', '$timeout', 'ImageLoader',
      function ($document, $injector, $modal, $timeout, ImageLoader) {
    // optional dependency
    var cfpLoadingBar = $injector.has('cfpLoadingBar') ?
      $injector.get('cfpLoadingBar'): null;

    var Lightbox = {};

    /**
     * Array of all images to be shown in the lightbox (not `Image` objects).
     * @type     {Array}
     * @name     images
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.images = [];

    /**
     * The index in the `Lightbox.images` aray of the image that is currently
     *   shown in the lightbox.
     * @type     {Number}
     * @name     index
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.index = -1;

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
     * @type     {Boolean}
     * @name     keyboardNavEnabled
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.keyboardNavEnabled = false;

    /**
     * The image currently shown in the lightbox.
     * @type     {*}
     * @name     image
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.image = {};

    /**
     * The UI Bootstrap modal instance. See {@link
     *   http://angular-ui.github.io/bootstrap/#/modal}.
     * @type     {Object}
     * @name     modalInstance
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.modalInstance = null;

    /**
     * The URL of the current image. This is a property of the service rather
     *   than of `Lightbox.image` because `Lightbox.image` need not be an
     *   object, and besides it would be poor practice to alter the given
     *   objects.
     * @type     {String}
     * @name     imageUrl
     * @memberOf bootstrapLightbox.Lightbox
     */

    /**
     * The optional caption of the current image.
     * @type     {String}
     * @name     imageCaption
     * @memberOf bootstrapLightbox.Lightbox
     */

    /**
     * Open the lightbox modal.
     * @param    {Array}  newImages An array of images. Each image may be of
     *   any type.
     * @param    {Number} newIndex  The index in `newImages` to set as the
     *   current image.
     * @return   {Object} The created UI Bootstrap modal instance.
     * @type     {Function}
     * @name     openModal
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.openModal = function (newImages, newIndex) {
      Lightbox.images = newImages;
      Lightbox.setImage(newIndex);

      // store the modal instance so we can close it manually if we need to
      Lightbox.modalInstance = $modal.open({
        'templateUrl': Lightbox.templateUrl,
        'controller': ['$scope', function ($scope) {
          // $scope is the modal scope, a child of $rootScope
          $scope.Lightbox = Lightbox;

          Lightbox.keyboardNavEnabled = true;
        }],
        'windowClass': 'lightbox-modal'
      });

      // modal close handler
      Lightbox.modalInstance.result['finally'](function () {
        // prevent the lightbox from flickering from the old image when it gets
        // opened again
        Lightbox.images = [];
        Lightbox.index = 1;
        Lightbox.image = {};
        Lightbox.imageUrl = null;
        Lightbox.imageCaption = null;

        Lightbox.keyboardNavEnabled = false;

        // complete any lingering loading bar progress
        if (cfpLoadingBar) {
          cfpLoadingBar.complete();
        }
      });

      return Lightbox.modalInstance;
    };

    /**
     * Close the lightbox modal.
     * @param    {*} result This argument can be useful if the modal promise
     *   gets handler(s) attached to it.
     * @type     {Function}
     * @name     closeModal
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.closeModal = function (result) {
      return Lightbox.modalInstance.close(result);
    };

    /**
     * This method can be used in all methods which navigate/change the
     *   current image.
     * @param    {Number} newIndex The index in the array of images to set as
     *   the new current image.
     * @type     {Function}
     * @name     setImage
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.setImage = function (newIndex) {
      if (!(newIndex in Lightbox.images)) {
        throw 'Invalid image.';
      }

      // start the loading bar
      if (cfpLoadingBar) {
        cfpLoadingBar.start();
      }

      var success = function () {
        Lightbox.index = newIndex;
        Lightbox.image = Lightbox.images[Lightbox.index];

        // complete the loading bar
        if (cfpLoadingBar) {
          cfpLoadingBar.complete();
        }
      };

      var imageUrl = Lightbox.getImageUrl(Lightbox.images[newIndex]);

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
     * @type     {Function}
     * @name     firstImage
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.firstImage = function () {
      Lightbox.setImage(0);
    };

    /**
     * Navigate to the previous image.
     * @type     {Function}
     * @name     prevImage
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.prevImage = function () {
      Lightbox.setImage((Lightbox.index - 1 + Lightbox.images.length) %
        Lightbox.images.length);
    };

    /**
     * Navigate to the next image.
     * @type     {Function}
     * @name     nextImage
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.nextImage = function () {
      Lightbox.setImage((Lightbox.index + 1) % Lightbox.images.length);
    };

    /**
     * Navigate to the last image.
     * @type     {Function}
     * @name     lastImage
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.lastImage = function () {
      Lightbox.setImage(Lightbox.images.length - 1);
    };

    /**
     * Call this method to set both the array of images and the current image
     *   (based on the current index). A use case is when the image collection
     *   gets changed dynamically in some way while the lightbox is still
     *   open.
     * @param {Array} newImages The new array of images.
     * @type     {Function}
     * @name     setImages
     * @memberOf bootstrapLightbox.Lightbox
     */
    Lightbox.setImages = function (newImages) {
      Lightbox.images = newImages;
      Lightbox.setImage(Lightbox.index);
    };

    // Bind the left and right arrow keys for image navigation. This event
    // handler never gets unbinded. Disable this using the `keyboardNavEnabled`
    // flag. It is automatically disabled when the target is an input and or a
    // textarea. TODO: Move this to a directive.
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
  }];
});
