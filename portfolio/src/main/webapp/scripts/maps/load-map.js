import styles from './map-styles.js';

/**
 * Function used to get map details, create the map and insert it to DOM
 *
 * It relies on hardcoded place data, which can be replaced in the future
 * TODO(ernestognw): Create a web API service to get the important places instead of hardcode them here
 */
const loadMap = () => {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 24.1477388, lng: -99.1768367 },
    zoom: 5,
    styles
  });

  const places = [
    {
      location:
        'TEC de Monterrey Campus Monterrey, Avenida Eugenio Garza Sada Sur, Tecnológico, Monterrey, Nuevo León',
      title: 'Monterrey Institute of Technology and Higher Education',
      comment:
        'Here is were I study. I started a major in business, but eventually I realized that I love to program. So, I changed my major and now I am in 6th semester in CS'
    },
    {
      location: 'Rio Piaxtla #604 Col. Valle del Sur',
      title: `Mom's house`,
      comment: `My mom's house. Here is were I'm making my STEP internship, and where I grew up 'till university. I'm here right now because, you know, #Coronavirus`
    },
    {
      location: 'Torre BBVA CDMX',
      title: 'Blockchain Academy Mexico',
      comment: `Here I learned everything I know. I have created many cool projects with them, and I'm still doing content in medium.com and youtube.com for them`
    }
  ];

  const placesService = new google.maps.places.PlacesService(map);

  for (const place of places) {
    const { location, title, comment } = place;

    placesService.findPlaceFromQuery(
      { query: location, fields: ['geometry'] },
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results.length > 0
        ) {
          const [
            {
              geometry: { location }
            }
          ] = results;

          const position = new google.maps.LatLng(
            location.lat(),
            location.lng()
          );
          const marker = new google.maps.Marker({ position, title });

          const infowindow = new google.maps.InfoWindow({
            content: `<div>
            <h1 class="title">${title}</h1>
            <h2 class="subtitle">${comment}</h2>
          </div>`
          });

          marker.addListener('click', () => infowindow.open(map, marker));
          marker.setMap(map);
        }
      }
    );
  }
};

export { loadMap };
