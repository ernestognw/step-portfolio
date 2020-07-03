import { updateRepos } from './github/index.js';
import { updateVideos } from './youtube/index.js';
import { updatePosts } from './medium/index.js';
import { setFilterState, updateComments, addComment } from './api/index.js';

window.onload = () => {
  // State variables
  const githubParams = {
    page: 1,
    pageSize: 6
  };
  const commentsParams = {
    page: 1,
    pageSize: 5,
    order: 'desc',
    orderBy: 'createdAt'
  };
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
  window.postFilters = {
    latestButton: document.getElementById('latest-button'),
    popularButton: document.getElementById('popular-button'),
    pageSizeInput: document.getElementById('page-size-input'),
    orderSelect: document.getElementById('order-select'),
    pageNumber: document.getElementById('page-number'),
    pagesTotal: document.getElementById('pages-total'),
    commentsQty: document.getElementById('comments-qty'),
    prevPageButton: document.getElementById('prev-page-button'),
    nextPageButton: document.getElementById('next-page-button'),
    firstPageButton: document.getElementById('first-page-button'),
    lastPageButton: document.getElementById('last-page-button'),
    refreshComments: document.getElementById('refresh-comments')
  };

  // Initializing functions
  updateRepos(githubParams);
  updateVideos();
  updatePosts();
  setFilterState(commentsParams);
  updateComments(commentsParams);

  // Listeners
  loadMoreReposButton.addEventListener('click', async () => {
    page++;
    updateRepos(githubParams);
  });

  postFilters.latestButton.addEventListener('click', async () => {
    commentsParams.orderBy = 'createdAt';
    setFilterState(commentsParams);
    updateComments(commentsParams);
  });

  postFilters.popularButton.addEventListener('click', async () => {
    commentsParams.orderBy = 'likes';
    setFilterState(commentsParams);
    updateComments(commentsParams);
  });

  postFilters.prevPageButton.addEventListener('click', async () => {
    commentsParams.page--;
    setFilterState(commentsParams);
    updateComments(commentsParams);
  });

  postFilters.nextPageButton.addEventListener('click', async () => {
    commentsParams.page++;
    setFilterState(commentsParams);
    updateComments(commentsParams);
  });

  postFilters.firstPageButton.addEventListener('click', async () => {
    commentsParams.page = 1;
    setFilterState(commentsParams);
    updateComments(commentsParams);
  });

  postFilters.lastPageButton.addEventListener('click', async () => {
    commentsParams.page = postFilters.pagesTotal.innerText;
    setFilterState(commentsParams);
    updateComments(commentsParams);
  });

  postFilters.refreshComments.addEventListener('click', async () => {
    setFilterState(commentsParams);
    updateComments(commentsParams);
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

  postFilters.orderSelect.onchange = ({ target: { value } }) =>
    (commentsParams.order = value);

  postFilters.pageSizeInput.onchange = ({ target: { value } }) =>
    (commentsParams.pageSize = value);
};
