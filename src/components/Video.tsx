import { useEffect, useRef, useState } from "react";

const VideoPlayer = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [nowArray, setNowArray] = useState<Set<number>>(new Set());

  useEffect(() => {
    const video = ref.current;

    if (video === null) {
      return;
    }

    const processFrame = (now: number) => {
      setNowArray((prev) => new Set(prev).add(now));
      video.requestVideoFrameCallback(processFrame);
    };

    video.requestVideoFrameCallback(processFrame);
  }, []);

  useEffect(() => {
    console.log(nowArray);
  }, [nowArray]);

  return (
    <video ref={ref} controls>
      <source src="/video.mp4" />
    </video>
  );
};

export default VideoPlayer;
