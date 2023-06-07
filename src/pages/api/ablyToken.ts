import { env } from "@movies/env.mjs";
import Ably from "ably";
import type { NextApiRequest, NextApiResponse } from "next";

interface TokenResponse {
  token: Ably.Types.TokenDetails;
}

export default function ablyTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse | { error: string }>
) {
  const ablyRestAPI = new Ably.Rest({ key: env.ABLY_ROOT_KEY });
  ablyRestAPI.auth.requestToken(
    {
      //* TODO: client details *//
    },
    null,
    (err, token) => {
      if (err) {
        console.error(`Error with token request: ${err.message}`);
        res.status(err.code).json({ error: "Error with token request" });
        return;
      }

      if (token === undefined) {
        console.error(`Failed to receive a token`);
        res.status(500).json({ error: "Failed to receive a token" });
        return;
      }

      res.status(200).json({ token });
    }
  );
}
