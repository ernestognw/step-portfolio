const baseURL = 'https://api.github.com';

/**
 * Client object for Github
 *
 * This is a custom implementation of a github client.
 * Intended to centralize interactions with API
 *
 * TODO(ernestognw): Add a way to support paths both starting with '/' or not
 */
const github = {
  /**
   * To send GET requests to Github API
   *
   * @param {string} path The path to add to youtube api base URL to request
   * @return {object} data in JSON resulted from the request
   */
  get: async path => {
    const data = await fetch(`${baseURL}${path}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });

    return data.json();
  }
  // TODO(ernestognw): Add POST method for github
};

export { github };
