import "@fortawesome/fontawesome-svg-core/styles.css";

import type { Emotion } from "@prisma/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import Ably from "ably/promises";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";

import { api } from "@movies/utils/api";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const emotions: Emotion[] = ["ANGER", "DISGUST", "FEAR", "HAPPINESS", "SADNESS", "SURPRISE"];

const annotatorJoinSchema = z.object({ name: z.string() });

const HostPage: NextPage = () => {
  // Grab the auto-generated room code from the URL
  const router = useRouter();
  const roomCode = router.query.roomCode as string;

  // The active room in the database
  const { data: room } = api.room.getRoomByCode.useQuery(
    { roomCode },
    { refetchOnWindowFocus: false }
  );

  // Ensure this page is protected by authentication
  const { data: session, status } = useSession();

  // Annotators (ids -> names) connected to this room
  const [annotators, setAnnotators] = useState<Map<string, string>>(new Map());
  // The Ably channel that users connect to
  const [ablyChannel, setAblyChannel] = useState<Ably.Types.RealtimeChannelPromise>();
  // Video Player State
  const [isPlaying, setIsPlaying] = useState(false);

  // Annotation Assignment Refs
  const characterRef = useRef<HTMLSelectElement>(null);
  const emotionRef = useRef<HTMLSelectElement>(null);

  // TODO: refactor to a custom connection hook that provides the channel and takes in a room, session, and callback
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
    const ablyRoom = ably.channels.get(roomCode);
    setAblyChannel(ablyRoom);

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
              void ablyChannel?.publish("frame", { frameNumber: e.playedSeconds });
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
                {/* TODO: Update database schema, characters should have a name and a pfp */}
                <select ref={characterRef}>
                  {room?.movie.characters.map((character) => (
                    <option key={character}>{character}</option>
                  ))}
                </select>
                <select ref={emotionRef}>
                  {emotions.map((emotion) => (
                    <option className="capitalize" key={emotion}>
                      {emotion}
                    </option>
                  ))}
                </select>
                <button
                  className="btn"
                  onClick={() => {
                    void ablyChannel?.publish("assignment", {
                      for: id,
                      character: characterRef.current?.value,
                      imgUrl: "",
                      emotion: emotionRef.current?.value,
                    });
                  }}
                >
                  Submit!
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default HostPage;
