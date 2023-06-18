import "@fortawesome/fontawesome-svg-core/styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import Ably from "ably/promises";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";

import { api } from "@movies/utils/api";

const VideoPlayer = dynamic(() => import("@movies/components/Video"), {
  ssr: false,
});
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const annotatorJoinSchema = z.object({ name: z.string() });

const HostPage: NextPage = () => {
  const router = useRouter();
  const roomCode = router.query.roomCode as string;

  const { data: room } = api.room.getRoomByCode.useQuery({ roomCode });
  const { data: session, status } = useSession();

  const [annotators, setAnnotators] = useState<Map<string, string>>(new Map());
  const [ablyClient, setAbly] = useState<Ably.Realtime>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || !session || !room) {
      // no user data, no database record for room
      return;
    }
    // Step (1) Setup the Ably Connection
    const ably = new Ably.Realtime({
      authUrl: "/api/ablyToken",
      clientId: session.user.id,
    });

    setAbly(ably);

    const ablyRoom = ably.channels.get(roomCode);

    // Step (2) Handle client join
    void ablyRoom.presence.subscribe((e) => {
      const result = annotatorJoinSchema.safeParse(e.data);

      if (!result.success) {
        return console.error(result.error);
      }

      switch (e.action) {
        case "enter":
          setAnnotators((oldAnnotators) => {
            const newAnnotators = new Map(oldAnnotators);
            newAnnotators.set(e.clientId, result.data.name);
            return newAnnotators;
          });
          break;
        case "leave":
          setAnnotators((oldAnnotators) => {
            const newAnnotators = new Map(oldAnnotators);
            newAnnotators.delete(e.clientId);
            return newAnnotators;
          });
          break;
        default:
          break;
      }
    });
  }, [room, roomCode, session, status]);

  if (status === "unauthenticated") {
    return <p>Access Denied! Try logging in via the homepage!</p>;
  }

  return (
    <main className="py-0">
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
          <ReactPlayer
            url={"https://www.youtube.com/watch?v=KMNhOUkpjaM"}
            playbackRate={0.5}
            onProgress={(e) => {
              console.log(e);
            }}
            playing={isPlaying}
            controls={false}
          />
          <div className="flex gap-4">
            <button className="btn btn-primary" onClick={() => setIsPlaying((val) => !val)}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div className="basis-1/6">
          <h2 className="text-center font-bold">Annotators</h2>
          <ul>
            {[...annotators.entries()].map(([id, name]) => (
              <li key={id}>
                <span>{name}</span>
                <select></select>
                <select></select>
              </li>
            ))}
          </ul>
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
