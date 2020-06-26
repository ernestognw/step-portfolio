const baseURL = "https://api.github.com";

const github = {
  get: async (path) => {
    const data = await fetch(`${baseURL}${path}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    return data.json();
  },
  // TO DO: Add another methods to github
};

export { github };
