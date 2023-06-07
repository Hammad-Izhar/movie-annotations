import {
  faGears,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MainNavigationButton from "@movies/components/MainNavigationButton";
import { type NextPage } from "next";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useEffect } from "react";
import Ably from "ably";

const Home: NextPage = () => {
  let ably: Ably.Realtime;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/ablyToken");
        const { token } = (await response.json()) as { token: string };

        ably = new Ably.Realtime({ token });
      } catch (err) {
        console.error(err);
      }
    };
  });

  return (
    <>
      <Head>
        <title>Movie Annotater</title>
        <meta
          name="description"
          content="Movie Annotation Software for Asaad Lab"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-bl from-[#b0e5d0] to-[#5ccaee69] px-4 py-10 text-black">
        <h1 className="pb-10 text-center text-6xl">Movie Annotations</h1>

        <div className="flex flex-col flex-wrap items-center justify-center gap-10 lg:flex-row">
          <MainNavigationButton label="Create Room" icon={faPlus} href="" />
          <MainNavigationButton
            label="Join Room"
            icon={faPeopleGroup}
            href=""
          />
          <MainNavigationButton label="View Data" icon={faGears} href="" />
        </div>
      </main>
    </>
  );
};

export default Home;
