# angular-bootstrap-lightbox

This lightbox displays images using an AngularUI Bootstrap Modal.

[angular-loading-bar](https://github.com/chieffancypants/angular-loading-bar) is used to show the loading progress of the current image.

## Install

```
bower install angular-bootstrap-lightbox --save
```

Stylesheet with dependencies:

```html
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
<link rel="stylesheet" href="bower_components/angular-loading-bar/build/loading-bar.css">
<link rel="stylesheet" href="bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css">
```

Script with dependencies:

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script src="bower_components/angular-loading-bar/build/loading-bar.js"></script>
<script src="bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js"></script>
```

Add the module as a dependency:

```js
angular.module('app', ['angular-bootstrap-lightbox']);
```

## Example

Gallery:

```html
<ul ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="openLightboxModal($index)">
      <img ng-src="{{image.thumbUrl}}" class="img-thumbnail" alt="">
    </a>
  </li>
</ul>
```

Controller:

```js
angular.module('app').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = [
    {
      'url': '1.jpg', // required property
      'width': 123,   // required property
      'height': 456,  // required property
      'thumbUrl': 'thumb1.jpg',
      'caption': 'Optional caption'
    },
    {
      'url': '2.gif',
      'width': 789,
      'height': 1012,
      'thumbUrl': 'thumb2.jpg'
    },
    {
      'url': '3.png',
      'width': 345,
      'height': 678,
      'thumbUrl': 'thumb3.png'
    }
  ];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
```
