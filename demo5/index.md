---
title: "Demo 5: Videos"
layout: demo
module: demo5
---

{% raw %}
<ul class="gallery" ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="Lightbox.openModal(images, $index)">
      <img ng-src="{{image.thumbUrl}}" class="img-thumbnail">
    </a>
  </li>
</ul>
{% endraw %}

### `index.html`

{% highlight html %}
{% raw %}
<ul class="gallery" ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="Lightbox.openModal(images, $index)">
      <img ng-src="{{'\{\{image.thumbUrl\}\}'}}" class="img-thumbnail">
    </a>
  </li>
</ul>
{% endraw %}
{% endhighlight %}

### `demo5.js`

{% highlight js %}
angular.module('demo5', ['bootstrapLightbox']);

angular.module('demo5').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = [
    {
      'type': 'video',
      'url': 'https://www.youtube.com/watch?v=N7TkK2joi4I',
      'thumbUrl': 'https://i.ytimg.com/vi/N7TkK2joi4I/1.jpg'
    },
    {
      'url': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Kamp_Alexisdorf_3.jpg',
      'thumbUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Kamp_Alexisdorf_3.jpg/120px-Kamp_Alexisdorf_3.jpg'
    },
    {
      'type': 'video',
      'url': 'https://www.youtube.com/watch?v=khrAhOrSZQc',
      'thumbUrl': 'https://i.ytimg.com/vi/khrAhOrSZQc/1.jpg'
    }
  ];

  $scope.Lightbox = Lightbox;
});
{% endhighlight %}
