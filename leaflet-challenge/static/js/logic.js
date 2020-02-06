
var queryurl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL

d3.json(queryurl, function(data) {
    // console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);
    createFeatures(data.features);
  // });
  function createFeatures(earthquakeData){  
  // Define a function we want to run once for each feature in the features array
      // Give each feature a popup describing the place and time of the earthquake
      function onEachFeature(feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }
      var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
      });

      function getColor(d) {
        return d > 5 ? '#E31A1C' :
              d > 4  ? '#FC4E2A' :
              d > 3  ? '#FD8D3C' :
              d > 2 ? '#FEB24C':
              d > 1  ? '#FED976' :
                        '#FFEDA0';
      }        
      
      function radiusSize(magnitude){
        return magnitude;
      }
      var geojsonMarkerOptions = {
        radius: radiusSize(data.features.properties.mag),
        fillColor:getColor(data.features.properties.mag) ,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    
    L.geoJSON(someGeojsonFeature, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(myMap);
    
      
      // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    
    createMap(earthquakes); 
  } 
  // Sending our earthquakes layer to the createMap function
  



  function createMap(earthquakes) {
      // Define lightMap and darkmap layers
      const lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    const satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
    const outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });





  //   var center= [data.features.geometry.coordinates[0],data.features.geometry.coordinates[1]];
  //   console.log(data.features.geometry.coordinates);

    var myMap= L.map("map",{
      center: [37.0902,-95.7129],
      // center: [data.features.geometry[0],data.features.geometry[1]],
      
      zoom: 5,
      layer : [lightMap,earthquakes]
    
    });
    // Define a baseMaps object to hold our base layers

    const baseMaps = {
      'Satellite':satelliteMap,
      'Grayscale': lightMap,
      'Outdoors': outdoorMap
    },
    overlayLayer = {
      'Earthquakes': earthquakes
    };
    // Create a layer control containing our baseMaps and overlay layer of the earthquake geoJson
  
    L.control.layers(baseMaps, overlayLayer, {
      collapsed: false
    });
    lightMap.addTo(myMap);

}



// function circleMarker(features,latlng){
// //     let options={
// //     radius: features.properties.mag,
// //     fillColor: features.properties.mag,
// //     // color: "black",
// //     weight: 1,
// //     opacity: 1,
// //     fillOpacity: 0.8
// //     }

// // return L.circle(latlng,options);


    //Create Lagend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1,2,3,4,5],
        labels = [];

    //idea from url:"https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map" 
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(map);

    // magnitude color

    function getColor(d) {
      return d > 5 ? '#E31A1C' :
            d > 4  ? '#FC4E2A' :
            d > 3  ? '#FD8D3C' :
            d > 2 ? '#FEB24C':
            d > 1  ? '#FED976' :
                      '#FFEDA0';
    } 
});