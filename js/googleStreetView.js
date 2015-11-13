var panorama;
function initialize(lat, lon) {
    panorama = new google.maps.StreetViewPanorama(
	document.getElementById( 'street-view' ),
	{ position: { lat: lat, lng: lon },
	  pov:      { heading: 165, pitch: 0 },
	  zoom: 1
	});
}
