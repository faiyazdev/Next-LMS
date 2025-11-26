"use client";
import YouTube from "react-youtube";

export default function YouTubePlayer({
  videoId,
  onFinishVideo,
}: {
  videoId: string;
  onFinishVideo?: () => void;
}) {
  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return <YouTube videoId={videoId} opts={opts} onEnd={onFinishVideo} />;
}
