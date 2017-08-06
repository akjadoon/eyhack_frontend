// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
  };
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

// This adds the map
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v9',
  // initial position in [long, lat] format
  center: [22.3864, -24.6],
  // initial zoom
  zoom: 13,
  scrollZoom: false
});

var stores = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.185936,
          22.280770, 
        ]
      },
      "properties": {
        "phoneFormatted": "(852) 6234-7336",
        "name": "Asfandyar's Steakhouse",
        "address": "33 Vikram St",
        "city": "Causeway Bay",
        "country": "Hong Kong",
        "predictedDensity": 42,
        "predictedWaitTime": 90,
        "maxDensity": 74,
        "RID": 0
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.181487,
          22.280623, 
        ]
      },
      "properties": {
        "phoneFormatted": "(852) 9507-8357",
        "name": "Tanay's Ramen stand",
        "address": "41 Shayan St",
        "city": "Causeway Bay",
        "country": "Hong Kong",
        "predictedDensity": 22,
        "predictedWaitTime": 550,
        "maxDensity": 24,
        "RID": 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.176949,
          22.280792, 
        ]
      },
      "properties": {
        "phoneFormatted": "(852) 6387-9338",
        "name": "Jai's Burger Joint",
        "address": "7 Tavish Rd",
        "city": "Causeway Bay",
        "country": "Hong Kong",
        "predictedDensity": 14,
        "predictedWaitTime": 250,
        "maxDensity": 18,
        "RID": 2
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.189701,
          22.279940, 
        ]
      },
      "properties": {
        "phoneFormatted": "(852) 7337-9338",
        "name": "Sharat's Shakes",
        "address": "Corner of 4 Ishan's st",
        "city": "Causeway Bay",
        "country": "Hong Kong",
        "predictedDensity": 36,
        "predictedWaitTime": 850,
        "maxDensity": 44
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.186436,
          22.284262, 
        ]
      },
      "properties": {
        "phoneFormatted": "(852) 547-9338",
        "name": "Rando Seafood place",
        "address": "221 Fuk Man Rd",
        "city": "Causeway Bay",
        "country": "Hong Kong",
        "predictedDensity": 14,
        "predictedWaitTime": 120,
        "maxDensity": 15
      }
    }
]
  };
// This adds the data to the map
map.on('load', function (e) {
  // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
  map.addSource("places", {
    "type": "geojson",
    "data": stores
  });
  // Initialize the list
  buildLocationList(stores);
  $.get("http://httpbin.org/get", function(data, status){
    console.log(data);
  });

});

// This is where your interactions with the symbol layer used to be
// Now you have interactions with DOM markers instead
stores.features.forEach(function(marker, i) {
  // Create an img element for the marker
  var el = document.createElement('div');
  el.id = "marker-" + i;
  el.className = 'marker';
  // Add markers to the map at all points
  new mapboxgl.Marker(el, {offset: [-28, -46]})
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

  el.addEventListener('click', function(e){
      // 1. Fly to the point
      flyToStore(marker);

      // 2. Close all other popups and display popup for clicked store
      createPopUp(marker);

      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');

      e.stopPropagation();
      if (activeItem[0]) {
         activeItem[0].classList.remove('active');
      }

      var listing = document.getElementById('listing-' + i);
      listing.classList.add('active');

  });
});


function flyToStore(currentFeature) {
  map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
<<<<<<< HEAD
   
=======
>>>>>>> e19213d7b6ab1f7b1c96319f34d49c04ed0f580e
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();


  var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>Restaurant</h3>' +
          '<h4>' + currentFeature.properties.address + '</h4>')
        .addTo(map);
}


function buildLocationList(data) {
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    var prop = currentFeature.properties;

    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = "listing-" + i;

    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.address;

    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }

    map.addControl(new mapboxgl.NavigationControl());

    link.addEventListener('click', function(e){
      // Update the currentFeature to the store associated with the clicked link
      var clickedListing = data.features[this.dataPosition];

      // 1. Fly to the point
      flyToStore(clickedListing);

      // 2. Close all other popups and display popup for clicked store
      createPopUp(clickedListing);

      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');

      if (activeItem[0]) {
         activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');

    });
  }
}
