angular.module('app', ['angular-bootstrap-lightbox']);

angular.module('app').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = [
    {
      'url': 'http://upload.wikimedia.org/wikipedia/commons/8/87/Waynejunction0810b.JPG',
      'width': 2272,
      'height': 1704,
      'thumbUrl': 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Waynejunction0810b.JPG/180px-Waynejunction0810b.JPG',
      'caption': 'This image has dimensions 2272x1704 and the img element is scaled to fit inside the window. The left and right arrow keys are binded for navigation. The escape key for closing the modal is binded by AngularUI Bootstrap.'
    },
    {
      'url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/98/%27Grand_Canyon_with_Rainbow%27_by_Thomas_Moran%2C_1912.JPG/586px-%27Grand_Canyon_with_Rainbow%27_by_Thomas_Moran%2C_1912.JPG',
      'width': 586,
      'height': 480,
      'thumbUrl': 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/98/%27Grand_Canyon_with_Rainbow%27_by_Thomas_Moran%2C_1912.JPG/150px-%27Grand_Canyon_with_Rainbow%27_by_Thomas_Moran%2C_1912.JPG',
      'caption': 'This image has dimensions 586x480.'
    },
    {
      'url': 'http://upload.wikimedia.org/wikipedia/commons/8/82/%27Right_Shoulder%2C_Arm%2C_and_Hand%27_by_Thomas_Eakins.JPG',
      'width': 975,
      'height': 3105,
      'thumbUrl': 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/82/%27Right_Shoulder%2C_Arm%2C_and_Hand%27_by_Thomas_Eakins.JPG/42px-%27Right_Shoulder%2C_Arm%2C_and_Hand%27_by_Thomas_Eakins.JPG',
      'caption': 'This image has dimensions 975x3105.'
    },
    {
      'url': 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/%28%2B%29-CAMP-3D-spacefill.png/50px-%28%2B%29-CAMP-3D-spacefill.png',
      'width': 50,
      'height': 33,
      'thumbUrl': 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/%28%2B%29-CAMP-3D-spacefill.png/50px-%28%2B%29-CAMP-3D-spacefill.png',
      'caption': '50x33. The min modal dimensions (400x200) apply.'
    }
  ];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
