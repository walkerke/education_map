// 'use strict';
//var sidebar = document.getElementById('sidebar');

var levels = [{
  group: 'less_than_hs',
  hex: "#e41a1c"
}, {
  group: 'high_school',
  hex: '#ff7f00'
}, {
  group: 'some_college',
  hex: '#ffff33'
}, {
  group: 'bachelors',
  hex: '#4daf4a'
}, {
  group: 'graduate',
  hex: '#377eb8'
}]; 

var layerids = [{id: 'education-25', minzoom: 11, maxzoom: 15, textid: 'layer25'}, 
                {id: 'education-50', minzoom: 9, maxzoom: 10.99999, textid: 'layer50'}, 
                {id: 'education-100', minzoom: 7, maxzoom: 8.99999, textid: 'layer100'}, 
                {id: 'education-200', minzoom: 5, maxzoom: 6.99999, textid: 'layer200'}, 
                {id: 'education-500', minzoom: 3, maxzoom: 4.99999, textid: 'layer500'}]; 


mapboxgl.accessToken = 'pk.eyJ1Ijoia3dhbGtlcnRjdSIsImEiOiJMRk9JSmRvIn0.l1y2jHZ6IARHM_rA1-X45A';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kwalkertcu/cizbggjq6006w2rnqzkmf6i0k',
    zoom: 12,
    maxZoom: 14.5, 
    minZoom: 3, 
    hash: true,
    center: [-122.447303, 37.753574]
});


// Function to determine current map bounds
function current_bounds() {
  var bounds = map.getBounds(); 
  var sw = bounds.getSouthWest(); 
  var ne = bounds.getNorthEast(); 
  // Return an array of sw and ne screen coordinates
  return [map.project(sw), map.project(ne)]; 
}

// Function to figure out current layer id by zoom level
function current_layer() {
  var zm = map.getZoom(); 
  if (zm >= 11) {
    return "education-25"; 
  } else if (zm >= 9 && zm < 11) {
    return "education-50"; 
  } else if (zm >= 7 && zm < 9) {
    return "education-100"; 
  } else if (zm >= 5 && zm < 7) {
    return "education-200"; 
  } else {
    return "education-500"; 
  }
} 

function get_percentages() {
  var all = map.queryRenderedFeatures(current_bounds(),
            {layers: [current_layer()]}); 
  var total = all.length; 
  var arr = levels.map(function(x) {
    var q = map.queryRenderedFeatures(current_bounds(),
        {layers: [current_layer()],
         filter: ["==", "level", x.group]}); 
     var prop = q.length / total; 
     var pct =  100 * (Math.round(prop * 10000) / 10000); 
     if (x.group == "less_than_hs") {
       var name = "Less than HS"; 
     } else if (x.group == "high_school") {
       var name = "High school"; 
     } else if (x.group == "some_college") {
       var name = "Some college"; 
     } else if (x.group == "bachelors") {
       var name = "Bachelor's"; 
     } else if (x.group == "graduate") {
       var name = "Graduate"; 
     }
     return {Level: name, Percent: pct}; 
  }); 
  return arr; 
} 

map.on('load', function () {

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-right');

    map.addLayer({
        'id': 'education-25',
        'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://kwalkertcu.1utb0sx3'
        },
        'source-layer': 'us_dasy_25-b19smm',
        // 'minzoom': 11,
        'paint': {
            // make circles larger as the user zooms in
            'circle-radius': {
                'base': 1.5,
                'stops': [[11, 1.5], [22, 10]]
            },
            // color circles by level
            'circle-color': {
                property: 'level',
                type: 'categorical',
                stops: [
                    ['high_school', '#ff7f00'],
                    ['some_college', '#ffff33'],
                    ['bachelors', '#4daf4a'],
                    ['graduate', '#377eb8'],
                    ['less_than_hs', '#e41a1c']]
            }
        }
    }, 'waterway-label');
    map.addLayer({
        'id': 'education-50',
        'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://kwalkertcu.7zzum1a3'
        },
        'source-layer': 'us_dasy_50-dymmgx',
        // 'minzoom': 9,
        // 'maxzoom': 10.99999,
        'paint': {
            // make circles larger as the user zooms in
            'circle-radius': {
                'base': 1,
                'stops': [[9, 1], [11, 1.5]]
            },
            // color circles by level
            'circle-color': {
                property: 'level',
                type: 'categorical',
                stops: [
                    ['high_school', '#ff7f00'],
                    ['some_college', '#ffff33'],
                    ['bachelors', '#4daf4a'],
                    ['graduate', '#377eb8'],
                    ['less_than_hs', '#e41a1c']]
            }
        }
    }, 'waterway-label');
    map.addLayer({
        'id': 'education-100',
        'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://kwalkertcu.3gj3ago4'
        },
        'source-layer': 'us_dasy_100-cfqt1f',
        // 'minzoom': 7,
        // 'maxzoom': 8.99999,
        'paint': {
            // make circles larger as the user zooms in
            'circle-radius': {
                'base': 0.7,
                'stops': [[7, 0.7], [9, 1]]
            },
            // color circles by level
            'circle-color': {
                property: 'level',
                type: 'categorical',
                stops: [
                    ['high_school', '#ff7f00'],
                    ['some_college', '#ffff33'],
                    ['bachelors', '#4daf4a'],
                    ['graduate', '#377eb8'],
                    ['less_than_hs', '#e41a1c']]
            }
        }
    }, 'waterway-label');
    map.addLayer({
        'id': 'education-200',
        'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://kwalkertcu.38ss9mwe'
        },
        'source-layer': 'us_dasy_200-b8i5jx',
        // 'minzoom': 5,
        // 'maxzoom': 6.99999,
        'paint': {
            // make circles larger as the user zooms in
            'circle-radius': {
                'base': 0.5,
                'stops': [[5, 0.5], [7, 0.7]]
            },
            // color circles by level
            'circle-color': {
                property: 'level',
                type: 'categorical',
                stops: [
                    ['high_school', '#ff7f00'],
                    ['some_college', '#ffff33'],
                    ['bachelors', '#4daf4a'],
                    ['graduate', '#377eb8'],
                    ['less_than_hs', '#e41a1c']]
            }
        }
    }, 'waterway-label');
    map.addLayer({
        'id': 'education-500',
        'type': 'circle',
        'source': {
            type: 'vector',
            url: 'mapbox://kwalkertcu.bvg8or44'
        },
        'source-layer': 'us_dasy_500-4vo2ld',
        // 'minzoom': 3,
        // 'maxzoom': 4.99999,
        'paint': {
            // make circles larger as the user zooms in
            'circle-radius': {
                'base': 0.3,
                'stops': [[3, 0.3], [5, 0.5]]
            },
            // color circles by level
            'circle-color': {
                property: 'level',
                type: 'categorical',
                stops: [
                    ['high_school', '#ff7f00'],
                    ['some_college', '#ffff33'],
                    ['bachelors', '#4daf4a'],
                    ['graduate', '#377eb8'],
                    ['less_than_hs', '#e41a1c']]
            }
        }
    }, 'waterway-label');
    
    // Set zoom range for each layer
    
    layerids.map(function(id) {
      
      map.setLayerZoomRange(id.id, id.minzoom, id.maxzoom); 
      
    }); 
    
    // Here, we build the chart

    var data = get_percentages();
    
    var svg = dimple.newSvg("#d3chart", 300, 250);
  
    var mychart = new dimple.chart(svg, data);
    // mychart.setBounds(75, 30, 300, 300);
    
    mychart.setMargins(10, 10, 10, 40); 
    
    // Customize the x axis
    var x = mychart.addMeasureAxis("x", "Percent");
    
    x.showGridlines = false; 
    x.title = "Percent of total"; 
    // x.overrideMax = 50; 
    
    // Customize the y axis
    var y = mychart.addCategoryAxis("y", "Level");
    
    y.addOrderRule("Percent", false); 
    
    //y.addOrderRule(["Less than HS", "High school", "Some college", "Bachelor's", "Graduate"]);
    
    y.hidden = true; 
  
    mychart.addSeries("Level", dimple.plot.bar);
    mychart.assignColor("Less than HS", "#e41a1c");
    mychart.assignColor("High school", "#ff7f00");
    mychart.assignColor("Some college", "#ffff33");
    mychart.assignColor("Bachelor's", "#4daf4a");
    mychart.assignColor("Graduate", "#377eb8");

    // Change the chart when the button is clicked
    
    document.getElementById('button-click').addEventListener('click', function () {
    
      mychart.data = get_percentages();
      mychart.draw(1000);
      y.shapes.selectAll("*").attr("fill", "white"); 
      x.shapes.selectAll("*").attr("fill", "white"); 
      x.titleShape.attr("fill", "white"); 
      x.shapes.selectAll("*").style("font-family", "Open Sans"); 
      x.titleShape.style("font-size", "103%"); 
      x.titleShape.style("font-family", "Open Sans"); 
  
  }); 
  

});




// Fly-to links

document.getElementById('new-york').addEventListener('click', function () {
    map.flyTo({
        center: [-74.0066, 40.7770], zoom: 11.01
    });
});
document.getElementById('los-angeles').addEventListener('click', function () {
    map.flyTo({
        center: [-118.2724, 34.0807], zoom: 11.01
    });
});
document.getElementById('chicago').addEventListener('click', function () {
    map.flyTo({
        center: [-87.6138, 41.8845], zoom: 11.01
    });
});
document.getElementById('dfw').addEventListener('click', function () {
    map.flyTo({
        center: [-97.1496, 32.8065], zoom: 11.01
    });
});
document.getElementById('atlanta').addEventListener('click', function () {
    map.flyTo({
        center: [-84.4986, 33.8486], zoom: 11.01
    });
});


// Generate click event for legend filter

var filter = ["in", "level", "less_than_hs", "high_school", "some_college", "bachelors", "graduate"]; 

document.getElementById('legend10').addEventListener('click', function(e) {

  var level = e.target.id; 
  var layer = current_layer(); 
  var level_span = level + '-span'; 
  
  // get the corresponding hex value for the level
  var level_index = levels.map(function(x) {
    return x.group; 
  }).indexOf(level); 
  
  var hex = levels[level_index].hex; 
  
  var el = document.getElementById(level_span);
  
  // check if the level is in the target array; if not, then add it
  if (filter.indexOf(level, 1) === -1) {
    filter.push(level); 
    map.setFilter(layer, filter); 
    el.style.backgroundColor = hex; 
    el.style.color = "#ffffff"; 
  // otherwise, remove it
  } else {
    index = filter.indexOf(level); 
    filter.splice(index, 1); 
    map.setFilter(layer, filter); 
    el.style.backgroundColor = '#c5c8cc'; 
    el.style.color = '#c5c8cc'; 
  }
    
}); 

// Preserve filter on zoom

layerids.map(function(x) {
  
  map.on('zoom', function() {
    
    map.setFilter(x.id, filter); 
    
  }); 
  
}); 

// Modify dot info in sidebar

layerids.map(function(x) {
  
  map.on('zoom', function() {
    
    var d = document.getElementById(x.textid); 
    var zoom = map.getZoom(); 
    
    if (zoom >= x.minzoom && zoom <= x.maxzoom ) {
      d.style.display = 'block'; 
    } else {
      d.style.display = 'none'; 
    }
  }); 
  
}); 



