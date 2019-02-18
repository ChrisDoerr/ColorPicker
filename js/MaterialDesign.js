/**
 * [MaterialDesign.js]
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

var MaterialDesign = {};

MaterialDesign.handleClick = function( event ) {

  'use strict';

  event.preventDefault();
  
  var color = this.getAttribute( 'data-color' );

  // @todo how to handle dependcy?!
  ColorPicker.updatePickedColor( color, true );
  
};

MaterialDesign.handleHover = function( event ) {
  
  'use strict';
  
  event.preventDefault();
  
  var color = this.getAttribute( 'data-color' );
  
  ColorPicker.updatePickedColor( color, false );
  
};

MaterialDesign.handleOut = function( event ) {
  
  'use strict';
  
  event.preventDefault();
  
  ColorPicker.updatePickedColor( ColorPicker.state.color, false );
  
};


MaterialDesign.levelBoxWidth = function() {
  
  'use strict';
  
  var maxWidth  = 0,
      boxes     = document.querySelectorAll('.materialDesign-colorBox' ),
      i         = 0,
      dimBoxes  = boxes.length;

  // Determine maxWidth
  for( i = 0; i < dimBoxes; i += 1 ) {
    
    if( maxWidth < boxes[i].offsetWidth ) {
        maxWidth = boxes[i].offsetWidth;
    }
    
  }

  // Apply maxWidth to all boxes
  for( i = 0; i < dimBoxes; i += 1 ) {
    
    boxes[i].style.width = maxWidth + 'px';
    
  }
  
};

MaterialDesign.levelItemHeight = function() {
  
  'use strict';
  
  var maxHeight = 0,
      items     = document.querySelectorAll('.materialDesign-item'),
      i         = 0,
      dimItems  = items.length;
  
  // Determine maxHeight
  for( i = 0; i < dimItems; i +=1 ) {
    
    if( maxHeight < items[i].offsetHeight ) {
      maxHeight = items[i].offsetHeight;
    }
    
  }
  
  // Apply new maxHeight to all items
  for( i = 0; i < dimItems; i +=1 ) {
    
    items[0].style.height = maxHeight + 'px';
    
  }
    
};


MaterialDesign.generateHtml = function( argDisplayText ) {
  
  'use strict';
  
  var displayText = ( ( 'boolean' === typeof argDisplayText ) ? argDisplayText : false ),
      el          =  document.createDocumentFragment(),
      setNames    = Object.keys( MaterialDesign.palette );
  
  // Reset
  MaterialDesign.el.container.innerHTML = '';
  
  setNames.forEach( function( set ) {
    
    var elItem = {},
        elName = {},
        weights  = {};
    
    elItem = document.createElement('div');
    elItem.setAttribute( 'class', 'materialDesign-item' );

    elName = document.createElement('div');
    
    elName.setAttribute( 'class', 'materialDesign-setName' );
    elName.innerText = set;
    
    elItem.appendChild( elName );

    weights = Object.keys( MaterialDesign.palette[ set ] );
    
    weights.forEach( function( index ) {
      
      var color       = MaterialDesign.palette[ set ][ index ],
          elColorBox  = document.createElement('div');
      
      elColorBox.setAttribute( 'class', 'materialDesign-colorBox' );
      elColorBox.setAttribute( 'data-color', color );
      elColorBox.style.backgroundColor  = color;
      
      if( displayText ) {
        elColorBox.innerText              = color;
      }
      else {
        elColorBox.innerHTML = "&nbsp;";
      }

      elColorBox.addEventListener( 'click', MaterialDesign.handleClick );
      elColorBox.addEventListener( 'mouseover', MaterialDesign.handleHover );
      elColorBox.addEventListener( 'mouseout', MaterialDesign.handleOut );
      
      elItem.appendChild( elColorBox );
      
    });
    
    el.appendChild( elItem );
    
  });
  
  MaterialDesign.el.container.appendChild( el );

  MaterialDesign.levelItemHeight();
  MaterialDesign.levelBoxWidth();


  // Update canvas position!
  ColorPicker.positionElements();
  
};

/**
 * Init
 */
MaterialDesign.init = function() {
  
  'use strict';
  
  MaterialDesign.el = {};
  
  MaterialDesign.el.data      = document.getElementById('MaterialDesign-Palette');
  MaterialDesign.el.container = document.getElementById('MaterialDesign');

  MaterialDesign.palette = JSON.parse( MaterialDesign.el.data.innerText );
  
  MaterialDesign.generateHtml();
  
};
MaterialDesign.init();

