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
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const selectRef = useRef<HTMLSelectElement>(null);
  const { data: session } = useSession();

  const { data: movieData, isLoading: movieLoading } =
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

  if (!session) {
    return (
      <main className="min-h-screen bg-gradient-to-bl from-[#b0e5d0] to-[#5ccaee69] px-4 py-10 text-black">
        <h1 className="pb-10 text-center text-6xl">Movie Annotations</h1>

        <div className="h-full flex justify-center items-center">
          <button
            className="btn btn-primary"
            onClick={() => void signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-bl from-[#b0e5d0] to-[#5ccaee69] px-4 py-10 text-black">
      <h1 className="pb-10 text-center text-6xl">Movie Annotations</h1>

      <div className="flex flex-col flex-wrap items-center justify-center gap-10 lg:flex-row">
        <MainNavigationButton label="Create Room" icon={faPlus}>
          <div className="grid gap-2">
            <h3 className="text-lg font-bold">Host a Movie!</h3>
            {movieLoading || isCreatingRoom ? (
              <span className="mx-auto loading loading-spinner text-primary" />
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
        </MainNavigationButton>

        <MainNavigationButton label="Join Room" icon={faPeopleGroup}>
          <div className="grid gap-2">
            <h3 className="text-lg font-bold">Join a Room!</h3>
            <p>Enter the code of the room you want to join</p>
            <input className="p-2 font-semibold" type="text" />
            <button
              className="btn-accent btn my-4 capitalize"
              onClick={() => console.log("submit")}
            >
              Submit
            </button>
          </div>
        </MainNavigationButton>

        <MainNavigationButton label="View Data" icon={faGears} />
      </div>
      <p>
        Signed in as {session.user.name} ({session.user.email})
      </p>
      <button className="button" onClick={() => void signOut()}>
        Sign Out
      </button>
    </main>
  );
};

export default Home;
