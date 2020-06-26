const baseURL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyBENDSXuXOOLyByHnGTzMrYRhzWHIMnIsY";

const youtube = {
  get: async (path) => {
    const data = await fetch(`${baseURL}${path}&key=${API_KEY}`);

    return data.json();
  },
  // TO DO: Add another methods to youtube
};

export { youtube };
