const api = {
  get: async path => {
    const data = await fetch(path);

    return data.json();
  },
  post: async (path, options = { method: 'POST' }) => {
    const data = await fetch(path, { ...options, method: 'POST' });

    return data.json();
  }
};

export { api };
