import { api } from './client.js';
import { getCommentTemplate } from './utils.js';

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

window.voteComment = async id => {
  const { likes } = await api.put('/comments', {
    body: JSON.stringify({ id: id.toString() })
  });

  const likesQty = document.getElementById(`${id}-span`);
  likesQty.innerText = likes;
};

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
