import { api } from './client.js';
import { getCommentTemplate } from './utils.js';

const updateComments = async () => {
  const comments = await api.get('/comments');

  const container = document.getElementById('comments');

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

export { updateComments, addComment };
