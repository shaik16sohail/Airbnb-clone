
	mapboxgl.accessToken = mapToken;
  let me=some;
  if(some.length==0)
    me=[78.4772,17.4065];
  
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: me, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });
    const marker1 = new mapboxgl.Marker()
        .setLngLat(me)
        .addTo(map);
