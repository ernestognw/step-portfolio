const getCommentTemplate = (
  id,
  username,
  text,
  createdAt,
  likes
) => `<article class="media">
<figure class="media-left">
  <p class="image is-64x64">
    <img src="./images/avatar-placeholder.png" alt="${username} avatar">
  </p>
</figure>
<div class="media-content">
  <div class="content">
    <p>
      <strong>${username}</strong>
      <br>
      ${text}
      <br>
      <small class="mr-1">${moment(createdAt).fromNow()}</small>
      -
      <small class="ml-1">
        <a onclick="voteComment(${id})">
          <span class="icon">
            <i class="fa fa-thumbs-up"></i>
          </span>
        </a>
        <span id="${id}-span">${likes}</span>
        likes
      </small>
    </p>
  </div>
</article>`;

export { getCommentTemplate };
