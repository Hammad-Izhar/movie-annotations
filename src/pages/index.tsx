import "@fortawesome/fontawesome-svg-core/styles.css";

import {
  faGears,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MainNavigationButton from "@movies/components/MainNavigationButton";
import { api } from "@movies/utils/api";
import generateRoomCode from "@movies/utils/generateRoomCode";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const HostRoom = () => {
  const router = useRouter();
  const selectRef = useRef<HTMLSelectElement>(null);

  const { data: movieData, isLoading: isMovieLoading } =
    api.movie.getAllMovies.useQuery();

  const { mutate: createRoom, isLoading: isCreatingRoom } =
    api.room.createRoom.useMutation({
      onSuccess(data) {
        router
          .push({
            pathname: `/${data.roomCode}/host`,
          })
          .catch((err) => console.error(err));
      },
      onError: (e) => {
        console.error(e);
      },
    });

  return (
    <div className="grid gap-2">
      <h3 className="text-lg font-bold">Host a Movie!</h3>
      {isMovieLoading || isCreatingRoom ? (
        <span className="loading loading-spinner mx-auto text-primary" />
      ) : (
        <>
          <p>Select a movie from the dropdown and press submit.</p>
          <select ref={selectRef}>
            {movieData?.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.name}
              </option>
            ))}
          </select>
          <button
            className="btn-accent btn my-4 capitalize"
            onClick={() => {
              const roomCode = generateRoomCode();
              const movieId = selectRef.current?.value;

              if (movieId === undefined) {
                throw new Error("Failed to get Selected Movie");
              }

              createRoom({ movieId, roomCode });
            }}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

const JoinRoom = () => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const { data: isValidRoom, refetch } = api.room.checkIfRoomIsActive.useQuery(
    { roomCode: roomCode },
    { enabled: false }
  );

  if (isValidRoom) {
    router.push(`${roomCode}/annotator`).catch((e) => console.error(e));
  }

  return (
    <div className="grid gap-2">
      <h3 className="text-lg font-bold">Join a Room!</h3>
      <p>Enter the code of the room you want to join</p>
      <input
        className="p-2 font-semibold"
        type="text"
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button
        className="btn-accent btn my-4 capitalize"
        onClick={() => void refetch()}
      >
        Submit
      </button>
    </div>
  );
};

const ViewData = () => {
  return <div></div>;
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <main>
      <h1 className="pb-10 text-center text-6xl">Movie Annotations</h1>
      {session ? (
        <>
          <div className="flex flex-col flex-wrap items-center justify-center gap-10 lg:flex-row">
            <MainNavigationButton label="Create Room" icon={faPlus}>
              <HostRoom />
            </MainNavigationButton>

            <MainNavigationButton label="Join Room" icon={faPeopleGroup}>
              <JoinRoom />
            </MainNavigationButton>

            <MainNavigationButton label="View Data" icon={faGears}>
              <ViewData />
            </MainNavigationButton>
          </div>
          {/* TODO: Visualize this in a better place */}
          <p>
            Signed in as {session.user.name} ({session.user.email})
          </p>
          <button className="button" onClick={() => void signOut()}>
            Sign Out
          </button>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <button
            className="btn-primary btn"
            onClick={() => void signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
