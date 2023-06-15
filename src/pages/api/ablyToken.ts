import Ably from "ably";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function ablyTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ably = new Ably.Realtime.Promise({
    key: "xVLyHw.Q2oB1g:pqJ1m2wouMH04a5fSvzvlSLR0DUhG78Z7Vz0WjuaDXY",
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
