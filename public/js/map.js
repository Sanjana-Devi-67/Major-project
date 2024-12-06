    /* let mapApi=mapApi;
    console.log(mapApi); */
    // maptilersdk.config.apiKey =mapApi ;
    // const map = new maptilersdk.Map({
    //   container: 'map', // container's id or the HTML element in which the SDK will render the map
    //   style: maptilersdk.MapStyle.STREETS,
    //   center: [77.5937,12.9719 ], // starting position [lng, lat]
    //   zoom: 9// starting zoom
    // });
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
 
    const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
        .setPopup(
             new mapboxgl.Popup({offset:25}).setHTML(
                `<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`))
        .addTo(map);