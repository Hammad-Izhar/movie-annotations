import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faGears,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MainNavigationButton from "@movies/components/MainNavigationButton";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const selectRef = useRef<HTMLSelectElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => void signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => void signIn()}>Sign in</button>
    </>
  );

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
      <main className="min-h-screen bg-gradient-to-bl from-[#b0e5d0] to-[#5ccaee69] px-4 py-10 text-black">
        <h1 className="pb-10 text-center text-6xl">Movie Annotations</h1>

        <div className="flex flex-col flex-wrap items-center justify-center gap-10 lg:flex-row">
          <MainNavigationButton label="Create Room" icon={faPlus}>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold">Host a Movie!</h3>
              <p>Select a movie from the dropdown and press submit.</p>
              <select ref={selectRef}>
                <option>iRobot</option>
                <option>House</option>
              </select>
              <button
                className="btn-accent btn my-4 capitalize"
                onClick={() => {
                  const query = { key: selectRef.current?.value };

                  router
                    .push({
                      pathname: "/host",
                      query,
                    })
                    .catch((err) => console.error(err));
                }}
              >
                Submit
              </button>
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
      </main>
    </>
  );
};

export default Home;
