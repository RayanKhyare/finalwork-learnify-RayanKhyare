const extractVideoId = (url) => {
  const videoIdRegex =
    /(?:[?&]|\b)(v=|embed\/|youtu.be\/|\/v\/|\/embed\/|\/watch\?v=|youtube.com\/v\/|youtube.com\/embed\/)([^#\&\?]*).*/i;
  const match = url.match(videoIdRegex);
  return match && match[2] ? match[2] : null;
};

export default extractVideoId;
