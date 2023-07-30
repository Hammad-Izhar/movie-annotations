import type { NextApiRequest, NextApiResponse } from "next";

import Ably from "ably";

export default async function ablyTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  const ably = new Ably.Realtime.Promise({
    key: "xVLyHw.1ELyWQ:M_4vLeAe77Y_2JryhcXxA0I3NNGry_3BGm5sSNpJtPc",
  });

  try {
    const token = await ably.auth.createTokenRequest({
      clientId: req.query.clientId as string,
    });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate Ably token" });
  }
}
