import "@movies/styles/globals.css";

import { SessionProvider } from "next-auth/react";

import { type Session } from "next-auth";
import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "@movies/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Movie Annotator</title>
        <meta name="description" content="Movie Annotation Software for Asaad Lab" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
