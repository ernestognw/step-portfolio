import { api } from './client.js';
import { getCommentTemplate } from './utils.js';

const setFilterState = ({ page, pageSize, order, orderBy }) => {
  const {
    latestButton,
    popularButton,
    pageNumber,
    pageSizeInput,
    orderSelect
  } = window.postFilters;
  if (orderBy === 'createdAt') {
    popularButton.classList.remove('is-active');
    latestButton.classList.add('is-active');
  } else if (orderBy === 'likes') {
    latestButton.classList.remove('is-active');
    popularButton.classList.add('is-active');
  }
  orderSelect.value = order;
  pageSizeInput.value = pageSize;
  pageNumber.innerHTML = page;
};

const updateComments = async ({ page, pageSize, order, orderBy }) => {
  const {
    commentsQty,
    pagesTotal,
    firstPageButton,
    prevPageButton,
    nextPageButton,
    lastPageButton
  } = window.postFilters;

  const {
    info: { next, prev, count, pages },
    results: comments
  } = await api.get(
    `/comments?page=${page}&pageSize=${pageSize}&order=${order}&orderBy=${orderBy}`
  );

  pagesTotal.innerText = pages;
  commentsQty.innerText = count;
  firstPageButton.disabled = !prev;
  prevPageButton.disabled = !prev;
  nextPageButton.disabled = !next;
  lastPageButton.disabled = !next;
  const container = document.getElementById('comments');
  container.innerHTML = '';

  for (let comment of comments) {
    const { createdAt, username, comment: text } = comment;

    container.insertAdjacentHTML(
      'beforeend',
      getCommentTemplate(username, text, createdAt)
    );
  }
};

const addComment = async newComment => {
  const { username, comment, createdAt } = newComment;
  const submitButton = document.getElementById('submit-post');
  submitButton.disabled = true;
  submitButton.classList.add('is-loading');

  await api.post('/comments', { body: JSON.stringify(newComment) });

  const container = document.getElementById('comments');
  container.insertAdjacentHTML(
    'afterbegin',
    getCommentTemplate(username, comment, createdAt)
  );

  newComment = {
    username: '',
    comment: ''
  };

  postForm.username.value = '';
  postForm.comment.value = '';
  submitButton.disabled = false;
  submitButton.classList.remove('is-loading');
};

export { setFilterState, updateComments, addComment };
