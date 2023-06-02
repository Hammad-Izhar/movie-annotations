import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type NextPage } from "next";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Image from "next/image";
import AnnotationInput from "@movies/components/AnnotationInput";

const Annotater: NextPage = () => {
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
      <main className="min-h-screen bg-gradient-to-bl from-[#b0e5d0] to-[#5ccaee69] px-4 text-black">
        <div className="flex justify-between py-4 text-lg">
          <a className="flex items-baseline justify-center gap-2">
            <FontAwesomeIcon
              icon={faPersonWalkingArrowRight}
              flip="horizontal"
            />
            Leave
          </a>
          <span>Time: 1:00:00 / 2:00:00</span>
        </div>
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
      </main>
    </>
  );
};

export default Annotater;
