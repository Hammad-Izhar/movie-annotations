import type { NextApiRequest, NextApiResponse } from "next";

import Ably from "ably";

export default async function ablyTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  const ably = new Ably.Realtime.Promise({
    key: "xVLyHw.PS9S-g:BiHFwOujN24V-Ma7t8u9tAzjo9OWmY1Ke0psutRJRik",
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
