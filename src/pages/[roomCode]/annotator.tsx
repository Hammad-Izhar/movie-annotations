import "@fortawesome/fontawesome-svg-core/styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import Ably from "ably/promises";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import AnnotationInput from "@movies/components/AnnotationInput";
import { api } from "@movies/utils/api";

const Annotator: NextPage = () => {
  const router = useRouter();
  const roomCode = router.query.roomCode as string;

  const { data } = api.room.getRoomByCode.useQuery({ roomCode });
  const { data: session, status } = useSession();

  if (data) {
    const { movie } = data;
  }

  // useEffect(() => {
  //   if (status === "unauthenticated" || !session) {
  //     return;
  //   }

  //   const ably = new Ably.Realtime({
  //     authUrl: "/api/ablyToken",
  //     clientId: session.user.id,
  //   });

  //   const room = ably.channels.get(roomCode);
  //   void room.presence.enter({ name: session.user.name });

  //   void room.subscribe("frame", (msg) => {
  //     console.log(msg);
  //   });

  //   const cleanup = () => {
  //     void room.presence.leave({ name: session.user.name });
  //   };

  //   router.events.on("routeChangeStart", cleanup);
  //   return () => {
  //     router.events.off("routeChangeStart", cleanup);
  //   };
  // }, [roomCode, router.events, session, status]);

  return (
    <main className="py-0 flex flex-col">
      <div className="flex justify-between py-4 text-lg">
        <Link href="/" className="flex items-baseline justify-center gap-2">
          <FontAwesomeIcon icon={faPersonWalkingArrowRight} flip="horizontal" />
          Leave
        </Link>
        <span>Time: 1:00:00 / 2:00:00</span>
      </div>
      <div className="flex h-full flex-grow items-center justify-center">
        <div className="grid gap-4 text-xl">
          <span>
            <b>Target Emotion:</b> Happiness
          </span>
          <span>
            <b>Character:</b> The Sultan
          </span>
          <div className="grid place-items-center">
            <Image
              className="place-items-center"
              src="/profile.png"
              alt="character"
              width={300}
              height={300}
            />
          </div>
          <AnnotationInput />
        </div>
      </div>
    </main>
  );
};

export default Annotator;
