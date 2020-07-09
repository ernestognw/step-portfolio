import { API_KEY } from '../secret.js';
const baseURL = 'https://www.googleapis.com/youtube/v3';

/**
 * Client object for Youtube
 *
 * This is a custom implementation of a youtube client.
 * Intended to centralize interactions with its API
 *
 * TODO(ernestognw): Add a way to support paths both starting with '/' or not
 */
const youtube = {
  /**
   * To send GET requests to Youtube API
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @return {object} data in JSON resulted from the request
   */
  get: async path => {
    const data = await fetch(`${baseURL}${path}&key=${API_KEY}`);

    return data.json();
  }
  // TODO(ernestognw): Add POST method for youtube
};

export { youtube };
