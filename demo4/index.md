---
title: "Demo 4: Full screen images"
layout: demo
module: demo4
---

When `LightboxProvider.fullScreenMode` is set to `true`, all images are scaled to the maximum possible dimensions.

{% raw %}
<div ng-controller="AppCtrl">
  <a ng-click="openLightboxModal(images)" class="btn btn-lg btn-success">
    Open the lightbox
  </a>
</div>
{% endraw %}

### `index.html`

{% highlight html %}
{% raw %}
<div ng-controller="AppCtrl">
  <a ng-click="openLightboxModal(images)" class="btn btn-lg btn-success">
    Open the lightbox
  </a>
</div>
{% endraw %}
{% endhighlight %}

### `demo4.js`

{% highlight js %}
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
{% endhighlight %}
