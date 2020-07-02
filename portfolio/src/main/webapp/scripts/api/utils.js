const getCommentTemplate = (
  username,
  text,
  createdAt
) => `<article class="media">
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
</article>`;

export { getCommentTemplate };
