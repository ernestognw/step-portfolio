import { API_KEY } from '../secret.js';

/**
 * This method is created in order to avoid API_KEY to be hardcoded in html, it allows me to keep it in secret.js
 */
const insertMapsScript = () =>
  new Promise(resolve => {
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    document.body.appendChild(script);
    script.onload = resolve;
  });

export { insertMapsScript };
