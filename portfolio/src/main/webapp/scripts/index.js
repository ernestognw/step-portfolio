import { updateRepos } from './github/index.js';
import { updateVideos } from './youtube/index.js';
import { updatePosts } from './medium/index.js';
import { updateComments, addComment } from './api/index.js';

window.onload = () => {
  // State variables
  const perPage = 6;
  const newComment = {
    username: '',
    comment: ''
  };

  // Save important DOM elements in global context, so they can be accessed through every script
  window.loadMoreReposButton = document.getElementById('more-repos-button');
  window.postForm = {
    form: document.getElementById('post-form'),
    username: document.getElementById('post-username'),
    comment: document.getElementById('post-comment')
  };

  // State variables
  let page = 0;

  // Initializing functions
  updateRepos(page, perPage);
  updateVideos();
  updatePosts();
  updateComments();

  // Listeners
  loadMoreReposButton.addEventListener('click', async () => {
    page++;
    updateRepos(page, perPage);
  });

  // Events
  postForm.username.onchange = ({ target: { value } }) =>
    (newComment.username = value);

  postForm.comment.onchange = ({ target: { value } }) =>
    (newComment.comment = value);

  postForm.form.onsubmit = event => {
    event.preventDefault();
    addComment(newComment);
  };
};
