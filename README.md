# jquery.unveil2
A very lightweight jQuery plugin to lazy load images.

This plugin boosts performance delaying loading of images in long web pages, because images outside of viewport (visible part of web page) won't be loaded until the user scrolls to them.

Based on the original jquery.unveil by [Luis Almeida](http://luis-almeida.github.io/unveil/).

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
- *uclass* : the class which will be added when an image is *unveiled*. Default is "unveiled";
- *lclass* : the class which will be added when an image is *unveiled* and *loaded*. Default is "loaded";
- *hasEnd* : if **true** (default) the script will stop when all selected images are *unveiled*.
```js
$(function(){
  $('selector').unveil({
    thr : [-500,-500],
    uclass : "customUnveil",
    lclass : "customLoaded",
    hasEnd : false
  });
});
```
You can additionally pass a reference object as second argument in *unveil* function, which will be filled by some useful function (if you plan to dynamically load other images for example):
```js
$(function(){
  var refUnveilFn = {};
  $('selector').unveil({ /*options*/ }, refUnveilFn );
});
```
In the sample code above, *refUnveilFn* will contains:
- *options* : function to edit the current options;
- *addImgs* : a function that take a jquery selector (or object) to be merged with the original list of images;
- *delImgs* : like *addImgs*, but remove the images from the list istead of adding. It uses a filter function.

You can pass also a *refUnveilFn* object already containing the function ***callback*** which will be fired when an image has been *unveiled and loaded*. The argument is the vanilla image object itself. If no callback is set, than the jquery empty function is used istead.

For further reference see the master code.

## CSS animation
If you want some animation, don't rely on javascript animation like in 2000, but use css istead!
Here's a simple example of fade-in on image load:
```css
img{
  visibility:hidden;
  opacity:0;
  transition:opacity 0.4;
}
img.loaded{
  visibility:visible
  opacity:1
}
```

## Notes
jQuery Unveil 2 has some experimental feature with nice fallback: it uses the *requestAnimationFrame API* to perform an efficient loop. If that API is not implemented than a traditional *setTimeout* over the *scroll event* is used istead, firing every 100ms. The script check the *resize* event too. Images larger than the viewport (exceeding the top and bottom edge of viewport) are unveiled too.
