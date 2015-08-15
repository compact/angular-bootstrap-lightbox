angular.module('demo4', ['bootstrapLightbox']);

angular.module('demo4').config(function (LightboxProvider) {
  LightboxProvider.fullScreenMode = true;
});

angular.module('demo4').controller('AppCtrl', function ($scope, Lightbox) {
  $scope.images = [
    'http://lorempizza.com/600/400',
    'http://lorempizza.com/500/400',
    'http://lorempizza.com/600/300',
    'http://lorempizza.com/500/500',
    'http://lorempizza.com/500/700',
    'http://lorempizza.com/1000/200',
    'http://lorempizza.com/400/800',
    'http://lorempizza.com/300/500',
    'http://lorempizza.com/200/1000',
    'http://lorempizza.com/300/300',
  ];

  $scope.openLightboxModal = function (images) {
    Lightbox.openModal(images, 0);
  };
});
