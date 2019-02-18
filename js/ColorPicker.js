/**
 * [ColorPicker.js]
 */
/*jslint
  browser,
  devel,
  multivar,
  for,
  this,
  single,
  long,
  white,
  bitwise
*/
/*global Image*/
/*jshint
  scripturl : true,
  esversion : 6
*/


var ColorPicker = {};

/**
 * Draw Image To Canvas
 */
ColorPicker.drawCanvas = function() {
  
  'use strict';
  
  var fromImageX      = 0,
      fromImageY      = 0,
      toImageX        = ColorPicker.imageWidth,
      toImageY        = ColorPicker.imageHeight,
      fromCanvasX     = 0,
      fromCanvasY     = 0,
      toCanvasX       = 800,  // both via config > [ ] Original Image Size
      toCanvasY       = 500,
      jumpPosition    = 0,
      imageRatio      = 1,
      scaleX          = 1,
      scaleY          = 1,
      scale           = 1,
      newCanvasWidth  = 800,
      newCanvasHeight = 500;
  
  if( toImageX < 1 ) {

    ColorPicker.realoadCounter += 1;

    console.log( '(' + ColorPicker.reloadCounter + ') Still waiting for image meta... ' );

    setTimeout( ColorPicker.drawCanvas, 1000 );

    return;

  }
  
  /* Scale canvas/image to maxWidth:800 and maxHeight:500 while keeping the original image aspect ratio */
  if( ColorPicker.imageWidth > 800 || ColorPicker.imageHeight > 500 ) {
  
    imageRatio = ( ColorPicker.imageWidth / ColorPicker.imageHeight ),
    scaleX = Math.abs( 800 / ColorPicker.imageWidth ),
    scaleY = Math.abs( 500 / ColorPicker.imageHeight),
    scale = ( ( scaleX < scaleY ) ? scaleX : scaleY );
  
    newCanvasWidth = Math.round( ColorPicker.imageWidth * scale ),
    newCanvasHeight = Math.round( ColorPicker.imageHeight * scale );
  
  }
  // bei kleineren Bildern Original ausgeben, canvas VERKLEINERN
  // @todo @next
  // Ausserdem: Bilder laden und im Canvas zeichnen ist eigenes Modul, nicht PICKER

  // The canvas has to be resized before the image is drawn on it!
  ColorPicker.el.canvas.setAttribute( 'width', newCanvasWidth );
  ColorPicker.el.canvas.setAttribute( 'height', newCanvasHeight );

  ColorPicker.ctx.drawImage(
    ColorPicker.image,
    fromImageX,     fromImageY,
    toImageX,       toImageY,
    fromCanvasX,    fromCanvasY,
    newCanvasWidth, newCanvasHeight
  );

  // @todo warum kann man keine WEITERN Bilder laden /neu laden/neu zeichnen ???
  
  
  ColorPicker.state.imageLoaded = 1;
  
  document.body.style.cursor = 'default';

  // Jump to the image, so to speak
  jumpPosition = ( ColorPicker.el.canvas.offsetTop -ColorPicker.el.TopBar.offsetHeight -10 ); // 10 is just a random margin

  window.scrollTo( 0, jumpPosition );

  ColorPicker.detectCanvasPosition();

};

// Has to called when Material Design palette has been generated!
ColorPicker.detectCanvasPosition = function() {
  
  'use strict';
  
  ColorPicker.canvasPos         = ColorPicker.el.canvas.getBoundingClientRect(); // @todo wenn resize/original image size

};

/**
 * (Local) Image Preview
 */
ColorPicker.triggerUpload = function( event ) {
  
  'use strict';
  
  event.preventDefault();
  
console.log( 'Upload triggered' );
  
  ColorPicker.el.InputUpload.click();
  
};

ColorPicker.handleUpload = function() {
  
  'use strict';
  
  var reader = new FileReader();
  
  document.body.style.cursor = 'wait';
  
  reader.onload = function( e ) {
    
    // Bild ist in e.target.result ?!
    
    ColorPicker.image     = new Image();
    
    ColorPicker.image.addEventListener( 'load', ColorPicker.getImageDim );

    ColorPicker.image.src = e.target.result;
    
    ColorPicker.drawCanvas();
    
  };
  
  reader.readAsDataURL( ColorPicker.el.InputUpload.files[0] );
  
};

ColorPicker.getImageDim = function() {
  
  'use strict';
  
  ColorPicker.imageWidth  = this.width;
  ColorPicker.imageHeight = this.height;
  
};

/**
 * THE /CANVAS/ COLOR PICKER
 */

ColorPicker.getMousePositionOnCanvas = function( x, y ) {
  
  'use strict';
  
  return {
    x : Math.round( x - ColorPicker.canvasPos.left ),
    y : Math.round( y - ColorPicker.canvasPos.top )
  };
  
};

ColorPicker.handleMouseHoverOverCanvas = function( event ) {
  
  'use strict';
  
  event.preventDefault();
  
  var mousePos  = {},
      color     = '';

  if( ColorPicker.state.imageLoaded === 0 ) {
    return;
  }

  mousePos  = ColorPicker.getMousePositionOnCanvas( event.clientX, event.clientY );
  color     = ( ColorPicker.detectPixelColorFromCanvas( mousePos.x, mousePos.y ) );

  ColorPicker.updatePickedColor( color );
//  console.log( mousePos.x + ", " + mousePos.y + ': ' + color );
  
};

// https://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover#answer-6736135
ColorPicker.rgbToHex = function( r, g, b ) {
  
  'use strict';
  
  if( r > 255 || g > 255 || b > 255 ) {
    throw "Invalid Color Component!";
  }
  
  var value = ( ( r << 16 ) | ( g << 8 ) | b );

  return value.toString( 16 );
  
};


// https://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover#answer-6736135
ColorPicker.detectPixelColorFromCanvas = function( x, y ) {
  
  'use strict';
  
  var pixel = ColorPicker.ctx.getImageData( x, y, 1, 1 ).data,
      hex   = "#" + ( "#000000" + ColorPicker.rgbToHex( pixel[0], pixel[1], pixel[2] ) ).slice( -6 );

  return hex;
  
};

ColorPicker.updatePickedColor = function( argHex, argSetColor ) {
  
  'use strict';
  
  var hex       = ( ( 'string' === typeof argHex ) ? argHex.trim() : ColorPicker.state.color ),
      setColor  = ( ( 'boolean' === typeof argSetColor ) ? argSetColor : false );
  
  ColorPicker.el.ColorBox.style.backgroundColor = hex;
  ColorPicker.el.HexValue.innerText             = hex;

  if( setColor ) {
    ColorPicker.state.color = hex;
    
  }
  
};

ColorPicker.handleMouseOutOverCanvas = function( event ) {
  
  'use strict';
  
  event.preventDefault();
  
  if( ColorPicker.state.imageLoaded === 0 ) {
    return;
  }

  ColorPicker.updatePickedColor( ColorPicker.state.color, false );
  
};

ColorPicker.handleMouseClickOverCanvas = function( event ) {
  
  'use strict';

  event.preventDefault();

  var mousePos  = {},
      color     = '';

  if( ColorPicker.state.imageLoaded === 0 ) {
    return;
  }

  mousePos  = ColorPicker.getMousePositionOnCanvas( event.clientX, event.clientY );
  color     = ColorPicker.detectPixelColorFromCanvas( mousePos.x, mousePos.y );
  
  ColorPicker.updatePickedColor( color, true );
  
};


ColorPicker.positionElements = function() {
  
  'use strict';

  // @todo Klasisches Color Wheel (mit Bar?!) als Click->Popup

  /**
   * Get postions of "core" elemens.
   */
  var palettePos = ColorPicker.el.Palette.getBoundingClientRect(),
      topBarPos = ColorPicker.el.TopBar.getBoundingClientRect(),
      canvasPos = ColorPicker.el.canvas.getBoundingClientRect();
  
  /**
   * Hard-set position value so the TopBar can be set to position:fixed
   */

  // TopBar
  ColorPicker.el.TopBar.style.width     = ColorPicker.el.TopBar.width + 'px';
  ColorPicker.el.TopBar.style.height    = ColorPicker.el.TopBar.height + 'px';
  ColorPicker.el.TopBar.style.left      = topBarPos.left + 'px';
  ColorPicker.el.TopBar.style.top       = topBarPos.top + 'px';
  ColorPicker.el.TopBar.style.position  = 'fixed';
  
  // Platte
  ColorPicker.el.Palette.style.paddingTop = palettePos.top + 'px';
  
  // Canvas (add empty space at the bottom for scroll/jump
  ColorPicker.el.canvas.style.marginBottom = canvasPos.top + 'px';

  // Also re-calculate canvas position?!
  ColorPicker.detectCanvasPosition();

};


ColorPicker.handleClickColorWheel = function( event ) {
  
  'use strict';
  
  event.preventDefault();
  
  ColorPicker.el.ColorWheel.value = ColorPicker.state.color;
  
  ColorPicker.el.ColorWheel.click();
  
};

ColorPicker.handleColorWheelChange = function( event ) {
  
  'use strict';
  
  var color = ColorPicker.el.ColorWheel.value;
  
  ColorPicker.updatePickedColor( color, true );
  
};


/**
 * RESET
 */
ColorPicker.reset = function() {
  
  'use strict';
  
  ColorPicker.ctx.clearRect( 0, 0, 800, 500 );
  
  ColorPicker.image         = {};
  
  ColorPicker.imageWidth    = 0;
  ColorPicker.imageHeight   = 0;

  ColorPicker.reloadCounter = 0;
  
};

/**
 * Init
 */
ColorPicker.init = function() {
  
  'use strict';
  
  ColorPicker.el = {};
  
  ColorPicker.el.TopBar         = document.getElementById('TopBar');
  ColorPicker.el.InputFilename  = document.getElementById('TopBar-Input-Filename');
  ColorPicker.el.InputUpload    = document.getElementById('TopBar-Input-Upload');
  ColorPicker.el.BtnFileUpload  = document.getElementById('BtnFileUpload');
  
  ColorPicker.el.ColorWheel     = document.getElementById('TopBar-ColorWheel');

  ColorPicker.el.ColorBox       = document.getElementById('TopBar-Output-ColorBox');
  ColorPicker.el.HexValue       = document.getElementById('TopBar-Output-ColorHexValue');
  
  ColorPicker.el.InputUpload.addEventListener( 'change', ColorPicker.handleUpload );
  ColorPicker.el.BtnFileUpload.addEventListener( 'click', ColorPicker.triggerUpload );
  ColorPicker.el.ColorBox.addEventListener( 'click', ColorPicker.handleClickColorWheel );
  ColorPicker.el.ColorWheel.addEventListener( 'change', ColorPicker.handleColorWheelChange );

  ColorPicker.el.canvas         = document.getElementById('Canvas');
  ColorPicker.ctx               = ColorPicker.el.canvas.getContext('2d');
  ColorPicker.canvasPos         = ColorPicker.el.canvas.getBoundingClientRect(); // @todo wenn resize/original image size
  
  ColorPicker.el.canvas.addEventListener( 'click', ColorPicker.handleMouseClickOverCanvas );
  ColorPicker.el.canvas.addEventListener( 'mousemove', ColorPicker.handleMouseHoverOverCanvas );
  ColorPicker.el.canvas.addEventListener( 'mouseout', ColorPicker.handleMouseOutOverCanvas );
  
  ColorPicker.el.Palette        = document.getElementById('MaterialDesign');
  
  ColorPicker.image             = {};

  ColorPicker.imageWidth        = 0;
  ColorPicker.imageHeight       = 0;
  
  ColorPicker.reloadCounter     = 0;
  
  ColorPicker.state             = {
    imageLoaded : 0,
    color       : '#000'
  };
  
};
ColorPicker.init();

