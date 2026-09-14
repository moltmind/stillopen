var map = '';
var mapLoc = '';
var originalAddress = '';
var mapCoords = [];
var mapCenter;

function loadGoogleMap() {
    $("#map").prependTo("#contact-content");
    $('#map').append($('#map_canvas'));
    $('#map').append($('#largerMap'));

	$('#map_canvas').show();
	$.when(loadGoogleMaps(3, '', 'english'))
	.then(function () {
	    !!google.maps;
	    mapLoc = $('#smallmapaddress').text();
	    originalAddress = mapLoc;
	    mapLoc = mapLoc.replace(/(\r\n|\n|\r|,|\r)/gm, "");

	    LoadLocation(mapLoc);
	});
}

function isMapCoordinates(value) {
    //https://stackoverflow.com/a/3518546
    return /^(\-?\d+(\.\d+)?)\,+\s*(\-?\d+(\.\d+)?)$/.test(value);
}

function LoadLocation(address) {
    setTimeout(function () {
        map = '';
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                if (isMapCoordinates(originalAddress)) {
                    mapCoords = originalAddress.split(",").map(function (item) { return parseFloat(item.trim()); });
                }

                if (mapCoords[0] !== undefined && mapCoords[1] !== undefined) {
                    mapCenter = new google.maps.LatLng(mapCoords[0], mapCoords[1]);
                }
                else {
                    mapCenter = results[0].geometry.location;
                }

                var location_type = results[0].geometry.location_type;

                var languageElemExists = document.getElementById("approximateLanguage");
                if (!isMapCoordinates(originalAddress) && languageElemExists == null) {
                    var mapWarning = '<div class="mapApproximateLanguage" id="approximateLanguage">The pin indicator on the map is only an approximate location.</div>';
                    $('#largerMap').prepend(mapWarning);
                }
                var myOptions = {
                    zoom: 17,
                    center: mapCenter,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

                var marker = new google.maps.Marker({
                    map: map,
                    position: mapCenter
                });

                google.maps.event.addListenerOnce(map, 'idle', function () {
                    mapLoaded = true;
                });
            } else {
                LoadMap();
            }
        });
    }, 1000);
}

function LoadMap(position) {

  if (!position) {
    var mapOptions = {
      center: new google.maps.LatLng(-34.397, 150.644), zoom: 17
    };
  } else {
    var mapOptions = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), zoom: 17
    };
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

var loadGoogleMaps = (function ($) {

  var now = Date.now(),

        promise;

  return function (version, apiKey, language) {

    if (promise) {
      return promise;
    }

    var deferred = $.Deferred(),

            resolve = function () {
              deferred.resolve(window.google && google.maps ? google.maps : false);
            },

            callbackName = "loadGoogleMaps_" + (now++),

            params = $.extend({
              'sensor': false
            }, apiKey ? {
              "key": apiKey
            } : {}, language ? {
              "language": language
            } : {}); ;

    if (window.google && google.maps) {

      resolve();

    } else if (window.google && google.load) {

      google.load("maps", version || 3, {
        "other_params": $.param(params),
        "callback": resolve
      });

    } else {

      params = $.extend(params, {
        'v': version || 3,
        'callback': callbackName
      });

      window[callbackName] = function () {

        resolve();

        setTimeout(function () {
          try {
            delete window[callbackName];
          } catch (e) { }
        }, 20);
      };

      $.ajax({
        dataType: 'script',
        data: params,
        url: 'https://maps.google.com/maps/api/js',
        success: function () {
        }
      });

    }

    promise = deferred.promise();

    return promise;
  };

} (jQuery));
