const baseURL = "https://api.github.com";
let page = 0;
const per_page = 6;
let loadMoreReposButton;

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

const updateRepos = async () => {
  page++;
  loadMoreReposButton.disabled = true;
  loadMoreReposButton.classList.add('is-loading');

  const repos = await github.get(
    `/users/ernestognw/repos?&sort=updated&page=${page}&per_page=${per_page}`
  );

  const container = document.getElementById("repositories");

  for (let repo of repos) {
    const { updated_at, name, description, language, stargazers_count, full_name } = repo;

    container.insertAdjacentHTML(
      "beforeend",
      `<a class="card" href="https://github.com/${full_name}" rel="noopener noreferrer" target="_blank">
        <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-5">${name}</p>
                <p class="subtitle is-6">${language}</p>
              </div>
            </div>
            <div class="content is-small">${description}</div>
            <time class="mt-3 mt-auto">${moment(updated_at).fromNow()}</time> 
            <span class="icon">
              <i class="fa fa-star"></i>
            </span>
            <span>${stargazers_count}</span>
          </div>
        </a>
      `);

    loadMoreReposButton.disabled = false;
    loadMoreReposButton.classList.remove('is-loading');
  }
}

window.onload = () => {
  loadMoreReposButton = document.getElementById('more-repos-button');

  updateRepos()

  loadMoreReposButton.addEventListener('click', updateRepos)
};
