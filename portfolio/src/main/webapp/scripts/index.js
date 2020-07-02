import { updateRepos } from './github/index.js';
import { updateVideos } from './youtube/index.js';
import { updatePosts } from './medium/index.js';
import { addComments } from './api/index.js';
import { insertMapsScript } from './maps/insert-maps-script.js';
import { loadMap } from './maps/load-map.js';

window.onload = async () => {
  const perPage = 6;

  // Save important DOM elements in global context, so they can be accessed through every script
  window.loadMoreReposButton = document.getElementById('more-repos-button');

  // State variables
  let page = 0;

  // Initializing functions
  updateRepos(page, perPage);
  updateVideos();
  updatePosts();
  addComments();
  // Be careful! This google script blocks rendering
  // It should ALWAYS be after the other ones
  await insertMapsScript();
  loadMap();

  // Listeners
  loadMoreReposButton.addEventListener('click', async () => {
    page++;
    updateRepos(page, perPage);
  });
};
