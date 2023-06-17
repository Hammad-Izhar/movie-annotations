import "@fortawesome/fontawesome-svg-core/styles.css";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Ably from "ably/promises";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const VideoPlayer = dynamic(() => import("@movies/components/Video"), {
  ssr: false,
});

const HostPage: NextPage = () => {
  const router = useRouter();
  const roomCode = router.query.roomCode;

  const { data: session } = useSession();

  const [annotators, setAnnotators] = useState(new Set<string>());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof roomCode != "string") {
      return;
    }

    const ably = new Ably.Realtime({
      authUrl: "/api/ablyToken",
      clientId: `hammad ${new Date().toISOString()}`,
    });

    const room = ably.channels.get(roomCode);

    void room.presence.subscribe((e) => {
      switch (e.action) {
        case "enter":
          setAnnotators((oldAnnotators) => {
            const newAnnotators = new Set(oldAnnotators);
            return newAnnotators.add(e.clientId);
          });
          break;
        case "leave":
          setAnnotators((oldAnnotators) => {
            const newAnnotators = new Set(oldAnnotators);
            newAnnotators.delete(e.clientId);
            return newAnnotators;
          });
          break;
        default:
          break;
      }
    });

    const cleanup = () => {
      () => ably.close();
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [roomCode]);

  if (!session) {
    return <>Not Logged In</>;
  }

  return (
    <main>
      <div className="flex justify-between py-4 text-lg">
        <Link href="/" className="flex items-baseline justify-center gap-2">
          <FontAwesomeIcon icon={faPersonWalkingArrowRight} flip="horizontal" />
          Leave
        </Link>
        <span className="font-bold">{roomCode}</span>
        <span>Num Annotators: {annotators.size}</span>
      </div>

      <div className="flex">
        <div className="basis-5/6 grid place-items-center gap-4">
          <VideoPlayer />
          <div className="flex gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setIsPlaying((val) => !val)}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div className="basis-1/6">
          <h2 className="text-center font-bold">Annotators</h2>
          <ul></ul>
        </div>
      </div>
    </main>
  );
};

export default HostPage;

// TODO:
// * Grab the selected movie from the database
// * Load the movie from YouTube
// * Setup connection to the annotators
// * Show how many annotators are connected
// * Add pause/play functionality
// * Assign annotators to a character
// * Manage playable blocks?
// * Send frame to annotator
// * Get Auth Working <----- next biggest hurdle
