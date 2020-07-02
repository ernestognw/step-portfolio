const api = {
  get: async path => {
    const data = await fetch(path);

    return data.json();
  }
  // TODO(ernestognw): Add POST method for api
};

export { api };
