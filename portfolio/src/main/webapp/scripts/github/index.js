import { github } from './client.js';

const updateRepos = async (page, per_page) => {
  window.loadMoreReposButton.disabled = true;
  window.loadMoreReposButton.classList.add('is-loading');

  const repos = await github.get(
    `/users/ernestognw/repos?&sort=updated&page=${page}&per_page=${per_page}`
  );

  const container = document.getElementById('repositories');

  for (let repo of repos) {
    const {
      updated_at,
      name,
      description,
      language,
      stargazers_count,
      full_name
    } = repo;

    container.insertAdjacentHTML(
      'beforeend',
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
      </a>`
    );

    window.loadMoreReposButton.disabled = false;
    window.loadMoreReposButton.classList.remove('is-loading');
  }
};

export { updateRepos };
