import { youtube } from './client.js';

/**
 * Function to fetch video data and insert them into the DOM
 *
 * It relies on an internal list of videos that is set manually
 * since there is no way to filter my specific videos from youtube.
 * The channel is shared by other people.
 *
 * If any other way to get the exact videos is found, then replace.
 */
const updateVideos = async () => {
  const myVideos = [
    'x4bX0FueaLs',
    '9JBSGKpa5g4',
    'OdsGTDlUs1s',
    'jNdXrbFm6nQ',
    'ldWFCOdWkwk',
    'iX3X7yFHNjE',
    'RaOqQZQprks'
  ];

  const { items: videos } = await youtube.get(
    `/videos?part=id%2C+snippet&id=${myVideos.toString()}`
  );

  const container = document.getElementById('videos');

  for (let video of videos) {
    const {
      snippet: { channelTitle, publishedAt, title, thumbnails, description },
      id
    } = video;

    container.insertAdjacentHTML(
      'beforeend',
      `<div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="${thumbnails.standard.url}" alt="${title}">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">${title}</p>
              <p class="subtitle is-6">@${channelTitle}</p>
            </div>
          </div>
          <div class="content ellipsis is-ellipsis-4">
            ${description}
          </div>
          <time class="mt-3 mt-auto">${moment(publishedAt).fromNow()}</time> 
        </div>
      </div>`
    );
  }
};

export { updateVideos };
