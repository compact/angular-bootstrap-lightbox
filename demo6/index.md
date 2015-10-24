---
title: "Demo 6: One image only"
layout: demo
module: demo6
---

The lightbox nav is hidden when there is only one image.

{% raw %}
<ul class="gallery gallery6" ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="openLightboxModal($index)">
      <img ng-src="{{image.thumbUrl}}" class="img-thumbnail">
    </a>
  </li>
</ul>
{% endraw %}

### `index.html`

{% highlight html %}
{% raw %}
<ul class="gallery gallery6" ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="openLightboxModal($index)">
      <img ng-src="{{'\{\{image.thumbUrl\}\}'}}" class="img-thumbnail">
    </a>
  </li>
</ul>
{% endraw %}
{% endhighlight %}

### `demo5.js`

{% highlight js %}
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
{% endhighlight %}
