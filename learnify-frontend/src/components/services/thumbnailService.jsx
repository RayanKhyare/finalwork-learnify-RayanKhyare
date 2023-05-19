import React from "react";

function extractVideoId(url) {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=|embed\/)?(.+)$/;

  const match = url.match(regex);

  return match ? match[1] : null;
}

function Thumbnail({ url }) {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

  return (
    <img
      src={thumbnailUrl}
      alt="Video Thumbnail"
      className="featuredstream-thumbnail"
    />
  );
}

export default Thumbnail;
