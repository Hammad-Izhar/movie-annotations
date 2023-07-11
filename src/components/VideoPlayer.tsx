import type Ably from "ably/promises";

import { useEffect, useState } from "react";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dynamic from "next/dynamic";

import { env } from "@movies/env.mjs";

interface VideoPlayerProps {
  bucketName: string;
  objectKey: string;
  ablyChannel?: Ably.Types.RealtimeChannelPromise;
}

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export function VideoPlayer({ bucketName, objectKey, ablyChannel }: VideoPlayerProps) {
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      const s3 = new S3Client({
        region: env.NEXT_PUBLIC_AWS_REGION,
        credentials: {
          accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        },
      });

      const params = {
        Bucket: bucketName,
        Key: objectKey,
      };

      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3, command, { expiresIn: 900 });
      setVideoSource(url);
    }

    void fetchVideo();
  }, [bucketName, objectKey]);

  return (
    <div>
      {videoSource && (
        <div>
          <ReactPlayer
            url={videoSource}
            controls
            onProgress={(e) => {
              console.log(e);
              void ablyChannel?.publish("frame", { frameNumber: e.playedSeconds });
            }}
            playbackRate={0.5}
            playing={isPlaying}
          />
        </div>
      )}
    </div>
  );
}
