import { API_KEY } from '../secret.js';
const baseURL = 'https://www.googleapis.com/youtube/v3';

const youtube = {
  get: async path => {
    const data = await fetch(`${baseURL}${path}&key=${API_KEY}`);

    return data.json();
  }
  // TODO(ernestognw): Add POST method for youtube
};

export { youtube };
