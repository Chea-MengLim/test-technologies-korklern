"use client";
import React from "react";

const FacebookShareButton = ({ url, quote }) => {
  const appId = "860320866292919";

  const handleShare = () => {
    const shareUrl = `https://www.facebook.com/dialog/share?app_id=${appId}&display=popup&href=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(quote)}&redirect_uri=${encodeURIComponent(url)}`;

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Share on Facebook
    </button>
  );
};

export default FacebookShareButton;
