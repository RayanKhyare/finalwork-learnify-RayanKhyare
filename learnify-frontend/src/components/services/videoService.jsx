import React from "react";

function extractVideoId(url) {
  if (!url) {
    return null;
  }
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=|embed\/)?(.+)$/;

  const match = url.match(regex);

  return match ? match[1] : null;
}

function Video({ url }) {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  const iframeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <iframe
      className="featuredstream-iframe"
      width="560"
      height="315"
      src={iframeUrl}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowFullScreen
      autoPlay
    ></iframe>
  );
}

export default Video;
