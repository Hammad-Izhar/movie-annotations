import "@fortawesome/fontawesome-svg-core/styles.css";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Ably from "ably/promises";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const HostPage: NextPage = () => {
  const router = useRouter();
  const roomCode = router.query.roomCode;

  const [annotators, setAnnotators] = useState(new Set<string>());

  const videoRef = useRef<typeof ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <>
      <Head>
        <title>Movie Annotator</title>
        <meta
          name="description"
          content="Movie Annotation Software for Asaad Lab"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-bl from-[#b0e5d0] to-[#5ccaee69] px-4 text-black">
        <div className="flex justify-between py-4 text-lg">
          <Link href="/" className="flex items-baseline justify-center gap-2">
            <FontAwesomeIcon
              icon={faPersonWalkingArrowRight}
              flip="horizontal"
            />
            Leave
          </Link>
          <span className="font-bold">{roomCode}</span>
          <span>Num Annotators: {annotators.size}</span>
        </div>

        <div className="flex">
          <div className="basis-5/6 grid place-items-center gap-4">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=EZ1yCdoybSw"
              ref={videoRef}
              controls={false}
              playing={isPlaying}
              playbackRate={0.5}
            />
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
    </>
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
// * Get Auth Working
