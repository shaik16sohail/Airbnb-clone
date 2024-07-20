
mapboxgl.accessToken = mapConnect;
let center=[72.8777,19.0760];
  const map = new mapboxgl.Map({
	  container: 'map', // container ID
	  center:center,// , // starting position [lng, lat]. Note that lat must be set between -90 and 90
	  zoom: 6 // starting zoom
  });
  const marker=new mapboxgl.Marker({color:"red"})
  .setLngLat(center)
  .setPopup(new mapboxgl.Popup({offset: 25})
  .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
  .addTo(map);