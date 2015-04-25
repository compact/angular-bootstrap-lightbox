# angular-bootstrap-lightbox

This lightbox displays images using an [AngularUI Bootstrap Modal](http://angular-ui.github.io/bootstrap/#/modal).

When the lightbox is opened, navigating to the previous/next image can be achieved by clicking buttons above the image, clicking the left/right arrow keys, or swiping to the left/right (optional with ngTouch). The escape key for closing the modal is automatically binded by AngularUI Bootstrap.

Large images are scaled to fit inside the window. An optional image caption overlays the top left corner of the image.

## Demos

[Demos](http://compact.github.io/angular-bootstrap-lightbox/)

## API documentation

[API documentation](api.md) of the services and directive in the Angular module

## Setup

1. Install in one of the following ways:

  * Install with Bower: `bower install angular-bootstrap-lightbox --save`
  * Install with npm: `npm install angular-bootstrap-lightbox --save`
  * Manually save the script and stylesheet from [`dist`](dist).

2. Include the stylesheet in your app:

  ```html
  <link rel="stylesheet" href="bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css">
  ```

3. Include the script in your app:

  ```html
  <script src="bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js"></script>
  ```

4. The Angular module is named `bootstrapLightbox`. Add it as a dependency to your module:

  ```js
  angular.module('app', ['bootstrapLightbox']);
  ```

5. Optional dependencies:

  * To enable swipe navigation in the lightbox, include the [ngTouch](https://docs.angularjs.org/api/ngTouch) script before `angular-bootstrap-lightbox.js`.
  * To show a loading bar while an image is loading, include the [angular-loading-bar](https://github.com/chieffancypants/angular-loading-bar) script before `angular-bootstrap-lightbox.js`.

## Basic example

Gallery:

```html
<ul ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="openLightboxModal($index)">
      <img ng-src="{{image.thumbUrl}}" class="img-thumbnail">
    </a>
  </li>
</ul>
```

Controller:

```js
angular.module('app').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = [
    {
      'url': '1.jpg',
      'caption': 'Optional caption',
      'thumbUrl': 'thumb1.jpg' // used only for this example
    },
    {
      'url': '2.gif',
      'thumbUrl': 'thumb2.jpg'
    },
    {
      'url': '3.png',
      'thumbUrl': 'thumb3.png'
    }
  ];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
```

## Configuration

### Changing the appearance of the modal lightbox

The default view template for the lightbox is [lightbox.html](src/lightbox.html). Its look can be changed by making your own custom template and/or adding CSS rules; for example, use the selector `.lightbox-image-caption` to style the caption.

If you make your own template and save it at `lightbox.html`, no further code is necessary. If you save it at a different path, set it in the provider:

```js
angular.module('app').config(function (LightboxProvider) {
  // set a custom template
  LightboxProvider.templateUrl = 'path/to/your-template.html';
});
```

### Disabling the keyboard navigation

The keyboard navigation in the lightbox with the left/right arrow keys can be enabled/disabled at any time by changing the value of the boolean `Lightbox.keyboardNavEnabled`.

### Array of images

The first argument to `Lightbox.openModal` must be an array, and its elements may be of any type. In the basic example above, it is an array of objects with properties `url` and `caption`, but this is only the default and is not required. To let the `Lightbox` service know the correct values, set these methods in the provider:

```js
angular.module('app').config(function (LightboxProvider) {
  LightboxProvider.getImageUrl = function (image) {
    return '/base/dir/' + image.getName();
  };

  LightboxProvider.getImageCaption = function (image) {
    return image.label;
  };
});
```

For a more specific example, if you have no captions, the array can contain strings for the urls:

```js
angular.module('app').config(function (LightboxProvider) {
  LightboxProvider.getImageUrl = function (imageUrl) {
    return imageUrl;
  };
});

angular.module('app').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = ['1.jpg', '2.jpg', '3.jpg'];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
```

### Setting different limits for the image and lightbox dimensions

By default, images are scaled only if they are too large for the modal to contain without scrolling. To change this behaviour, see the [documentation](src/lightbox-service.js) of the following methods:

* `LightboxProvider.calculateImageDimensionLimits`
* `LightboxProvider.calculateModalDimensions`
