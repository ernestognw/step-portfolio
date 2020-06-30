import { updateRepos } from './github/index.js';
import { updateVideos } from './youtube/index.js';
import { updatePosts } from './medium/index.js';

window.onload = () => {
  const perPage = 6;

  // Save important DOM elements in global context, so they can be accessed through every script
  window.loadMoreReposButton = document.getElementById('more-repos-button');

  // State variables
  let page = 0;

  // Initializing functions
  updateRepos(page, perPage);
  updateVideos();
  updatePosts();

  // Listeners
  loadMoreReposButton.addEventListener('click', async () => {
    page++;
    updateRepos(page, perPage);
  });
};
