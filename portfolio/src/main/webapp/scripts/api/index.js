import { api } from './client.js';

const addComments = async () => {
  const comments = await api.get('/comments');

  const container = document.getElementById('comments');

  for (let comment of comments) {
    const { createdAt, username, comment: text } = comment;

    container.insertAdjacentHTML(
      'beforeend',
      `<article class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img src="./images/avatar-placeholder.png">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${username}</strong>
              <br>
              ${text}
              <br>
              <small>${moment(createdAt).fromNow()}</small>
            </p>
          </div>
      </article>`
    );
  }
};

export { addComments };
