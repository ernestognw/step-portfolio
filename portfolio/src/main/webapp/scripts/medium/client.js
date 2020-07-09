/**
 * baseURL relies on a service that translates rss to json,
 * but is not the official Medium API.
 *
 * If any alternative found, replace
 */
const baseURL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com';

/**
 * Client object for Youtube
 *
 * This is a custom implementation of a youtube client.
 * Intended to centralize interactions with API
 *
 * TODO(ernestognw): Add a way to support paths both starting with '/' or not
 */
const medium = {
  /**
   * To send GET requests to Medium API
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @return {object} data in JSON resulted from the request
   */
  get: async path => {
    const data = await fetch(`${baseURL}${path}`);

    return data.json();
  }
  // TODO(ernestognw): Add POST method for medium
};

export { medium };
