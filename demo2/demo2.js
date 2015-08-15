angular.module('demo2', ['bootstrapLightbox']);

angular.module('demo2').config(function (LightboxProvider) {
  // set a custom template
  LightboxProvider.templateUrl = 'demo2-lightbox-modal.html';

  // set the caption of each image as its text color
  LightboxProvider.getImageCaption = function (imageUrl) {
    return '#' + imageUrl.match(/00\/(\w+)/)[1];
  };

  // increase the maximum display height of the image
  LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
    return {
      'maxWidth': dimensions.windowWidth >= 768 ? // default
        dimensions.windowWidth - 92 :
        dimensions.windowWidth - 52,
      'maxHeight': 1600                           // custom
    };
  };

  // the modal height calculation has to be changed since our custom template is
  // taller than the default template
  LightboxProvider.calculateModalDimensions = function (dimensions) {
    var width = Math.max(400, dimensions.imageDisplayWidth + 32);

    if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
      width = 'auto';
    }

    return {
      'width': width,                             // default
      'height': 'auto'                            // custom
    };
  };
});

angular.module('demo2').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.Lightbox = Lightbox;

  $scope.images = [
    'http://dummyimage.com/100x100/8ac4f6/ffffff.png',
    'http://dummyimage.com/200x200/29ed98/ffffff.png',
    'http://dummyimage.com/300x300/c47ee9/ffffff.png',
    'http://dummyimage.com/400x400/716e5c/ffffff.png',
    'http://dummyimage.com/500x500/b37752/ffffff.png',
    'http://dummyimage.com/600x600/20b7ea/ffffff.png',
    'http://dummyimage.com/700x700/586163/ffffff.png',
    'http://dummyimage.com/800x800/6ce0dd/ffffff.png',
    'http://dummyimage.com/900x900/79841e/ffffff.png',
    'http://dummyimage.com/1000x1000/c55f33/ffffff.png',
    'http://dummyimage.com/1100x1100/43e03d/ffffff.png',
    'http://dummyimage.com/1200x1200/ee82f/ffffff.png',
    'http://dummyimage.com/1300x1300/10d5d3/ffffff.png',
    'http://dummyimage.com/1400x1400/77ddbf/ffffff.png',
    'http://dummyimage.com/1500x1500/ba6ef4/ffffff.png',
    'http://dummyimage.com/1600x1600/471916/ffffff.png',
  ];
});
