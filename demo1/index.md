---
redirect_from: "/"
title: "Demo 1: Basic"
layout: demo
module: demo1
---

Click on an image in the thumbnail gallery below to open the lightbox.

{% raw %}
<ul class="gallery gallery1" ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="openLightboxModal($index)">
      <img ng-src="{{image.thumbUrl}}" class="img-thumbnail">
    </a>
  </li>
</ul>
{% endraw %}

<small>*These images are from [NASA HQ PHOTO](https://www.flickr.com/photos/nasahqphoto/) licensed under [CC BY-NC 2.0](https://creativecommons.org/licenses/by-nc/2.0/).*</small>

### `index.html`

{% highlight html %}
{% raw %}
<ul class="gallery gallery1" ng-controller="GalleryCtrl">
  <li ng-repeat="image in images">
    <a ng-click="openLightboxModal($index)">
      <img ng-src="{{'\{\{image.thumbUrl\}\}'}}" class="img-thumbnail">
    </a>
  </li>
</ul>
{% endraw %}
{% endhighlight %}

### `demo1.js`

{% highlight js %}
angular.module('demo1', ['bootstrapLightbox']);

angular.module('demo1').controller('GalleryCtrl', function ($scope, Lightbox) {
  $scope.images = [
    {
      'url': 'https://farm6.staticflickr.com/5830/20552523531_e1efec8d49_k.jpg',
      'thumbUrl': 'https://farm6.staticflickr.com/5830/20552523531_ef720cd2f1_s.jpg',
      'caption': 'This image has dimensions 2048x1519 and the img element is scaled to fit inside the window.'
    },
    {
      'url': 'https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_b.jpg',
      'thumbUrl': 'https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_s.jpg'
    },
    {
      'url': 'https://farm1.staticflickr.com/400/20228789791_52fb84917f_b.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/400/20228789791_52fb84917f_s.jpg',
      'caption': 'The left and right arrow keys are binded for navigation. The escape key for closing the modal is binded by AngularUI Bootstrap.'
    },
    {
      'url': 'https://farm1.staticflickr.com/260/20185156095_912c2714ef_b.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/260/20185156095_912c2714ef_s.jpg'
    },
    {
      'url': 'https://farm6.staticflickr.com/5757/20359334789_57316968ed_m.jpg',
      'thumbUrl': 'https://farm6.staticflickr.com/5757/20359334789_57316968ed_s.jpg',
      'caption': 'Default minimum modal dimensions (400x200) apply for this image (240x95).'
    },
    {
      'url': 'https://farm1.staticflickr.com/359/18741723375_28c89372d7_c.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/359/18741723375_28c89372d7_s.jpg'
    },
    {
      'url': 'https://farm6.staticflickr.com/5606/15425945368_6f6ae945fc.jpg',
      'thumbUrl': 'https://farm6.staticflickr.com/5606/15425945368_6f6ae945fc_s.jpg'
    },
    {
      'url': 'https://farm9.staticflickr.com/8033/8010849891_3f029d68b3_c.jpg',
      'thumbUrl': 'https://farm9.staticflickr.com/8033/8010849891_3f029d68b3_s.jpg'
    },
    {
      'url': 'https://farm1.staticflickr.com/553/18990336631_4856e7e02c_h.jpg',
      'thumbUrl': 'https://farm1.staticflickr.com/553/18990336631_0186ac9e3e_s.jpg'
    },
    {
      'url': 'https://farm9.staticflickr.com/8736/16599799789_458891e47f_h.jpg',
      'thumbUrl': 'https://farm9.staticflickr.com/8736/16599799789_2fe489b6df_s.jpg',
      'caption': 'The next image does not exist and shows how loading errors are handled by default.'
    },
    {
      'url': '/does-not-exist.jpg',
      'thumbUrl': '/does-not-exist.jpg',
      'caption': 'This caption does not appear.'
    },
    {
      'url': 'https://farm9.staticflickr.com/8573/16800210195_a8af2ba1bb_h.jpg',
      'thumbUrl': 'https://farm9.staticflickr.com/8573/16800210195_85ab79b777_s.jpg',
      'caption': 'The previous image does not exist and shows how loading errors are handled by default.'
    },
    {
      'url': 'https://farm4.staticflickr.com/3870/14860034616_c0dd8cbc71_h.jpg',
      'thumbUrl': 'https://farm4.staticflickr.com/3870/14860034616_1c941f4f06_s.jpg'
    },
  ];

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.images, index);
  };
});
{% endhighlight %}
