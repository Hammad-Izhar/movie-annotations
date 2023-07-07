import "@fortawesome/fontawesome-svg-core/styles.css";

import type { Annotation } from "@prisma/client";
import type { NextPage } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Emotion } from "@prisma/client";
import Ably from "ably/promises";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";

import AnnotationInput from "@movies/components/AnnotationInput";
import { api } from "@movies/utils/api";
import convertValence from "@movies/utils/convertValence";

const annotatorAssignmentSchema = z.object({
  for: z.string().nonempty(),
  character: z.string().nonempty(),
  imgUrl: z.string(),
  emotion: z.nativeEnum(Emotion),
});

const frameSchema = z.object({
  frameNumber: z.number(),
});

const Annotator: NextPage = () => {
  const router = useRouter();
  const roomCode = router.query.roomCode as string;

  const { data: session, status } = useSession();

  const [sessionAssignmentId, setSessionAssignmentId] = useState<string>();
  const [annotations, setAnnotations] = useState<Omit<Annotation, "id">[]>([]);
  const annotationRef = useRef<HTMLInputElement>(null);

  const { data: room } = api.room.getRoomByCode.useQuery({ roomCode });
  const { mutate: createSessionAssignment } =
    api.sessionAssignment.createSessionAssignment.useMutation({
      onSuccess: (data) => {
        setSessionAssignmentId(data.id);
      },
    });
  const { mutate: createManyAnnotations } = api.annotation.createManyAnnotations.useMutation({
    onSuccess: () => {
      setAnnotations([]);
    },
  });

  /**
   * On the annotator end you must
   * 1. Set up the Ably connection
   * 2. Let the host know that you are present
   * 3. Wait for an assignment
   * 5. On frames, store the ratings
   * 6. When given the signal write to the database
   */
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

    // Step (2) Let host know you are present
    void ablyRoom.presence
      .enter({ name: session.user.name })
      .then(() => console.log("entered room"));

    // Step (3) Wait for an assignment
    void ablyRoom.subscribe("assignment", (msg) => {
      console.log(msg);
      const result = annotatorAssignmentSchema.safeParse(msg.data);
      if (!result.success) {
        return console.error(result.error);
      }
      if (result.data.for !== session.user.id) {
        return;
      }

      createSessionAssignment({
        roomId: room.id,
        userId: session.user.id,
        ...result.data,
      });
    });

    // Step (4) Wait for frames
    void ablyRoom.subscribe("frame", (msg) => {
      if (sessionAssignmentId === undefined) {
        return;
      }

      const result = frameSchema.safeParse(msg.data);
      if (!result.success) {
        return console.error(result.error);
      }

      setAnnotations((prev) => [
        ...prev,
        {
          frameNumber: result.data.frameNumber,
          sessionAssignmentId: sessionAssignmentId,
          valence: convertValence(annotationRef.current?.value),
          createdAt: new Date(),
        },
      ]);
    });

    // Step (5) Write all the annotations
    void ablyRoom.subscribe("writeAnnotations", () => {
      createManyAnnotations(annotations);
    });

    const cleanup = () => {
      void ablyRoom.presence.leave({ name: session.user.name });
    };
    router.events.on("routeChangeStart", cleanup);

    return () => {
      router.events.off("routeChangeStart", cleanup);
    };
  }, [
    createManyAnnotations,
    createSessionAssignment,
    room,
    roomCode,
    router.events,
    session,
    sessionAssignmentId,
    status,
  ]);

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
          <AnnotationInput sliderRef={annotationRef} />
        </div>
      </div>
    </main>
  );
};

export default Annotator;
