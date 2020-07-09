import { github } from './client.js';

const updateRepos = async ({ page, pageSize: perPage }) => {
  window.loadMoreReposButton.disabled = true;
  window.loadMoreReposButton.classList.add('is-loading');

  const repos = await github.get(
    `/users/ernestognw/repos?&sort=updated&page=${page}&per_page=${perPage}`
  );

  const container = document.getElementById('repositories');

  for (let repo of repos) {
    const {
      updated_at: updatedAt,
      name,
      description,
      language,
      stargazers_count: stars,
      full_name: fullName
    } = repo;

    container.insertAdjacentHTML(
      'beforeend',
      `<a class="card" href="https://github.com/${fullName}" rel="noopener noreferrer" target="_blank">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-5">${name}</p>
              <p class="subtitle is-6">${language}</p>
            </div>
          </div>
          <div class="content is-small">${description}</div>
          <time class="mt-3 mt-auto">${moment(updatedAt).fromNow()}</time> 
          <span class="icon">
            <i class="fa fa-star"></i>
          </span>
          <span>${stars}</span>
        </div>
      </a>`
    );

    window.loadMoreReposButton.disabled = false;
    window.loadMoreReposButton.classList.remove('is-loading');
  }
};

export { updateRepos };
