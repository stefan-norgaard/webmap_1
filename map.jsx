'use strict'        // let the browser know we're serious

// debug statement letting us know the file is loaded
console.log('Loaded map.jsx')

// your mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlZmFuLW5vcmdhYXJkIiwiYSI6ImNrNnIxazUwMTAwZWEzbHRncnAwbXhubmcifQ.g1gLf2wnq9iaQk20mMnDpA'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/basic-v9',
    center: [-73.93324, 40.80877],
    zoom: 15
});

var trees_url = "./data/NYC_Street_Trees.geojson"

map.on('load',function(){

      // NYPL map warper raster tile service as source
map.addSource('nypl',{
    'type':'raster',
    'tiles':["http://maps.nypl.org/warper/maps/tile/27677/{z}/{x}/{y}.png "],
    "tileSize": 256,
  });
  // create a layer from the NYPL tiles
  map.addLayer({
    'id':'nypl-m',
    'type':'raster',
    'source':'nypl',
    'paint':{
      'raster-opacity':0.85
    }
  });
    // define a 'source' for your point dataset
    map.addSource('trees_data',{
      'type':'geojson',
      'data': "./data/NYC_Street_Trees.geojson"
    });
    // add a new layer with your points
    map.addLayer({
      'id':'trees',
      'type':'circle',
      'source':'trees_data',
      'paint':{
        'circle-radius':4,
        'circle-color': '#349f27',
        'circle-opacity':0.7
      },
    })
  var buildings_url = "./data/Harlem_Buildings.geojson"

  // define a 'source' for your polygons dataset
  map.addSource('buildings',{
    'type':'geojson',
    'data': buildings_url,
  });
  // add a new layer with your polygons
  map.addLayer({
    'id':'buildings',
    'type':'fill',
    'source':'buildings',
    'paint':{
      'fill-color':'#888888',
      'fill-outline-color':'#000000'
    }
  })
  
//  map.addSource('bronx_map',{
//    'type':'image',
//    'url': './data/nypl_map-warper-harlem-river.jpg',
//    'coordinates': [
//      [-73.9449181508732636,40.8145796032861199],
//      [-73.9217935462128537,40.8145796032861199],
//      [-73.9217935462128537,40.7983542111030317],
//      [-73.9449181508732636,40.7983542111030317]
//    ]
//  });
//  map.addLayer({
//    'id':'map_overlay',
//    'type':'raster',
//    'source':'bronx_map',
//    'paint':{
//      'raster-opacity':0.85
//    }
//  });

});

// when the user does a 'click' on an element in the 'trees' layer...
map.on('click', 'trees', function(e) {
  // get the map coordinates of the feature
  var coordinates = e.features[0].geometry.coordinates.slice();
  // get its species name from the feature's attributes
  var species = e.features[0].properties.spc_common;

  // and create a popup on the map
  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(species)
  .addTo(map);
});
  
// make the cursor a pointer when over the tree
map.on('mouseenter', 'trees', function() {
  map.getCanvas().style.cursor = 'pointer';
});
  
// back to normal when it's not
map.on('mouseleave', 'trees', function() {
  map.getCanvas().style.cursor = '';
});

