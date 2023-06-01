import {
  faGears,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MainNavigationButton from "@movies/components/MainNavigationButton";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
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
      <main className="flex min-h-screen flex-col justify-center gap-40 bg-gradient-to-bl from-[#F53803] to-[#F5D020]">
        <h1 className="text-center text-6xl">Movie Annotations</h1>
        <div className="grid w-full grid-cols-3 place-items-stretch">
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
