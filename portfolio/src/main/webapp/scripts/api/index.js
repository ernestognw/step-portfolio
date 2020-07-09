import { api } from './client.js';
import { getCommentTemplate } from './utils.js';

/**
 * To add a comment to API datastore and insert it to DOM
 *
 * @param {object} newComment New comment to be sent to comments APi
 */
const addComment = async newComment => {
  const { username, comment, createdAt } = newComment;
  const submitButton = document.getElementById('submit-post');
  submitButton.disabled = true;
  submitButton.classList.add('is-loading');
  const { commentsQty } = window.postFilters;

  const { id, sentiment } = await api.post('/comments', {
    body: JSON.stringify(newComment)
  });

  commentsQty.innerText = Number(commentsQty.innerText) + 1;
  const container = document.getElementById('comments');
  container.insertAdjacentHTML(
    'afterbegin',
    getCommentTemplate(id, username, comment, createdAt, 0, sentiment)
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

/**
 * To add a comment to API datastore and insert it to DOM
 *
 * @param {{ page: number, pageSize: number, order: string, orderBy: string }} queryParams to fetch data
 *    page: The number of the page to be fetched
 *    pageSize: Number of comments per page
 *    order: Could be asc or desc, this is the order in which elements will be returned
 *    orderBy: Could be createdBy or likes, to filter which attribute is used for ordering
 */
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
    const {
      id,
      createdAt,
      username,
      comment: text,
      likes,
      sentiment
    } = comment;

    container.insertAdjacentHTML(
      'beforeend',
      getCommentTemplate(id, username, text, createdAt, likes, sentiment)
    );
  }
};

/**
 * Set the filters state of the page.
 * This means to update DOM elements displaying
 * important data about the comments
 *
 * @param {{ page: number, pageSize: number, order: string, orderBy: string }} queryParams to fetch data
 *    page: The number in which the user is
 *    pageSize: Number of comments per page
 *    order: Could be asc or desc
 *    orderBy: Could be createdBy or likes, this set the current tab in comments
 */
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

/**
 * Function to increase votes on a comment
 * It is attached to window object, so it can be accessed by the like button
 * which is inserted via template
 *
 * @param id Datastore identifier of the comment
 */
window.voteComment = async id => {
  const { likes } = await api.put('/comments', {
    body: JSON.stringify({ id: id.toString() })
  });

  const likesQty = document.getElementById(`${id}-span`);
  likesQty.innerText = likes;
};

/**
 * Function to remove a comment from datastore and from the page
 * It is attached to window object, so it can be accessed by the delete button
 * which is inserted via template
 *
 * @param id Datastore identifier of the comment
 */
window.deleteComment = async id => {
  const { commentsQty } = window.postFilters;

  await api.delete('/comments', {
    body: JSON.stringify({ id: id.toString() })
  });

  const comment = document.getElementById(`${id}-comment`);
  comment.remove();
  commentsQty.innerText = Number(commentsQty.innerText) - 1;
};

export { addComment, updateComments, setFilterState };
