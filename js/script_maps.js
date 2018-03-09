var slider = document.getElementById('myRange');
var slider2 = document.getElementById('myRange_deux');

// Update the current slider value (each time you drag the slider handle)



map.on('load', function() {
    // Add a geojson point source.
    // Heatmap layers also work with a vector tile source.
    map.addSource('films', {
        "type": "geojson",
        "data": "./data_film.geojson"
    });

    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

   map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 10,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                10, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                10, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);

    map.addLayer({
        "id": "heat",
        "type": "heatmap",
        "source": "films",
        "maxzoom": 15,
        "paint": {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                0, 0,
                10, 1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 0,
                15, 0.6
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(33,102,172,0)",
                0.2, "rgb(103,169,207)",
                0.4, "rgb(209,229,240)",
                0.6, "rgb(253,219,199)",
                0.8, "rgb(239,138,98)",
                1, "rgb(178,24,43)"
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 2,
                15, 25
            ],

            'heatmap-opacity': [
               "interpolate",
                ["linear"],
                ["zoom"],
                14, 1,
                15, 0,


            ],


        }

    }, 'waterway-label');

        map.addLayer({
        "id": "circle_data",
        "type": "circle",
        "source": "films",
        "maxzoom": 24,
        "paint": {
            // Increase the heatmap weight based on frequency and property magnitude
            'circle-opacity': [
               "interpolate",
                ["linear"],
                ["zoom"],
                14, 0,
                15, 1,

            ],
            'circle-stroke-opacity': [
               "interpolate",
                ["linear"],
                ["zoom"],
                14, 0,
                15, 1,

            ],
            'circle-stroke-color': "#FFFFFF",
            "circle-stroke-width": 2



        }

    }, 'waterway-label');

    slider.addEventListener('input', function(e) {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty('heat', 'heatmap-radius', parseInt(50 - e.target.value));
    });

    slider2.addEventListener('input', function(e) {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty('heat', 'heatmap-intensity', e.target.value / 100);
        console.log(e.target.value / 100);
    });

    map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['circle_data'] });

  // if the features have no info, return nothing
  if (!features.length) {
    return;
  }

  var feature = features[0];

  // Populate the popup and set its coordinates
  // based on the feature found
  var popup = new mapboxgl.Popup()
  .setLngLat(feature.geometry.coordinates)
  .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'> <h5> '+ feature.properties.titre+  '</h5>' +
  '<ul class=\'list-group\'>' +
  '<li class=\'list-group-item\'> Réalisateur: ' + feature.properties.realisateur + ' </li>'+
  '<li class=\'list-group-item\'> Date de fin de tournage: ' + feature.properties.date_fin + ' </li>'+
  '<li class=\'list-group-item\'> Type de tournage: ' + feature.properties.type_de_tournage + ' </li>')
  .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'
map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['circle_data'] });
  map.getCanvas().style.cursor = features.length ? 'pointer' : '';
});


});


var bar = new ProgressBar.Circle(container, {
  color: '#DA667B',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 8,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 2000,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#aaa', width: 1 },
  to: { color: '#DA667B', width: 6 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 1000);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value);
    }

  }
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '2rem';

bar.animate(0.650);  // Number from 0.0 to 1.0
