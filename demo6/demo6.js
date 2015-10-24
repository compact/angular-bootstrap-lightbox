angular.module('demo6', ['bootstrapLightbox']);

angular.module('demo6').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = [
    {
      'url': 'http://i.imgur.com/9RyWebb.jpg',
      'thumbUrl': 'http://i.imgur.com/9RyWebbb.jpg'
    }
  ];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
