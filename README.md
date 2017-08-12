# jquery.unveil2
A very lightweight jQuery plugin to lazy load images

## Usage
Use a placeholder image in the src attribute - something to be displayed while the original image loads - and include the actual image source in a "data-src" attribute. If data-src isn't present image will be skipped later.
```html
<img src="blank.png" data-src="path/to/image" />
```
On document ready (or at page bottom) initialize images to be *unveiled*
```js
$(function(){
  $('selector').unveil( /*options*/ )
});
```

## Options
Options are passed by as javascript object:
- *thr* : threshold (upper bound and lower bound in an array). By default, images are only loaded and *unveiled* when the user scrolls to them and they became completely visible on the screen. Negative values of *thr* mean pre-load images which are not yet in viewport. NB - **jquery.unveil2** takes account of big images which are bigger than the wieport.
- *uclass* : the class which will be added when an image is *unveiled*. Default is "unveiled"
- *hasEnd* : if **true** (default) the script will stop when all selected images are *unveiled*.
```js
$(function(){
  $('selector').unveil({
    thr : [-500,-500],
    uclass : "custom",
    hasEnd : false
  });
});
```
You can additionally pass a reference empty object as second argument in *unveil* function, which will be filled by some useful function (if you plan to dynamically load other images for example):
```js
$(function(){
  var refUnveilFn = {};
  $('selector').unveil({
    thr : [-500,-500],
    uclass : "custom",
    hasEnd : false
  }, refUnveilFn );
});
```
In the sample code above, *refUnveilFn* will contains:
- *options* : function to edit the current options
- *addImgs* : a function that take a jquery selector (or object) to be merged with the original list of images
- *delImgs* : like *addImgs*, but remove the images from the list istead of adding. It uses a filter function.

For further reference see the master code.
