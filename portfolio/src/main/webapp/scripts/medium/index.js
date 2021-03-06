import { medium } from './client.js';

/**
 * Function to fetch posts data and insert them into the DOM
 */
const updatePosts = async () => {
  const { items: posts } = await medium.get('/feed/@ernestognw');

  const container = document.getElementById('blog');

  for (let post of posts) {
    const { title, author, thumbnail, pubDate, link } = post;

    // There are autogenerated thumbnail links that are not pointing to an image
    // This apply for non-publications. This way, they're filtered
    if (thumbnail.includes('cdn')) {
      container.insertAdjacentHTML(
        'beforeend',
        `<a class="card" href="${link}" rel="noopener noreferrer" target="_blank">
          <div class="card-image">
            <figure class="image is-16by9">
              <img class="" src="${thumbnail}" alt=${title}>
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title mb-0 is-4">${title}</p>
              </div>
            </div>
            <time class="mt-3 mt-auto">${moment(pubDate).fromNow()}</time> 
          </div>
        </a>`
      );
    }
  }
};

export { updatePosts };
