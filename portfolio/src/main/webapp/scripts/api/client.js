/**
 * Client object for portfolio API
 *
 * This is the client to communicate with the API
 * working under the same URL as the page
 */
const api = {
  /**
   * To send GET requests to API
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @return {object} data in JSON resulted from the request
   */
  get: async path => {
    const data = await fetch(path);

    return data.json();
  },
  /**
   * To send POST requests to API
   * It sets the method as POST by default and pass other options
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @param {object} options The config options. It @implements same options as fetch
   *    and its default to an empty object to prevent error in spreading during fetch
   * @return {object} data in JSON resulted from the request
   */
  post: async (path, options = {}) => {
    const data = await fetch(path, { ...options, method: 'POST' });

    return data.json();
  },
  /**
   * To send PUT requests to API
   * It sets the method as PUT by default and pass other options
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @param {object} options The config options. It @implements same options as fetch
   *    and its default to an empty object to prevent error in spreading during fetch
   * @return {object} data in JSON resulted from the request
   */
  put: async (path, options = {}) => {
    const data = await fetch(path, { ...options, method: 'PUT' });

    return data.json();
  },
  /**
   * To send DELETE requests to API
   * It sets the method as DELETE by default and pass other options
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @param {object} options The config options. It @implements same options as fetch
   *    and its default to an empty object to prevent error in spreading during fetch
   * @return {object} data in JSON resulted from the request
   */
  delete: async (path, options = {}) => {
    const data = await fetch(path, { ...options, method: 'DELETE' });

    return data.json();
  }
};

export { api };
