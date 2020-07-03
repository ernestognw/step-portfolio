const api = {
  get: async path => {
    const data = await fetch(path);

    return data.json();
  },
  post: async (path, options = { method: 'POST' }) => {
    const data = await fetch(path, { ...options, method: 'POST' });

    return data.json();
  },
  put: async (path, options = { method: 'PUT' }) => {
    const data = await fetch(path, { ...options, method: 'PUT' });

    return data.json();
  },
  delete: async (path, options = { method: 'DELETE' }) => {
    const data = await fetch(path, { ...options, method: 'DELETE' });

    return data.json();
  }
};

export { api };
