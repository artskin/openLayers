import 'ol/ol.css';
import {Map, View} from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';

import {getCenter} from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';

import {Draw, Modify, Snap} from 'ol/interaction.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';


// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
var extent = [0, 0, 3158, 1688];
var projection = new Projection({
  code: 'xkcd-image',
  units: 'pixels',
  extent: extent
});

var raster = new TileLayer({
  source: new OSM()
});

var source = new VectorSource();
var vector = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#ffcc33'
      })
    })
  })
});

var map = new Map({
  layers: [
    //raster, vector
    new ImageLayer({
      source: new Static({
        url: './img/floor1@2x.png',
        projection: projection,
        imageExtent: extent
      })
    }),
    vector

  ],
  target: 'map',
  view: new View({
    projection: projection,
    center: getCenter(extent),
    zoom: 2,
    maxZoom: 8
  })
});

var modify = new Modify({source: source});
map.addInteraction(modify);

var draw, snap; // global so we can remove them later
var typeSelect = document.getElementById('type');

$("#type i").click(function(){
  $(this).addClass("selected").siblings().removeClass("selected");
  var typeVal = $(this).attr("id");
  addInteractions(typeVal)
})

function addInteractions(typeVal) {
  draw = new Draw({
    source: source,
    type: typeVal
  });
  
  // draw.finishDrawing = function(){
  //   console.log("finishDrawing:结束")
  // }
  map.addInteraction(draw);
  snap = new Snap({source: source});
  
  map.addInteraction(snap);
 
  console.log(draw,snap)
  console.log(map)
  console.log(map.layers)
  console.log(map.interactions)
  console.log(map.target)
}



function removeAction(){
  map.removeInteraction(draw);
  map.removeInteraction(snap);
}

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  
  addInteractions();
};

//addInteractions();
