<a name="bootstrapLightbox"></a>
#bootstrapLightbox
**Members**

* [bootstrapLightbox](#bootstrapLightbox)
  * [class: bootstrapLightbox.ImageLoader](#bootstrapLightbox.ImageLoader)
    * [ImageLoader.load](#bootstrapLightbox.ImageLoader.load)
  * [class: bootstrapLightbox.Lightbox](#bootstrapLightbox.Lightbox)
    * [Lightbox.imageUrl](#bootstrapLightbox.Lightbox.imageUrl)
    * [Lightbox.imageCaption](#bootstrapLightbox.Lightbox.imageCaption)
    * [Lightbox.templateUrl](#bootstrapLightbox.Lightbox.templateUrl)
    * [Lightbox.getImageUrl](#bootstrapLightbox.Lightbox.getImageUrl)
    * [Lightbox.getImageCaption](#bootstrapLightbox.Lightbox.getImageCaption)
    * [Lightbox.calculateImageDimensionLimits](#bootstrapLightbox.Lightbox.calculateImageDimensionLimits)
    * [Lightbox.calculateModalDimensions](#bootstrapLightbox.Lightbox.calculateModalDimensions)
    * [Lightbox.images](#bootstrapLightbox.Lightbox.images)
    * [Lightbox.index](#bootstrapLightbox.Lightbox.index)
    * [Lightbox.keyboardNavEnabled](#bootstrapLightbox.Lightbox.keyboardNavEnabled)
    * [Lightbox.image](#bootstrapLightbox.Lightbox.image)
    * [Lightbox.modalInstance](#bootstrapLightbox.Lightbox.modalInstance)
    * [Lightbox.openModal](#bootstrapLightbox.Lightbox.openModal)
    * [Lightbox.closeModal](#bootstrapLightbox.Lightbox.closeModal)
    * [Lightbox.setImage](#bootstrapLightbox.Lightbox.setImage)
    * [Lightbox.firstImage](#bootstrapLightbox.Lightbox.firstImage)
    * [Lightbox.prevImage](#bootstrapLightbox.Lightbox.prevImage)
    * [Lightbox.nextImage](#bootstrapLightbox.Lightbox.nextImage)
    * [Lightbox.lastImage](#bootstrapLightbox.Lightbox.lastImage)
    * [Lightbox.setImages](#bootstrapLightbox.Lightbox.setImages)
  * [class: bootstrapLightbox.lightboxSrc](#bootstrapLightbox.lightboxSrc)

<a name="bootstrapLightbox.ImageLoader"></a>
##class: bootstrapLightbox.ImageLoader
Service for loading an image.

**Members**

* [class: bootstrapLightbox.ImageLoader](#bootstrapLightbox.ImageLoader)
  * [ImageLoader.load](#bootstrapLightbox.ImageLoader.load)

<a name="bootstrapLightbox.ImageLoader.load"></a>
###ImageLoader.load
Load the image at the given URL.

**Params**

- url `String`  

**Type**: `function`  
**Returns**: `Promise` - A $q promise that resolves when the image has loaded
  successfully.  
<a name="bootstrapLightbox.Lightbox"></a>
##class: bootstrapLightbox.Lightbox
Lightbox service.

**Members**

* [class: bootstrapLightbox.Lightbox](#bootstrapLightbox.Lightbox)
  * [Lightbox.imageUrl](#bootstrapLightbox.Lightbox.imageUrl)
  * [Lightbox.imageCaption](#bootstrapLightbox.Lightbox.imageCaption)
  * [Lightbox.templateUrl](#bootstrapLightbox.Lightbox.templateUrl)
  * [Lightbox.getImageUrl](#bootstrapLightbox.Lightbox.getImageUrl)
  * [Lightbox.getImageCaption](#bootstrapLightbox.Lightbox.getImageCaption)
  * [Lightbox.calculateImageDimensionLimits](#bootstrapLightbox.Lightbox.calculateImageDimensionLimits)
  * [Lightbox.calculateModalDimensions](#bootstrapLightbox.Lightbox.calculateModalDimensions)
  * [Lightbox.images](#bootstrapLightbox.Lightbox.images)
  * [Lightbox.index](#bootstrapLightbox.Lightbox.index)
  * [Lightbox.keyboardNavEnabled](#bootstrapLightbox.Lightbox.keyboardNavEnabled)
  * [Lightbox.image](#bootstrapLightbox.Lightbox.image)
  * [Lightbox.modalInstance](#bootstrapLightbox.Lightbox.modalInstance)
  * [Lightbox.openModal](#bootstrapLightbox.Lightbox.openModal)
  * [Lightbox.closeModal](#bootstrapLightbox.Lightbox.closeModal)
  * [Lightbox.setImage](#bootstrapLightbox.Lightbox.setImage)
  * [Lightbox.firstImage](#bootstrapLightbox.Lightbox.firstImage)
  * [Lightbox.prevImage](#bootstrapLightbox.Lightbox.prevImage)
  * [Lightbox.nextImage](#bootstrapLightbox.Lightbox.nextImage)
  * [Lightbox.lastImage](#bootstrapLightbox.Lightbox.lastImage)
  * [Lightbox.setImages](#bootstrapLightbox.Lightbox.setImages)

<a name="bootstrapLightbox.Lightbox.imageUrl"></a>
###Lightbox.imageUrl
The URL of the current image. This is a property of the service rather
  than of `Lightbox.image` because `Lightbox.image` need not be an
  object, and besides it would be poor practice to alter the given
  objects.

**Type**: `String`  
<a name="bootstrapLightbox.Lightbox.imageCaption"></a>
###Lightbox.imageCaption
The optional caption of the current image.

**Type**: `String`  
<a name="bootstrapLightbox.Lightbox.templateUrl"></a>
###Lightbox.templateUrl
Template URL passed into `$modal.open()`.

**Type**: `String`  
<a name="bootstrapLightbox.Lightbox.getImageUrl"></a>
###Lightbox.getImageUrl
**Params**

- image `*` - An element in the array of images.  

**Type**: `function`  
**Returns**: `String` - The URL of the given image.  
<a name="bootstrapLightbox.Lightbox.getImageCaption"></a>
###Lightbox.getImageCaption
**Params**

- image `*` - An element in the array of images.  

**Type**: `function`  
**Returns**: `String` - The caption of the given image.  
<a name="bootstrapLightbox.Lightbox.calculateImageDimensionLimits"></a>
###Lightbox.calculateImageDimensionLimits
Calculate the max and min limits to the width and height of the displayed
  image (all are optional). The max dimensions override the min
  dimensions if they conflict.

**Params**

- dimensions `Object` - Contains the properties `windowWidth`,
  `windowHeight`, `imageWidth`, and `imageHeight`.  

**Type**: `function`  
**Returns**: `Object` - May optionally contain the properties `minWidth`,
  `minHeight`, `maxWidth`, and `maxHeight`.  
<a name="bootstrapLightbox.Lightbox.calculateModalDimensions"></a>
###Lightbox.calculateModalDimensions
Calculate the width and height of the modal. This method gets called
  after the width and height of the image, as displayed inside the modal,
  are calculated.

**Params**

- dimensions `Object` - Contains the properties `windowWidth`,
  `windowHeight`, `imageDisplayWidth`, and `imageDisplayHeight`.  

**Type**: `function`  
**Returns**: `Object` - Must contain the properties `width` and `height`.  
<a name="bootstrapLightbox.Lightbox.images"></a>
###Lightbox.images
Array of all images to be shown in the lightbox (not `Image` objects).

**Type**: `Array`  
<a name="bootstrapLightbox.Lightbox.index"></a>
###Lightbox.index
The index in the `Lightbox.images` aray of the image that is currently
  shown in the lightbox.

**Type**: `Number`  
<a name="bootstrapLightbox.Lightbox.keyboardNavEnabled"></a>
###Lightbox.keyboardNavEnabled
Whether keyboard navigation is currently enabled for navigating through
  images in the lightbox.

**Type**: `Boolean`  
<a name="bootstrapLightbox.Lightbox.image"></a>
###Lightbox.image
The image currently shown in the lightbox.

**Type**: `*`  
<a name="bootstrapLightbox.Lightbox.modalInstance"></a>
###Lightbox.modalInstance
The UI Bootstrap modal instance. See ` `.

**Type**: `Object`  
<a name="bootstrapLightbox.Lightbox.openModal"></a>
###Lightbox.openModal
Open the lightbox modal.

**Params**

- newImages `Array` - An array of images. Each image may be of
  any type.  
- newIndex `Number` - The index in `newImages` to set as the
  current image.  

**Type**: `function`  
**Returns**: `Object` - The created UI Bootstrap modal instance.  
<a name="bootstrapLightbox.Lightbox.closeModal"></a>
###Lightbox.closeModal
Close the lightbox modal.

**Params**

- result `*` - This argument can be useful if the modal promise
  gets handler(s) attached to it.  

**Type**: `function`  
<a name="bootstrapLightbox.Lightbox.setImage"></a>
###Lightbox.setImage
This method can be used in all methods which navigate/change the
  current image.

**Params**

- newIndex `Number` - The index in the array of images to set as
  the new current image.  

**Type**: `function`  
<a name="bootstrapLightbox.Lightbox.firstImage"></a>
###Lightbox.firstImage
Navigate to the first image.

**Type**: `function`  
<a name="bootstrapLightbox.Lightbox.prevImage"></a>
###Lightbox.prevImage
Navigate to the previous image.

**Type**: `function`  
<a name="bootstrapLightbox.Lightbox.nextImage"></a>
###Lightbox.nextImage
Navigate to the next image.

**Type**: `function`  
<a name="bootstrapLightbox.Lightbox.lastImage"></a>
###Lightbox.lastImage
Navigate to the last image.

**Type**: `function`  
<a name="bootstrapLightbox.Lightbox.setImages"></a>
###Lightbox.setImages
Call this method to set both the array of images and the current image
  (based on the current index). A use case is when the image collection
  gets changed dynamically in some way while the lightbox is still
  open.

**Params**

- newImages `Array` - The new array of images.  

**Type**: `function`  
<a name="bootstrapLightbox.lightboxSrc"></a>
##class: bootstrapLightbox.lightboxSrc
This attribute directive is used in an `<img>` element in the
  modal template in place of `src`. It handles resizing both the `<img>`
  element and its relevant parent elements within the modal.

**Members**

* [class: bootstrapLightbox.lightboxSrc](#bootstrapLightbox.lightboxSrc)

