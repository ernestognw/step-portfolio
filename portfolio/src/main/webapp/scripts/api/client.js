const api = {
  get: async path => {
    const data = await fetch(path);

    return data.text();
  }
  // TO DO: Add another methods to api
};

export { api };
