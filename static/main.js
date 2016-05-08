/**
 * Created by Stevens on 30.03.2016.
 */
var userLatLng = {
    lat: 52,
    lng: 11
};
var map;
var markers = [];
var site_url = "http://127.0.0.1:8000"

function addMarkerWithTimeout(sight, timeout) {
    window.setTimeout(function () {
        markers.push(new google.maps.Marker({
            position: {lat: sight.lat, lng: sight.lng},
            map: map,
            title: sight.name,
            animation: google.maps.Animation.DROP
        }));
    }, timeout);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 52, lng: 11},
        zoom: 9
    });

    var title = $('title').text();
    var city = title.split(' ').splice(-1);

    if (navigator.geolocation) {
        function error(err) {
            console.warn(err.message);
        }

        function success(position) {
            userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            console.log(userLatLng);
            map.setCenter(userLatLng);
            map.setZoom(13);

            // get sights from API
            console.log(site_url + "/venues_foursquare/popular/?map=true&ll=" + userLatLng.lat + ',' + userLatLng.lng);
            //$.getJSON(site_url + "/venues_foursquare/popular/?map=true&ll=" + userLatLng.lat + ',' + userLatLng.lng, function (sights) {
            $.getJSON(site_url + "/venues_foursquare/popular/?map=true&near=" + city , function (sights) {

                console.log(sights);

                // drop markers after timeout to the map
                var timeout = 50;
                for (i = 0; i < sights.length; i++) {
                    addMarkerWithTimeout(sights[i], i * timeout);
                }                                                                                                                                                                                                                                                                                                                                                                                                                          

                window.setTimeout(function () {
                    var bounds = new google.maps.LatLngBounds();
                    for( i = 0; i < sights.length; i++) {
                        bounds.extend(markers[i].getPosition());
                    }
                     map.setCenter(bounds.getCenter());
                     map.fitBounds(bounds);
                }, timeout * sights.length );   // all markers will be on their places
            });
        }

        navigator.geolocation.getCurrentPosition(success, error);
    }
    else {
        alert("Nie wspiera geolokalizacji.");
    }
}
