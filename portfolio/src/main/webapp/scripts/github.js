const baseURL = "https://api.github.com";

const github = {
  get: async path => {
    const data = await fetch(`${baseURL}${path}`, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    });

    return data.json();
  }
};

window.onload = async () => {
  const repos = await github.get(
    "/users/ernestognw/repos?sort=updated&page=1&per_page=6"
  );

  const container = document.getElementById("repositories");

  for (let repo of repos) {
    const { updated_at, name, description, language, stargazers_count } = repo;

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-5">${name}</p>
              <p class="subtitle is-6">${language}</p>
            </div>
          </div>
          <div class="content">${description}</div>
          <time class="mt-3">${updated_at}</time>
        </div>
      </div>`
    );
  }
};
