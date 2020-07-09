/**
 * Get the sentiment color to use in template
 *
 * @param {string} sentiment
 */
const getSentimentTagColor = sentiment => {
  switch (sentiment) {
    case 'Mad':
      return 'danger';
    case 'Happy':
      return 'success';
    default:
      return 'info';
  }
};

/**
 * To create a comment based in a template
 *
 * @param {string} id
 * @param {string} username
 * @param {string} text
 * @param {string} createdAt
 * @param {string} likes
 * @param {string} sentiment
 *
 * @returns {string} Template with data from params, to insert as HTML in DOM
 */
const getCommentTemplate = (
  id,
  username,
  text,
  createdAt,
  likes,
  sentiment
) => `<article class="media comments--comment" id="${id}-comment">
<figure class="media-left">
  <p class="image is-64x64">
    <img src="./images/avatar-placeholder.png" alt="${username} avatar">
  </p>
</figure>
<div class="media-content">
  <div class="content">
    <p>
      <strong>${username}</strong>
      <span class="tag is-light is-${getSentimentTagColor(
        sentiment
      )}">${sentiment}</span>
      <small class="ml-1 comments--hidden">
        <a onclick="deleteComment(${id})">
          <span class="icon">
            <i class="fa fa-trash"></i>
          </span>
        </a>
      </small>
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
