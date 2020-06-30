const baseURL = 'https://api.github.com';

const github = {
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
