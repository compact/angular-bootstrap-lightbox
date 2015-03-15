/**
 * @class     ImageLoader
 * @classdesc Service for loading an image.
 * @memberOf  bootstrapLightbox
 */
angular.module('bootstrapLightbox').service('ImageLoader', ['$q',
    function ($q) {
  /**
   * Load the image at the given URL.
   * @param    {String} url
   * @return   {Promise} A $q promise that resolves when the image has loaded
   *   successfully.
   * @type     {Function}
   * @name     load
   * @memberOf bootstrapLightbox.ImageLoader
   */
  this.load = function (url) {
    var deferred = $q.defer();

    var image = new Image();

    // when the image has loaded
    image.onload = function () {
      // check image properties for possible errors
      if ((typeof this.complete === 'boolean' && this.complete === false) ||
          (typeof this.naturalWidth === 'number' && this.naturalWidth === 0)) {
        deferred.reject();
      }

      deferred.resolve(image);
    };

    // when the image fails to load
    image.onerror = function () {
      deferred.reject();
    };

    // start loading the image
    image.src = url;

    return deferred.promise;
  };
}]);
