import "@fortawesome/fontawesome-svg-core/styles.css";

import type { Annotation, SessionAssignment } from "@prisma/client";
import type { NextPage } from "next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Emotion } from "@prisma/client";
import Ably from "ably/promises";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";

import AnnotationInput from "@movies/components/AnnotationInput";
import { api } from "@movies/utils/api";
import convertValence from "@movies/utils/convertRatingToValence";

export type Rating = undefined | 1 | 2 | 3 | 4 | 5;

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
  // Grab the auto-generated room code from the URL
  const router = useRouter();
  const roomCode = router.query.roomCode as string;

  // The active room in the database
  const { data: room } = api.room.getRoomByCode.useQuery(
    { roomCode },
    { refetchOnWindowFocus: false }
  );
  // Creates a SessionAssignment for this user
  const { mutate: createSessionAssignment } =
    api.sessionAssignment.createSessionAssignment.useMutation({
      onSuccess: (data) => {
        console.log(data);
        setSessionAssignment(data);
      },
      retry: 0,
    });
  // Mass writes annotations for this user
  const { mutate: createManyAnnotations } = api.annotation.createManyAnnotations.useMutation({
    onSuccess: () => {
      console.log(annotations.length);
      setAnnotations([]);
    },
  });

  // Ensure this page is protected by authentication
  const { data: session, status } = useSession();

  // The Ably channel that users connect to
  const [ablyChannel, setAblyChannel] = useState<Ably.Types.RealtimeChannelPromise>();
  // The id of the associated SessionAssignment for writing Annotations
  const [sessionAssignment, setSessionAssignment] = useState<SessionAssignment>();
  // A buffer of Annotations waiting to be written
  const [annotations, setAnnotations] = useState<Omit<Annotation, "id">[]>([]);
  //
  const [selectedRating, setSelectedRating] = useState<Rating>(undefined);

  // TODO: refactor to a custom connection hook similar to host (probably the same hook with a generic callback)
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

    // Step (2) Let host know you are present
    void ablyRoom.presence
      .enter({ name: session.user.name })
      // TODO: remove this line
      .then(() => console.log("entered room"));
  }, [room, roomCode, session, status]);

  useEffect(() => {
    if (!session || !room || !ablyChannel) return;

    // Step (3) "Wait" for an assignment
    const handleAssignment = (msg: Ably.Types.Message) => {
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
    };
    void ablyChannel.subscribe("assignment", handleAssignment);
  }, [ablyChannel, createSessionAssignment, room, session]);

  useEffect(() => {
    if (!ablyChannel) return;

    // Step (4) Wait for frames
    void ablyChannel.subscribe("frame", (msg) => {
      // If I haven't been assigned anything, then skip this frame
      if (sessionAssignment === undefined) {
        console.log("no assignment");
        return;
      }

      const result = frameSchema.safeParse(msg.data);
      if (!result.success) {
        return console.error(result.error);
      }

      setAnnotations((prev) => {
        return [
          ...prev,
          {
            frameNumber: result.data.frameNumber,
            sessionAssignmentId: sessionAssignment.id,
            valence: convertValence(selectedRating),
            createdAt: new Date(),
          },
        ];
      });
    });

    return () => {
      ablyChannel.unsubscribe("frame");
    };
  }, [ablyChannel, selectedRating, sessionAssignment]);

  useEffect(() => {
    if (!ablyChannel || annotations.length === 0) return;

    // Step (5) Write all the annotations
    const handleWriteAnnotations = () => {
      createManyAnnotations(annotations);
    };
    void ablyChannel.subscribe("writeAnnotations", handleWriteAnnotations);

    return () => {
      ablyChannel.unsubscribe("writeAnnotations");
    };
  }, [ablyChannel, annotations, createManyAnnotations]);

  useEffect(() => {
    if (!session) return;

    const cleanup = () => {
      void ablyChannel?.presence.leave({ name: session.user.name });
      void ablyChannel?.unsubscribe();
      void ablyChannel?.detach();
    };
    router.events.on("routeChangeStart", cleanup);

    return () => {
      router.events.off("routeChangeStart", cleanup);
    };
  }, [ablyChannel, ablyChannel?.presence, router.events, session]);

  return (
    <main className="py-0 flex flex-col">
      <div className="flex justify-between py-4 text-lg">
        <Link href="/" className="flex items-baseline justify-center gap-2">
          <FontAwesomeIcon icon={faPersonWalkingArrowRight} flip="horizontal" />
          Leave
        </Link>
      </div>
      <div className="flex h-full flex-grow items-center justify-center">
        <div className="grid gap-4 text-xl">
          <span>
            <b>Target Emotion:</b> {sessionAssignment?.emotion ?? "No Assignment"}
          </span>
          <span>
            <b>Character:</b> {sessionAssignment?.character ?? "No Assignment"}
          </span>
          <div className="grid place-items-center">
            <Image
              className="place-items-center"
              // src={sessionAssignment?.url ?? "/profile.png"}
              src={sessionAssignment?.character !== null && sessionAssignment?.character !== undefined ? "/" + sessionAssignment?.character + ".png" : "/profile.png"}
              alt="character"
              width={300}
              height={300}
            />
          </div>
          <AnnotationInput selectedRating={selectedRating} setSelectedRating={setSelectedRating} />
        </div>
      </div>
    </main>
  );
};

export default Annotator;
