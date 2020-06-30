const baseURL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com';

const medium = {
  get: async path => {
    const data = await fetch(`${baseURL}${path}`);

    return data.json();
  }
  // TO DO: Add another methods to medium
};

export { medium };
